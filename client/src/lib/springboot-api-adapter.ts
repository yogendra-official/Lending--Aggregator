import { User } from "@shared/schema";
import { queryClient } from "./queryClient";

// Base URL for the Spring Boot backend
const API_BASE_URL = import.meta.env.VITE_SPRING_BOOT_API_URL || "http://localhost:8080";

// Token storage in localStorage
const ACCESS_TOKEN_KEY = "access_token";
const REFRESH_TOKEN_KEY = "refresh_token";

/**
 * Store JWT tokens in localStorage
 */
export function storeTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  localStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
}

/**
 * Get stored access token
 */
export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

/**
 * Get stored refresh token
 */
export function getRefreshToken(): string | null {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

/**
 * Clear stored tokens on logout
 */
export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
}

/**
 * Check if access token is expired locally
 */
export function isTokenExpired(token: string): boolean {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiryTime = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiryTime;
  } catch (e) {
    console.error("Error checking token expiry:", e);
    return true;
  }
}

/**
 * Validate token using the User Management Microservice
 * Using the /auth/validate-token endpoint
 */
export async function validateToken(token: string): Promise<boolean> {
  if (!token) return false;
  
  try {
    const response = await fetch(`${API_BASE_URL}/auth/validate-token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.ok;
  } catch (error) {
    console.error("Error validating token:", error);
    return false;
  }
}

/**
 * Refresh the access token using refresh token
 * Uses the User Management Microservice's /auth/refresh-token endpoint
 */
export async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = getRefreshToken();
  
  if (!refreshToken) {
    clearTokens();
    queryClient.setQueryData(["/api/user"], null);
    return null;
  }
  
  try {
    // Call the JWT token refresh endpoint from the Spring Boot User Management Microservice
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refreshToken }),
    });
    
    if (!response.ok) {
      // If refresh fails, clear tokens and force re-login
      clearTokens();
      queryClient.setQueryData(["/api/user"], null);
      return null;
    }
    
    const data = await response.json();
    
    // Store the new tokens - Note: Spring Boot may return both tokens or just the access token
    storeTokens(data.accessToken, data.refreshToken || refreshToken);
    return data.accessToken;
  } catch (error) {
    console.error("Error refreshing token:", error);
    clearTokens();
    queryClient.setQueryData(["/api/user"], null);
    return null;
  }
}

/**
 * API fetch wrapper with automatic token refresh
 */
export async function apiFetch(
  url: string,
  options?: RequestInit
): Promise<Response> {
  let accessToken = getAccessToken();
  
  // Check if token is expired (locally first, then server validation)
  if (accessToken) {
    // If token is expired locally, try to refresh it
    if (isTokenExpired(accessToken)) {
      accessToken = await refreshAccessToken();
      if (!accessToken) {
        throw new Error("Session expired. Please login again.");
      }
    }
    // Even if not expired locally, validate with server occasionally (20% of requests)
    else if (Math.random() < 0.2) {
      const isValid = await validateToken(accessToken);
      if (!isValid) {
        // If server says token is invalid, try to refresh
        accessToken = await refreshAccessToken();
        if (!accessToken) {
          throw new Error("Session expired. Please login again.");
        }
      }
    }
  }
  
  // Prepare request with token
  const headers = new Headers(options?.headers);
  if (accessToken) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  
  // Add Content-Type if not set and body exists
  if (options?.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  
  // Make the request
  const response = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers,
  });
  
  // If unauthorized and we have a refresh token, try refreshing and retry
  if (response.status === 401 && getRefreshToken()) {
    const newAccessToken = await refreshAccessToken();
    if (newAccessToken) {
      headers.set("Authorization", `Bearer ${newAccessToken}`);
      return fetch(`${API_BASE_URL}${url}`, {
        ...options,
        headers,
      });
    }
  }
  
  return response;
}

/**
 * API request function adapted for Spring Boot backend
 */
export async function springBootApiRequest(
  method: string,
  url: string,
  data?: unknown | undefined
): Promise<Response> {
  const options: RequestInit = {
    method,
    body: data ? JSON.stringify(data) : undefined,
  };
  
  const response = await apiFetch(url, options);
  
  if (!response.ok) {
    let errorMessage = `Request failed with status: ${response.status}`;
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // If parse fails, use default error message
    }
    
    const error = new Error(errorMessage);
    (error as any).status = response.status;
    throw error;
  }
  
  return response;
}

/**
 * Mapping function to convert Spring Boot user format to our frontend User model
 */
export function mapUserFromSpringBoot(backendUser: any): User {
  return {
    id: backendUser.id,
    email: backendUser.email,
    username: backendUser.email.split('@')[0], // Use email prefix as username
    password: '', // Password is not returned from backend API for security
    firstName: backendUser.name ? backendUser.name.split(' ')[0] : '',
    lastName: backendUser.name ? backendUser.name.split(' ').slice(1).join(' ') : '',
    phone: backendUser.mobile || null,
    createdAt: backendUser.createdAt || new Date(),
  };
}

/**
 * Function to get the current user from Spring Boot User Management Microservice
 */
export async function getCurrentUser(): Promise<User | null> {
  try {
    if (!getAccessToken()) return null;
    
    // Using the profile endpoint from the User Management Microservice
    const response = await apiFetch('/profile', {
      method: 'GET'
    });
    
    if (!response.ok) {
      if (response.status === 401) return null;
      throw new Error(`Failed to get user: ${response.statusText}`);
    }
    
    const backendUser = await response.json();
    return mapUserFromSpringBoot(backendUser);
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Login with Spring Boot backend
 */
export async function loginWithSpringBoot(email: string, password: string) {
  // The User Management Microservice endpoint for authentication
  const response = await fetch(`${API_BASE_URL}/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email, password })
  });
  
  if (!response.ok) {
    let errorMessage = 'Login failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // Use default error message
    }
    throw new Error(errorMessage);
  }
  
  const authData = await response.json();
  
  // Store tokens
  if (authData.accessToken && authData.refreshToken) {
    storeTokens(authData.accessToken, authData.refreshToken);
  } else {
    throw new Error('Invalid authentication response');
  }
  
  // Fetch user profile using the token
  const userResponse = await apiFetch('/profile', {
    method: 'GET'
  });
  
  if (!userResponse.ok) {
    throw new Error('Failed to get user profile after login');
  }
  
  const userProfile = await userResponse.json();
  return mapUserFromSpringBoot(userProfile);
}

/**
 * Register with Spring Boot User Management Microservice
 */
export async function registerWithSpringBoot(userData: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}) {
  // Format the data for Spring Boot User Management Microservice
  const backendUserData = {
    name: `${userData.firstName} ${userData.lastName}`,
    email: userData.email,
    password: userData.password,
    mobile: userData.firstName && userData.lastName ? 
      '' : // Optional in our schema, but prepare an empty string for backend
      '9876543210' // Default mobile number if not provided
  };
  
  const response = await fetch(`${API_BASE_URL}/auth/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(backendUserData)
  });
  
  if (!response.ok) {
    let errorMessage = 'Registration failed';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // Use default error message
    }
    throw new Error(errorMessage);
  }
  
  // If registration auto-logs in user
  const authData = await response.json();
  
  // Check if registration returns tokens directly
  if (authData.accessToken && authData.refreshToken) {
    storeTokens(authData.accessToken, authData.refreshToken);
    
    // Fetch user profile
    const userResponse = await apiFetch('/profile', {
      method: 'GET'
    });
    
    if (!userResponse.ok) {
      throw new Error('Failed to get user profile after registration');
    }
    
    const userProfile = await userResponse.json();
    return mapUserFromSpringBoot(userProfile);
  }
  
  // If registration doesn't auto-login, return the mapped user
  return mapUserFromSpringBoot(authData);
}

/**
 * Logout from Spring Boot User Management Microservice
 * This will invalidate the user's session and tokens on the server
 */
export async function logoutFromSpringBoot() {
  const refreshToken = getRefreshToken();
  const accessToken = getAccessToken();
  
  if (refreshToken && accessToken) {
    try {
      // Call the logout endpoint from Spring Boot User Management Microservice
      await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ refreshToken })
      });
    } catch (e) {
      console.error("Error during logout:", e);
      // Continue with logout process even if server call fails
    }
  }
  
  // Always clear tokens from local storage even if the server call fails
  clearTokens();
  
  // Clear user data from cache
  queryClient.setQueryData(["/api/user"], null);
  queryClient.invalidateQueries({ queryKey: ["/api/user"] });
}

/**
 * Update user profile in Spring Boot User Management Microservice
 * Using the PUT /profile endpoint
 */
export async function updateUserProfile(userData: {
  name?: string;
  email?: string;
  mobile?: string;
}) {
  // Make sure the data structure matches what Spring Boot expects
  const profileData: Record<string, any> = {};
  
  if (userData.name) {
    profileData.name = userData.name;
  }
  
  if (userData.email) {
    profileData.email = userData.email;
  }
  
  if (userData.mobile) {
    profileData.mobile = userData.mobile;
  }
  
  const response = await springBootApiRequest('PUT', '/profile', profileData);
  
  if (!response.ok) {
    let errorMessage = 'Failed to update profile';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // Use default error message
    }
    throw new Error(errorMessage);
  }
  
  const updatedUser = await response.json();
  return mapUserFromSpringBoot(updatedUser);
}

/**
 * Change password in Spring Boot User Management Microservice
 * Using the /auth/change-password endpoint
 */
export async function changePassword(data: {
  currentPassword: string;
  newPassword: string;
}) {
  // Format data as expected by Spring Boot backend
  const passwordData = {
    oldPassword: data.currentPassword,
    newPassword: data.newPassword
  };
  
  const response = await springBootApiRequest('POST', '/auth/change-password', passwordData);
  
  if (!response.ok) {
    let errorMessage = 'Failed to change password';
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch (e) {
      // Use default error message
    }
    throw new Error(errorMessage);
  }
  
  return true;
}
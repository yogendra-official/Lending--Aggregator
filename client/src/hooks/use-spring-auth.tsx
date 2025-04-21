import { createContext, ReactNode, useContext, useEffect } from "react";
import {
  useQuery,
  useMutation,
  UseMutationResult,
  useQueryClient,
} from "@tanstack/react-query";
import { User } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import {
  getCurrentUser,
  loginWithSpringBoot,
  registerWithSpringBoot,
  logoutFromSpringBoot,
  updateUserProfile,
} from "@/lib/springboot-api-adapter";

type AuthContextType = {
  user: User | null;
  isLoading: boolean;
  error: Error | null;
  loginMutation: UseMutationResult<User, Error, LoginData>;
  logoutMutation: UseMutationResult<void, Error, void>;
  registerMutation: UseMutationResult<User, Error, RegisterData>;
  updateProfileMutation: UseMutationResult<User, Error, UpdateProfileData>;
};

type LoginData = {
  email: string;
  password: string;
};

type RegisterData = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

type UpdateProfileData = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
};

export const SpringAuthContext = createContext<AuthContextType | null>(null);

export function SpringAuthProvider({ children }: { children: ReactNode }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const {
    data: user,
    error,
    isLoading,
    refetch,
  } = useQuery<User | null, Error>({
    queryKey: ["/api/user"],
    queryFn: async () => {
      return await getCurrentUser();
    },
  });

  // Periodically verify token validity
  useEffect(() => {
    const intervalId = setInterval(() => {
      refetch();
    }, 5 * 60 * 1000); // Check every 5 minutes

    return () => clearInterval(intervalId);
  }, [refetch]);

  const loginMutation = useMutation({
    mutationFn: async (credentials: LoginData) => {
      console.log("Spring Boot login mutation called with:", credentials);
      try {
        const user = await loginWithSpringBoot(credentials.email, credentials.password);
        console.log("Spring Boot login successful:", user);
        return user;
      } catch (err) {
        console.error("Spring Boot login error:", err);
        throw err;
      }
    },
    onSuccess: (user: User) => {
      console.log("Spring Boot login success handler, setting user data", user);
      queryClient.setQueryData(["/api/user"], user);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Login successful",
        description: `Welcome back, ${user.firstName || (user.email ? user.email.split('@')[0] : 'user')}!`,
      });
    },
    onError: (error: Error) => {
      console.error("Spring Boot login error handler:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    },
  });

  const registerMutation = useMutation({
    mutationFn: async (userData: RegisterData) => {
      console.log("Spring Boot register mutation called with:", userData);
      try {
        const user = await registerWithSpringBoot(userData);
        console.log("Registration successful:", user);
        return user;
      } catch (err) {
        console.error("Registration error:", err);
        throw err;
      }
    },
    onSuccess: (user: User) => {
      console.log("Registration success handler, setting user data", user);
      queryClient.setQueryData(["/api/user"], user);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Registration successful",
        description: `Welcome, ${user.firstName || (user.email ? user.email.split('@')[0] : 'user')}!`,
      });
    },
    onError: (error: Error) => {
      console.error("Registration error handler:", error);
      toast({
        title: "Registration failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: async () => {
      console.log("Spring Boot logout mutation called");
      await logoutFromSpringBoot();
    },
    onSuccess: () => {
      console.log("Logout successful, clearing user data");
      queryClient.setQueryData(["/api/user"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Logged out",
        description: "You have been logged out successfully.",
      });
    },
    onError: (error: Error) => {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateProfileMutation = useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      console.log("Update profile mutation called with:", data);
      
      // Format data for Spring Boot backend
      const backendData = {
        name: data.firstName && data.lastName 
          ? `${data.firstName} ${data.lastName}` 
          : undefined,
        email: data.email,
        mobile: data.phone,
      };
      
      const user = await updateUserProfile(backendData);
      return user;
    },
    onSuccess: (user: User) => {
      queryClient.setQueryData(["/api/user"], user);
      queryClient.invalidateQueries({ queryKey: ["/api/user"] });
      toast({
        title: "Profile updated",
        description: "Your profile has been updated successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <SpringAuthContext.Provider
      value={{
        user: user ?? null,
        isLoading,
        error,
        loginMutation,
        logoutMutation,
        registerMutation,
        updateProfileMutation,
      }}
    >
      {children}
    </SpringAuthContext.Provider>
  );
}

export function useSpringAuth() {
  const context = useContext(SpringAuthContext);
  if (!context) {
    throw new Error("useSpringAuth must be used within a SpringAuthProvider");
  }
  return context;
}
import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { WalletIcon, BankIcon, CreditCardIcon } from "@/components/ui/icons";
import { insertUserSchema } from "@shared/schema";

// Login form schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean().optional().default(false)
});

// Register form schema
const registerSchema = insertUserSchema.extend({
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type LoginFormValues = z.infer<typeof loginSchema>;
type RegisterFormValues = z.infer<typeof registerSchema>;

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loginMutation, registerMutation } = useAuth();
  const [_location, navigate] = useLocation();
  const [matched] = useRoute("/auth");

  // Form initialization
  const loginForm = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false
    }
  });

  const registerForm = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    }
  });

  // Redirection if user is already logged in
  useEffect(() => {
    if (matched && user) {
      navigate("/");
    }
  }, [matched, user, navigate]);

  // Form submission handlers
  const onLoginSubmit = (values: LoginFormValues) => {
    console.log("Login values:", values);
    loginMutation.mutate({
      email: values.email,
      password: values.password
    });
  };

  const onRegisterSubmit = (values: RegisterFormValues) => {
    console.log("Register values:", values);
    const { confirmPassword, ...registerData } = values;
    
    // Ensure all required fields are included
    const userData = {
      ...registerData,
      // Default username as email if not provided
      username: registerData.email?.split('@')[0] || null
    };
    
    console.log("Submitting user data:", userData);
    registerMutation.mutate(userData);
  };

  // Indian financial institutions
  const indianBanks = [
    { name: "State Bank of India", icon: BankIcon, color: "blue" },
    { name: "HDFC Bank", icon: BankIcon, color: "red" },
    { name: "ICICI Bank", icon: BankIcon, color: "orange" },
    { name: "Axis Bank", icon: BankIcon, color: "purple" },
    { name: "Kotak Mahindra Bank", icon: BankIcon, color: "red" },
    { name: "Bank of Baroda", icon: BankIcon, color: "green" },
    { name: "Punjab National Bank", icon: BankIcon, color: "blue" },
    { name: "Canara Bank", icon: BankIcon, color: "yellow" }
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-[#f6f8ff] to-[#f0f5ff]">
      <div className="relative w-full max-w-5xl glass-card overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 rounded-full indian-gradient-1 blur-2xl opacity-20"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 rounded-full indian-gradient-2 blur-2xl opacity-20"></div>
        
        <div className="w-full grid md:grid-cols-2 gap-0 items-stretch">
          {/* Left side - Form */}
          <Card className="w-full shadow-none border-0 hover-card">
            <CardHeader className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-primary rounded-full mb-4 shadow-lg">
                <WalletIcon className="text-white h-10 w-10" />
              </div>
              <CardTitle className="text-3xl font-bold text-gray-900">Indian Finance Hub</CardTitle>
              <CardDescription className="text-lg">Manage all your accounts in one place</CardDescription>
            </CardHeader>
          
            <CardContent>
              {/* Toggle between login and register */}
              <div className="flex justify-center mb-6">
                <div className="inline-flex rounded-md border border-gray-200 overflow-hidden">
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium ${isLogin ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setIsLogin(true)}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 text-sm font-medium ${!isLogin ? 'bg-primary text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                    onClick={() => setIsLogin(false)}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
              
              {isLogin ? (
                /* Login Form */
                <Form {...loginForm}>
                  <form onSubmit={loginForm.handleSubmit(onLoginSubmit)} className="space-y-4">
                    <FormField
                      control={loginForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              className="input-modern"
                              type="email"
                              placeholder="Enter your email" 
                              value={field.value || ""} 
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={loginForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              className="input-modern"
                              type="password" 
                              placeholder="Enter your password" 
                              value={field.value || ""} 
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex items-center justify-between">
                      <FormField
                        control={loginForm.control}
                        name="rememberMe"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                            <FormControl>
                              <Checkbox 
                                checked={field.value} 
                                onCheckedChange={field.onChange} 
                              />
                            </FormControl>
                            <FormLabel className="text-sm font-normal cursor-pointer">
                              Remember me
                            </FormLabel>
                          </FormItem>
                        )}
                      />
                      <a href="#" className="text-sm font-medium text-primary hover:text-primary/80">
                        Forgot password?
                      </a>
                    </div>
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-white hover:bg-primary/90" 
                      disabled={loginMutation.isPending}
                    >
                      {loginMutation.isPending ? "Signing in..." : "Sign in"}
                    </Button>
                  </form>
                </Form>
              ) : (
                /* Register Form */
                <Form {...registerForm}>
                  <form onSubmit={registerForm.handleSubmit(onRegisterSubmit)} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={registerForm.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input 
                                className="input-modern" 
                                placeholder="Rahul" 
                                value={field.value || ""} 
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={registerForm.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input 
                                className="input-modern" 
                                placeholder="Sharma" 
                                value={field.value || ""} 
                                onChange={field.onChange}
                                onBlur={field.onBlur}
                                name={field.name}
                                ref={field.ref}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={registerForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input 
                              className="input-modern"
                              type="email" 
                              placeholder="rahul.sharma@example.com" 
                              value={field.value || ""} 
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Password</FormLabel>
                          <FormControl>
                            <Input 
                              className="input-modern"
                              type="password" 
                              placeholder="Create a password" 
                              value={field.value || ""} 
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={registerForm.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Confirm Password</FormLabel>
                          <FormControl>
                            <Input 
                              className="input-modern"
                              type="password" 
                              placeholder="Confirm your password" 
                              value={field.value || ""} 
                              onChange={field.onChange}
                              onBlur={field.onBlur}
                              name={field.name}
                              ref={field.ref}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <Button 
                      type="submit" 
                      className="w-full bg-primary text-white hover:bg-primary/90" 
                      disabled={registerMutation.isPending}
                    >
                      {registerMutation.isPending ? "Creating account..." : "Create account"}
                    </Button>
                  </form>
                </Form>
              )}
              
              {/* Social Login */}
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-3">
                  <Button variant="outline" type="button" className="w-full bg-white hover:bg-gray-50">
                    <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 488 512">
                      <path d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z" />
                    </svg>
                    Google
                  </Button>
                  <Button variant="outline" type="button" className="w-full bg-white hover:bg-gray-50">
                    <svg className="w-5 h-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 384 512">
                      <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
                    </svg>
                    Apple
                  </Button>
                </div>
              </div>
              
              {/* Toggle form type */}
              <p className="mt-6 text-center text-sm text-gray-600">
                {isLogin ? "Don't have an account?" : "Already have an account?"}
                <button
                  type="button"
                  className="ml-1 font-medium text-primary hover:text-primary/80"
                  onClick={() => setIsLogin(!isLogin)}
                >
                  {isLogin ? "Sign up now" : "Sign in"}
                </button>
              </p>
            </CardContent>
          </Card>

          {/* Right side - Hero with Indian banking context */}
          <div className="hidden md:block bg-gradient-to-br from-white to-primary/5 p-8 rounded-r-lg">
            <h2 className="text-2xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              India's Unified Financial Platform
            </h2>
            <p className="text-gray-600 mb-6">
              Connect all your Indian bank accounts and financial tools in one secure dashboard
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-8">
              {indianBanks.slice(0, 4).map((bank, index) => (
                <div key={index} className="flex items-center p-3 bg-white rounded-lg shadow-sm hover-card stagger-item">
                  <div className={`rounded-full p-2 mr-2 bg-${bank.color}-100`}>
                    <bank.icon className={`h-5 w-5 text-${bank.color}-600`} />
                  </div>
                  <span className="text-sm font-medium">{bank.name}</span>
                </div>
              ))}
            </div>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="bg-white rounded-full p-2 mr-3 shadow-sm">
                  <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Track All Accounts</h3>
                  <p className="text-sm text-gray-500">Connect to all major Indian banks and financial institutions</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white rounded-full p-2 mr-3 shadow-sm">
                  <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Financial Insights</h3>
                  <p className="text-sm text-gray-500">Detailed reports and insights about your spending patterns</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="bg-white rounded-full p-2 mr-3 shadow-sm">
                  <svg className="h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-medium">Secure & Private</h3>
                  <p className="text-sm text-gray-500">Bank-level security with Account Aggregator framework compliance</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
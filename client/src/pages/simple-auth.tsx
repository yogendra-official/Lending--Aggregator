import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation } from "wouter";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label"; 
import { Separator } from "@/components/ui/separator";
import { Eye, EyeOff, Mail, Lock, User, FileText } from "lucide-react";

export default function SimpleAuthPage() {
  const [, navigate] = useLocation();
  const { user, loginMutation, registerMutation } = useAuth();
  
  // Login state
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  
  // Register state
  const [registerEmail, setRegisterEmail] = useState("");
  const [registerPassword, setRegisterPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  
  // If user already logged in, redirect to dashboard
  if (user) {
    navigate("/");
    return null;
  }
  
  const handleLogin = (e) => {
    e.preventDefault();
    console.log("Login form submitted:", { loginEmail, loginPassword });
    
    try {
      loginMutation.mutate({
        email: loginEmail,
        password: loginPassword
      });
      console.log("Login mutation called");
    } catch (error) {
      console.error("Error in login:", error);
    }
  };
  
  const handleRegister = (e) => {
    e.preventDefault();
    
    if (!agreeToTerms) {
      alert("Please agree to the terms and conditions");
      return;
    }
    
    console.log("Register form submitted:", { registerEmail, registerPassword, firstName, lastName });
    
    try {
      registerMutation.mutate({
        email: registerEmail,
        password: registerPassword,
        firstName: firstName || null,
        lastName: lastName || null,
        username: registerEmail.split('@')[0] || null
      });
      console.log("Register mutation called");
    } catch (error) {
      console.error("Error in register:", error);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-r from-indigo-50 via-purple-50 to-blue-50">
      {/* Left Side - Brand Message */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-teal-600 to-emerald-700 p-12 flex-col justify-center items-center text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-15"></div>
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1616077168627-01e184e97c17')] bg-cover bg-center opacity-20 mix-blend-overlay"></div>
        
        <div className="relative z-10 max-w-md space-y-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-emerald-200">
              Indian Finance Hub
            </span>
          </h1>
          <p className="text-xl text-emerald-100 mb-8">Your complete financial management solution for all Indian banks and investments</p>
          
          <div className="space-y-6">
            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white">Connect all your accounts</h3>
                <p className="text-emerald-100">View all your financial accounts in one dashboard</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white">Track expenses</h3>
                <p className="text-emerald-100">Monitor your spending habits with detailed reports</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-4">
              <div className="bg-white bg-opacity-20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-white">Investment insights</h3>
                <p className="text-emerald-100">Get smart recommendations to grow your wealth</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Right Side - Auth Forms */}
      <div className="w-full lg:w-1/2 p-4 md:p-8 lg:p-12 flex items-center justify-center">
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/70 backdrop-blur-sm">
          <CardHeader className="text-center space-y-2">
            <div className="mx-auto w-16 h-16 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="5" width="20" height="14" rx="2" />
                <path d="M16 10V8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-2" />
                <path d="M22 10h-4.5a1.5 1.5 0 0 0 0 3h1a1.5 1.5 0 0 1 0 3H14" />
                <path d="M18 9v1" />
                <path d="M18 14v1" />
              </svg>
            </div>
            <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-emerald-600">Indian Finance Hub</CardTitle>
            <CardDescription className="text-gray-600">Secure access to your financial dashboard</CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-8 rounded-full p-1 bg-gray-100">
                <TabsTrigger 
                  value="login" 
                  className="rounded-full font-medium text-sm transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
                >
                  Sign In
                </TabsTrigger>
                <TabsTrigger 
                  value="register" 
                  className="rounded-full font-medium text-sm transition-all data-[state=active]:bg-gradient-to-r data-[state=active]:from-teal-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white"
                >
                  Create Account
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-5">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      Email Address
                    </Label>
                    <Input 
                      id="email"
                      type="email" 
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="rounded-lg border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input 
                        id="password"
                        type={showLoginPassword ? "text" : "password"}
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        placeholder="Enter your password"
                        className="rounded-lg border-gray-300 focus:ring-teal-500 focus:border-teal-500 pr-10"
                        required
                      />
                      <button 
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() => setShowLoginPassword(!showLoginPassword)}
                      >
                        {showLoginPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <Checkbox 
                        id="remember-me" 
                        checked={rememberMe}
                        onCheckedChange={setRememberMe}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                      <Label 
                        htmlFor="remember-me" 
                        className="ml-2 block text-sm text-gray-700"
                      >
                        Remember me
                      </Label>
                    </div>
                    <a href="#" className="text-sm font-medium text-teal-600 hover:text-teal-500">
                      Forgot password?
                    </a>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full rounded-lg h-11 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg text-base font-medium"
                    disabled={loginMutation.isPending}
                  >
                    {loginMutation.isPending ? "Signing in..." : "Sign in"}
                  </Button>
                  
                  {loginMutation.isError && (
                    <div className="p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-200">
                      {loginMutation.error?.message || "Login failed. Please check your credentials."}
                    </div>
                  )}
                  
                  <div className="mt-6">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <Separator className="w-full" />
                      </div>
                      <div className="relative flex justify-center text-sm">
                        <span className="px-2 bg-white text-gray-500">Or continue with</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <Button variant="outline" type="button" className="rounded-lg h-10">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20.3081 10.2303C20.3081 9.55056 20.253 8.86711 20.1354 8.19836H10.7031V12.0492H16.1046C15.8804 13.2911 15.1602 14.3898 14.1057 15.0879V17.5866H17.3282C19.2205 15.8449 20.3081 13.2728 20.3081 10.2303Z" fill="#3F83F8"/>
                          <path d="M10.7019 20.0006C13.3989 20.0006 15.6734 19.1151 17.3306 17.5865L14.1081 15.0879C13.2115 15.6979 12.0541 16.0433 10.7056 16.0433C8.09669 16.0433 5.88468 14.2832 5.091 11.9169H1.76562V14.4927C3.46322 17.8695 6.92087 20.0006 10.7019 20.0006V20.0006Z" fill="#34A853"/>
                          <path d="M5.08857 11.9169C4.66969 10.6749 4.66969 9.33008 5.08857 8.08811V5.51233H1.76688C0.348541 8.33798 0.348541 11.667 1.76688 14.4927L5.08857 11.9169V11.9169Z" fill="#FBBC04"/>
                          <path d="M10.7019 3.95805C12.1276 3.936 13.5055 4.47247 14.538 5.45722L17.393 2.60218C15.5852 0.904587 13.1858 -0.0287217 10.7019 0.000673888C6.92087 0.000673888 3.46322 2.13185 1.76562 5.51234L5.08732 8.08813C5.87733 5.71811 8.09302 3.95805 10.7019 3.95805V3.95805Z" fill="#EA4335"/>
                        </svg>
                        Google
                      </Button>
                      <Button variant="outline" type="button" className="rounded-lg h-10">
                        <svg className="w-5 h-5 mr-2" viewBox="0 0 18 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path fillRule="evenodd" clipRule="evenodd" d="M13.2224 3.2C13.9026 2.3515 14.3053 1.1935 14.2032 0C13.1705 0.033 11.9378 0.6685 11.2322 1.512C10.5916 2.262 10.1171 3.4135 10.2364 4.5785C11.3804 4.65 12.5447 4.0485 13.2224 3.2ZM17.4468 15.341C17.5366 15.2425 17.6212 15.142 17.7004 15.039C16.6895 13.6175 16.1767 12.5345 16.1647 11.841C16.1452 10.801 16.6649 9.878 17.2054 9.281C16.5169 8.3325 15.3919 7.7 14.4486 7.7C13.9026 7.7 13.3731 7.854 12.9143 7.969C12.5642 8.061 12.2479 8.144 11.9834 8.144C11.687 8.144 11.3532 8.0535 10.988 7.9545C10.5313 7.8295 10.0166 7.6895 9.47707 7.6895C8.1946 7.6895 6.87974 8.578 6.08429 10.0485C4.94623 12.1265 5.2401 16.035 7.13576 19.315C7.9362 20.6965 8.93585 21.895 10.0738 21.9C10.4972 21.91 10.8112 21.818 11.1426 21.722C11.5167 21.615 11.91 21.5 12.4365 21.5C12.9581 21.5 13.3463 21.6135 13.7153 21.7215C14.0545 21.8225 14.3771 21.918 14.8175 21.91C15.9824 21.8935 17.0195 20.566 17.8175 19.189C18.213 18.404 18.4846 17.636 18.6334 16.9865C18.0611 16.765 17.4323 16.1885 17.4468 15.341Z" fill="black"/>
                        </svg>
                        Apple
                      </Button>
                    </div>
                  </div>
                </form>
              </TabsContent>
              
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="first-name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        First Name
                      </Label>
                      <Input 
                        id="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="John"
                        className="rounded-lg border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="last-name" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                        <User className="h-4 w-4 text-gray-500" />
                        Last Name
                      </Label>
                      <Input 
                        id="last-name"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Doe"
                        className="rounded-lg border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      Email Address
                    </Label>
                    <Input 
                      id="register-email"
                      type="email" 
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      placeholder="john@example.com"
                      className="rounded-lg border-gray-300 focus:ring-teal-500 focus:border-teal-500"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                      <Lock className="h-4 w-4 text-gray-500" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input 
                        id="register-password"
                        type={showRegisterPassword ? "text" : "password"}
                        value={registerPassword}
                        onChange={(e) => setRegisterPassword(e.target.value)}
                        placeholder="Create a strong password"
                        className="rounded-lg border-gray-300 focus:ring-teal-500 focus:border-teal-500 pr-10"
                        required
                      />
                      <button 
                        type="button"
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                        onClick={() => setShowRegisterPassword(!showRegisterPassword)}
                      >
                        {showRegisterPassword ? (
                          <EyeOff className="h-5 w-5" />
                        ) : (
                          <Eye className="h-5 w-5" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      Password must be at least 6 characters
                    </p>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <Checkbox 
                        id="terms" 
                        checked={agreeToTerms}
                        onCheckedChange={setAgreeToTerms}
                        className="text-teal-600 focus:ring-teal-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <Label 
                        htmlFor="terms"
                        className="font-medium text-gray-700"
                      >
                        I agree to the <a href="#" className="text-teal-600 hover:text-teal-500">Terms of Service</a> and <a href="#" className="text-teal-600 hover:text-teal-500">Privacy Policy</a>
                      </Label>
                    </div>
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full rounded-lg h-11 bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg text-base font-medium"
                    disabled={registerMutation.isPending}
                  >
                    {registerMutation.isPending ? "Creating account..." : "Create Account"}
                  </Button>
                  
                  {registerMutation.isError && (
                    <div className="p-3 text-sm bg-red-50 text-red-600 rounded-lg border border-red-200">
                      {registerMutation.error?.message || "Registration failed. Please try again."}
                    </div>
                  )}
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
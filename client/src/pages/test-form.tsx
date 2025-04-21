import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function TestForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");

  const handleBasicSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Basic form submitted:", { email, password });
    setResult(`Form submitted with: ${email}, ${password}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Test Form</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleBasicSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <Input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter email"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Password</label>
              <Input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>
            
            <Button type="submit" className="w-full">
              Submit Test Form
            </Button>
          </form>
          
          {result && (
            <div className="mt-4 p-3 bg-green-50 text-green-700 rounded">
              {result}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
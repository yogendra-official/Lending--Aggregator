import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { SiZerodha, SiZoom } from "react-icons/si";
import { Link2, AlertCircle, ExternalLink } from "lucide-react";

interface PlatformConnectionProps {
  onConnect: (platform: string, token: string) => void;
  activePlatform: string | null;
}

export default function PlatformConnection({ onConnect, activePlatform }: PlatformConnectionProps) {
  const [zerodhaToken, setZerodhaToken] = useState<string>('');
  const [growToken, setGrowToken] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('zerodha');
  
  const handleConnect = () => {
    if (activeTab === 'zerodha' && zerodhaToken) {
      onConnect('zerodha', zerodhaToken);
    } else if (activeTab === 'grow' && growToken) {
      onConnect('grow', growToken);
    }
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Connect Platform</CardTitle>
        <CardDescription>
          Link your investment platform to import your portfolio or make new investments
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="zerodha" onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="zerodha">Zerodha</TabsTrigger>
            <TabsTrigger value="grow">Grow</TabsTrigger>
          </TabsList>
          
          <TabsContent value="zerodha" className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <SiZerodha className="h-8 w-8 text-primary" />
              <div>
                <h3 className="font-medium">Zerodha Kite</h3>
                <p className="text-sm text-muted-foreground">India's largest stock broker</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="zerodha-token">API Token</Label>
                <Input
                  id="zerodha-token"
                  placeholder="Enter your Zerodha API token"
                  value={zerodhaToken}
                  onChange={(e) => setZerodhaToken(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You can get this from your Zerodha Kite account settings.
                </p>
              </div>
              
              <div className="pt-2">
                <Button
                  onClick={handleConnect}
                  disabled={!zerodhaToken}
                  className="w-full"
                  variant={activePlatform === 'zerodha' ? 'secondary' : 'default'}
                >
                  {activePlatform === 'zerodha' ? 'Connected' : 'Connect'} to Zerodha
                </Button>
              </div>
              
              <div className="pt-2">
                <a 
                  href="https://kite.zerodha.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Get token from Zerodha
                </a>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="grow" className="space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <SiZoom className="h-8 w-8 text-primary" /> {/* Using Zoom icon as placeholder for Grow */}
              <div>
                <h3 className="font-medium">Grow (Formerly Groww)</h3>
                <p className="text-sm text-muted-foreground">Online investment platform</p>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="grow-token">API Token</Label>
                <Input
                  id="grow-token"
                  placeholder="Enter your Grow API token"
                  value={growToken}
                  onChange={(e) => setGrowToken(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  You can get this from your Grow account settings.
                </p>
              </div>
              
              <div className="pt-2">
                <Button
                  onClick={handleConnect}
                  disabled={!growToken}
                  className="w-full"
                  variant={activePlatform === 'grow' ? 'secondary' : 'default'}
                >
                  {activePlatform === 'grow' ? 'Connected' : 'Connect'} to Grow
                </Button>
              </div>
              
              <div className="pt-2">
                <a 
                  href="https://groww.in" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1 text-sm text-primary hover:underline"
                >
                  <ExternalLink className="h-3 w-3" />
                  Get token from Grow
                </a>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      
      <CardFooter className="flex-col items-start gap-3">
        <Alert>
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Your API tokens are securely stored and used only for connecting to your investment platforms.
          </AlertDescription>
        </Alert>
        
        {activePlatform && (
          <div className="bg-muted p-3 rounded-md w-full">
            <div className="flex items-center gap-2">
              <Link2 className="h-4 w-4 text-primary" />
              <p className="text-sm font-medium">
                Connected to {activePlatform.charAt(0).toUpperCase() + activePlatform.slice(1)}
              </p>
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  );
}
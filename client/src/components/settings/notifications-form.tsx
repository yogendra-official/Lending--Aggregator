import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export default function NotificationsForm() {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    securityAlerts: true,
    accountUpdates: true,
    transactionAlerts: true,
    marketUpdates: false,
    promotions: false,
    budgetAlerts: true,
    weeklyReports: true,
    monthlyReports: true,
    pushNotifications: true,
    emailNotifications: true,
    smsNotifications: false,
  });

  const handleToggle = (setting: keyof typeof settings) => {
    setSettings({
      ...settings,
      [setting]: !settings[setting],
    });
  };

  const handleSave = () => {
    // In a real app, this would send the settings to the API
    toast({
      title: "Notification preferences saved",
      description: "Your notification preferences have been updated.",
    });
  };

  return (
    <div className="md:grid md:grid-cols-3 md:gap-6">
      <div className="md:col-span-1">
        <h3 className="text-lg font-medium leading-6 text-gray-900">Notification Preferences</h3>
        <p className="mt-1 text-sm text-gray-500">
          Customize which notifications you receive and how you receive them.
        </p>
      </div>
      
      <div className="mt-5 md:mt-0 md:col-span-2">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-medium text-gray-900 mb-3">Alert Preferences</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="securityAlerts" className="font-medium">Security Alerts</Label>
                  <p className="text-sm text-gray-500">Important alerts about your account security</p>
                </div>
                <Switch 
                  id="securityAlerts" 
                  checked={settings.securityAlerts} 
                  onCheckedChange={() => handleToggle("securityAlerts")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="accountUpdates" className="font-medium">Account Updates</Label>
                  <p className="text-sm text-gray-500">Updates about your linked accounts and connections</p>
                </div>
                <Switch 
                  id="accountUpdates" 
                  checked={settings.accountUpdates} 
                  onCheckedChange={() => handleToggle("accountUpdates")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="transactionAlerts" className="font-medium">Transaction Alerts</Label>
                  <p className="text-sm text-gray-500">Alerts for large or unusual transactions</p>
                </div>
                <Switch 
                  id="transactionAlerts" 
                  checked={settings.transactionAlerts} 
                  onCheckedChange={() => handleToggle("transactionAlerts")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="marketUpdates" className="font-medium">Market Updates</Label>
                  <p className="text-sm text-gray-500">Updates on market changes affecting your investments</p>
                </div>
                <Switch 
                  id="marketUpdates" 
                  checked={settings.marketUpdates} 
                  onCheckedChange={() => handleToggle("marketUpdates")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="promotions" className="font-medium">Promotions</Label>
                  <p className="text-sm text-gray-500">Special offers and promotions from our partners</p>
                </div>
                <Switch 
                  id="promotions" 
                  checked={settings.promotions} 
                  onCheckedChange={() => handleToggle("promotions")}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Budget & Reports</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="budgetAlerts" className="font-medium">Budget Alerts</Label>
                  <p className="text-sm text-gray-500">Notifications when you approach or exceed budget limits</p>
                </div>
                <Switch 
                  id="budgetAlerts" 
                  checked={settings.budgetAlerts} 
                  onCheckedChange={() => handleToggle("budgetAlerts")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="weeklyReports" className="font-medium">Weekly Summaries</Label>
                  <p className="text-sm text-gray-500">Weekly spending and saving summaries</p>
                </div>
                <Switch 
                  id="weeklyReports" 
                  checked={settings.weeklyReports} 
                  onCheckedChange={() => handleToggle("weeklyReports")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="monthlyReports" className="font-medium">Monthly Reports</Label>
                  <p className="text-sm text-gray-500">Detailed monthly financial reports</p>
                </div>
                <Switch 
                  id="monthlyReports" 
                  checked={settings.monthlyReports} 
                  onCheckedChange={() => handleToggle("monthlyReports")}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-900 mb-3">Notification Channels</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="pushNotifications" className="font-medium">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications in the app</p>
                </div>
                <Switch 
                  id="pushNotifications" 
                  checked={settings.pushNotifications} 
                  onCheckedChange={() => handleToggle("pushNotifications")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="emailNotifications" className="font-medium">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive notifications via email</p>
                </div>
                <Switch 
                  id="emailNotifications" 
                  checked={settings.emailNotifications} 
                  onCheckedChange={() => handleToggle("emailNotifications")}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="smsNotifications" className="font-medium">SMS Notifications</Label>
                  <p className="text-sm text-gray-500">Receive important alerts via SMS</p>
                </div>
                <Switch 
                  id="smsNotifications" 
                  checked={settings.smsNotifications} 
                  onCheckedChange={() => handleToggle("smsNotifications")}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-5 flex justify-end">
            <Button 
              onClick={handleSave}
              className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700 transition-all duration-200 shadow-md hover:shadow-lg"
            >
              Save Preferences
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
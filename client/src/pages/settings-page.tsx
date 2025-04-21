import { useState } from "react";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import ProfileForm from "@/components/settings/profile-form";
import NotificationsForm from "@/components/settings/notifications-form";
import { useAuth } from "@/hooks/use-auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const { user } = useAuth();

  return (
    <SidebarLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
          
          <div className="mt-6">
            <Card>
              <Tabs defaultValue="profile" className="w-full" onValueChange={setActiveTab}>
                <div className="border-b border-gray-200">
                  <TabsList className="px-6 -mb-px flex space-x-8 overflow-x-auto no-scrollbar">
                    <TabsTrigger 
                      value="profile" 
                      className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-800 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
                    >
                      Profile
                    </TabsTrigger>
                    <TabsTrigger 
                      value="security" 
                      className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-800 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
                    >
                      Security
                    </TabsTrigger>
                    <TabsTrigger 
                      value="notifications" 
                      className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-800 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
                    >
                      Notifications
                    </TabsTrigger>
                    <TabsTrigger 
                      value="linked-accounts" 
                      className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-800 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
                    >
                      Linked Accounts
                    </TabsTrigger>
                    <TabsTrigger 
                      value="preferences" 
                      className="whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm text-gray-800 border-transparent data-[state=active]:border-blue-600 data-[state=active]:text-blue-600"
                    >
                      Preferences
                    </TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent value="profile" className="p-6">
                  <ProfileForm user={user} />
                </TabsContent>
                
                <TabsContent value="security" className="p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Security Settings</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage your security settings and authentication methods.
                      </p>
                    </div>
                    
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <form className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Update Password</h4>
                          <div className="mt-2 space-y-4">
                            <div>
                              <label htmlFor="current-password" className="block text-sm font-medium text-gray-700">
                                Current Password
                              </label>
                              <input
                                type="password"
                                name="current-password"
                                id="current-password"
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                              />
                            </div>
                            <div>
                              <label htmlFor="new-password" className="block text-sm font-medium text-gray-700">
                                New Password
                              </label>
                              <input
                                type="password"
                                name="new-password"
                                id="new-password"
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                              />
                            </div>
                            <div>
                              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                                Confirm New Password
                              </label>
                              <input
                                type="password"
                                name="confirm-password"
                                id="confirm-password"
                                className="mt-1 block w-full rounded-md border border-gray-300 py-2 px-3 shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary sm:text-sm"
                              />
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-5">
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              Update Password
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="notifications" className="p-6">
                  <NotificationsForm />
                </TabsContent>
                
                <TabsContent value="linked-accounts" className="p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Linked Accounts</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Manage your linked financial accounts and connections.
                      </p>
                    </div>
                    
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <div className="space-y-4">
                        <div className="bg-gray-50 p-4 text-center rounded-md">
                          <p className="text-sm text-gray-600">
                            This section allows you to manage account connections.
                            For a full view of all your accounts, visit the Linked Accounts page.
                          </p>
                          <div className="mt-4">
                            <a
                              href="/linked-accounts"
                              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              Go to Linked Accounts
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="preferences" className="p-6">
                  <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">Preferences</h3>
                      <p className="mt-1 text-sm text-gray-500">
                        Customize your app experience and display preferences.
                      </p>
                    </div>
                    
                    <div className="mt-5 md:mt-0 md:col-span-2">
                      <form className="space-y-6">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Language</h4>
                          <select
                            id="language"
                            name="language"
                            className="mt-2 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            defaultValue="english"
                          >
                            <option value="english">English</option>
                            <option value="spanish">Spanish</option>
                            <option value="french">French</option>
                            <option value="german">German</option>
                          </select>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Time Zone</h4>
                          <select
                            id="timezone"
                            name="timezone"
                            className="mt-2 block w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-base focus:border-primary focus:outline-none focus:ring-primary sm:text-sm"
                            defaultValue="et"
                          >
                            <option value="et">Eastern Time (US & Canada)</option>
                            <option value="ct">Central Time (US & Canada)</option>
                            <option value="mt">Mountain Time (US & Canada)</option>
                            <option value="pt">Pacific Time (US & Canada)</option>
                          </select>
                        </div>
                        
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">App Theme</h4>
                          <div className="mt-2 space-y-4">
                            <div className="flex items-center">
                              <input
                                id="light"
                                name="theme"
                                type="radio"
                                defaultChecked
                                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                              />
                              <label htmlFor="light" className="ml-3 block text-sm font-medium text-gray-700">
                                Light
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="dark"
                                name="theme"
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                              />
                              <label htmlFor="dark" className="ml-3 block text-sm font-medium text-gray-700">
                                Dark
                              </label>
                            </div>
                            <div className="flex items-center">
                              <input
                                id="system"
                                name="theme"
                                type="radio"
                                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
                              />
                              <label htmlFor="system" className="ml-3 block text-sm font-medium text-gray-700">
                                System Default
                              </label>
                            </div>
                          </div>
                        </div>
                        
                        <div className="pt-5">
                          <div className="flex justify-end">
                            <button
                              type="submit"
                              className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                            >
                              Save Preferences
                            </button>
                          </div>
                        </div>
                      </form>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

import SidebarLayout from "@/components/layouts/sidebar-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, ShieldAlert, DollarSign, ArrowDownCircle, Link, Check } from "lucide-react";

// Sample notifications data - in a real app this would come from an API
const notifications = [
  {
    id: 1,
    type: "security",
    title: "New device logged in",
    description: "A new device was used to access your account",
    date: "Today, 2:34 PM",
    isRead: false
  },
  {
    id: 2,
    type: "account",
    title: "Account synced",
    description: "Your Chase account was successfully synced",
    date: "Today, 1:15 PM",
    isRead: false
  },
  {
    id: 3,
    type: "transaction",
    title: "Large transaction detected",
    description: "A transaction over $500 was recorded from your Chase account",
    date: "Yesterday, 7:25 PM",
    isRead: true
  },
  {
    id: 4,
    type: "account",
    title: "Vanguard connection issue",
    description: "We're having trouble connecting to your Vanguard account",
    date: "May 15, 2023",
    isRead: true
  },
  {
    id: 5,
    type: "transaction",
    title: "Recurring payment processed",
    description: "Your monthly Netflix subscription payment was processed",
    date: "May 14, 2023",
    isRead: true
  },
  {
    id: 6,
    type: "security",
    title: "Password changed",
    description: "Your account password was changed successfully",
    date: "May 10, 2023",
    isRead: true
  },
];

const getIconForNotificationType = (type: string) => {
  switch (type) {
    case "security":
      return <ShieldAlert className="text-red-500" />;
    case "transaction":
      return <DollarSign className="text-green-500" />;
    case "account":
      return <Link className="text-blue-500" />;
    default:
      return <Bell className="text-gray-500" />;
  }
};

export default function NotificationsPage() {
  const securityNotifications = notifications.filter(n => n.type === "security");
  const accountNotifications = notifications.filter(n => n.type === "account");
  const transactionNotifications = notifications.filter(n => n.type === "transaction");
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <SidebarLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Notifications</h1>
              <p className="mt-1 text-sm text-gray-600">Stay updated with important alerts about your accounts</p>
            </div>
            <div>
              <Button variant="outline" className="mr-2">
                <Check className="mr-2 h-4 w-4" />
                Mark all as read
              </Button>
            </div>
          </div>
          
          <div className="mt-6">
            <Card>
              <CardHeader className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-center">
                  <CardTitle>Recent Notifications</CardTitle>
                  {unreadCount > 0 && (
                    <div className="bg-primary/10 text-primary text-sm py-1 px-3 rounded-full">
                      {unreadCount} unread
                    </div>
                  )}
                </div>
              </CardHeader>
              
              <Tabs defaultValue="all" className="w-full">
                <TabsList className="px-6 border-b border-gray-200 w-full justify-start">
                  <TabsTrigger value="all" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                    All
                  </TabsTrigger>
                  <TabsTrigger value="security" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="accounts" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                    Accounts
                  </TabsTrigger>
                  <TabsTrigger value="transactions" className="rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
                    Transactions
                  </TabsTrigger>
                </TabsList>
                
                <TabsContent value="all">
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200">
                      {notifications.length === 0 ? (
                        <div className="py-8 text-center">
                          <p className="text-gray-500">No notifications to display</p>
                        </div>
                      ) : (
                        notifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`flex p-4 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                {getIconForNotificationType(notification.type)}
                              </div>
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${!notification.isRead ? 'text-primary' : 'text-gray-900'}`}>
                                  {notification.title}
                                </p>
                                <span className="text-xs text-gray-500">{notification.date}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                            </div>
                            {!notification.isRead && (
                              <div className="ml-4 flex-shrink-0 flex items-center">
                                <div className="h-2 w-2 bg-primary rounded-full"></div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="security">
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200">
                      {securityNotifications.length === 0 ? (
                        <div className="py-8 text-center">
                          <p className="text-gray-500">No security notifications to display</p>
                        </div>
                      ) : (
                        securityNotifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`flex p-4 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <ShieldAlert className="text-red-500" />
                              </div>
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${!notification.isRead ? 'text-primary' : 'text-gray-900'}`}>
                                  {notification.title}
                                </p>
                                <span className="text-xs text-gray-500">{notification.date}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                            </div>
                            {!notification.isRead && (
                              <div className="ml-4 flex-shrink-0 flex items-center">
                                <div className="h-2 w-2 bg-primary rounded-full"></div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="accounts">
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200">
                      {accountNotifications.length === 0 ? (
                        <div className="py-8 text-center">
                          <p className="text-gray-500">No account notifications to display</p>
                        </div>
                      ) : (
                        accountNotifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`flex p-4 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <Link className="text-blue-500" />
                              </div>
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${!notification.isRead ? 'text-primary' : 'text-gray-900'}`}>
                                  {notification.title}
                                </p>
                                <span className="text-xs text-gray-500">{notification.date}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                            </div>
                            {!notification.isRead && (
                              <div className="ml-4 flex-shrink-0 flex items-center">
                                <div className="h-2 w-2 bg-primary rounded-full"></div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
                
                <TabsContent value="transactions">
                  <CardContent className="p-0">
                    <div className="divide-y divide-gray-200">
                      {transactionNotifications.length === 0 ? (
                        <div className="py-8 text-center">
                          <p className="text-gray-500">No transaction notifications to display</p>
                        </div>
                      ) : (
                        transactionNotifications.map((notification) => (
                          <div 
                            key={notification.id} 
                            className={`flex p-4 hover:bg-gray-50 ${!notification.isRead ? 'bg-blue-50 hover:bg-blue-50' : ''}`}
                          >
                            <div className="flex-shrink-0 mt-1">
                              <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                                <DollarSign className="text-green-500" />
                              </div>
                            </div>
                            <div className="ml-4 flex-1">
                              <div className="flex items-center justify-between">
                                <p className={`text-sm font-medium ${!notification.isRead ? 'text-primary' : 'text-gray-900'}`}>
                                  {notification.title}
                                </p>
                                <span className="text-xs text-gray-500">{notification.date}</span>
                              </div>
                              <p className="text-sm text-gray-600 mt-1">{notification.description}</p>
                            </div>
                            {!notification.isRead && (
                              <div className="ml-4 flex-shrink-0 flex items-center">
                                <div className="h-2 w-2 bg-primary rounded-full"></div>
                              </div>
                            )}
                          </div>
                        ))
                      )}
                    </div>
                  </CardContent>
                </TabsContent>
              </Tabs>
            </Card>
          </div>
          
          <div className="mt-8">
            <Card>
              <CardHeader className="border-b border-gray-200">
                <CardTitle>Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <p className="text-sm text-gray-500 mb-4">
                  Customize which notifications you want to receive and how you receive them.
                </p>
                <Button variant="outline" className="mr-2">
                  Manage Notification Settings
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

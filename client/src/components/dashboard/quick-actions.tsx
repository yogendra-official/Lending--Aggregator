import { Link } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusIcon, ChartLineIcon, BellIcon } from "lucide-react";

export default function QuickActions() {
  const actions = [
    {
      title: "Link New Account",
      description: "Connect a bank, credit card, or investment account",
      icon: <PlusIcon className="text-primary" />,
      iconBg: "bg-primary-100",
      url: "/account-setup",
    },
    {
      title: "View Spending Reports",
      description: "See your spending patterns and trends",
      icon: <ChartLineIcon className="text-green-600" />,
      iconBg: "bg-green-100",
      url: "/reports",
    },
    {
      title: "Manage Notifications",
      description: "Update your alert preferences",
      icon: <BellIcon className="text-gray-600" />,
      iconBg: "bg-gray-100",
      url: "/settings",
    },
  ];

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="px-4 py-5 sm:p-6">
        <div className="space-y-4">
          {actions.map((action, index) => (
            <Link key={index} href={action.url}>
              <a className="flex items-center p-3 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                <div className={`flex-shrink-0 h-10 w-10 rounded-md ${action.iconBg} flex items-center justify-center`}>
                  {action.icon}
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-900">{action.title}</p>
                  <p className="text-xs text-gray-500">{action.description}</p>
                </div>
              </a>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

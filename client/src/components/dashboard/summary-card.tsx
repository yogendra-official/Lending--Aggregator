import { cn } from "@/lib/utils";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { ReactNode } from "react";
import { Link } from "wouter";

interface SummaryCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  iconBgClass: string;
  iconColor: string;
  linkText: string;
  linkUrl: string;
  loading?: boolean;
}

export default function SummaryCard({
  title,
  value,
  icon,
  iconBgClass,
  iconColor,
  linkText,
  linkUrl,
  loading = false,
}: SummaryCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center">
            <div className={cn("flex-shrink-0 rounded-md p-3", iconBgClass)}>
              <div className={cn("h-6 w-6", iconColor)}>{icon}</div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
                <dd>
                  {loading ? (
                    <div className="h-6 w-24 bg-gray-200 animate-pulse rounded mt-1"></div>
                  ) : (
                    <div className="text-lg font-semibold text-gray-900">{value}</div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-4 py-4 sm:px-6">
        <div className="text-sm">
          <Link href={linkUrl}>
            <a className="font-medium text-primary hover:text-primary-dark">
              {linkText} <span className="ml-1">→</span>
            </a>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { CategoryTotal } from "@/lib/api-types";
import { formatCurrency } from "@/lib/utils";

interface CategoryBreakdownProps {
  categories: CategoryTotal[];
  loading?: boolean;
}

export default function CategoryBreakdown({ categories, loading = false }: CategoryBreakdownProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader className="border-b border-gray-200">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle>Expense Categories</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {categories.length === 0 ? (
          <div className="text-center py-8">
            <svg 
              className="mx-auto h-12 w-12 text-gray-400 mb-2" 
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <p className="text-sm text-gray-500">No expense data available</p>
            <p className="text-xs text-gray-400 mt-1">Add more transactions to see insights</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categories.map((category) => (
              <div key={category.category} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-700">{category.category}</span>
                    <span className="ml-2 text-xs text-gray-500">{category.percentage.toFixed(1)}%</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{formatCurrency(category.amount)}</span>
                </div>
                <Progress 
                  value={category.percentage} 
                  max={100} 
                  className="h-2" 
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
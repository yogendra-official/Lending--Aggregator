import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BudgetItem } from "@/lib/api-types";
import { formatCurrency } from "@/lib/utils";
import { Skeleton } from "@/components/ui/skeleton";

interface BudgetProgressProps {
  budgetItems: BudgetItem[];
  loading?: boolean;
  title?: string;
}

export default function BudgetProgress({ budgetItems, loading = false }: BudgetProgressProps) {
  
  const getProgressColor = (item: BudgetItem) => {
    const percentage = (item.spent / item.budgeted) * 100;
    if (percentage > 100) return "bg-red-500";
    if (percentage > 90) return "bg-yellow-500";
    return "bg-green-500";
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="border-b border-gray-200">
          <Skeleton className="h-6 w-40" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-24" />
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
        <CardTitle>Budget Progress</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {budgetItems.length === 0 ? (
          <div className="py-6 text-center">
            <p className="text-gray-500">No budget items created yet</p>
            <p className="text-sm text-gray-400 mt-1">Set up your budget to track your spending</p>
          </div>
        ) : (
          <div className="space-y-6">
            {budgetItems.map((item, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium text-gray-700">{item.category}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-semibold text-gray-900">{formatCurrency(item.spent)}</span>
                    <span className="text-sm text-gray-500 ml-2">of {formatCurrency(item.budgeted)}</span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${Math.min((item.spent / item.budgeted) * 100, 100)}%` }}
                    className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center ${getProgressColor(item)}`}
                  ></div>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>{((item.spent / item.budgeted) * 100).toFixed(0)}% used</span>
                  <span className={item.remaining < 0 ? "text-red-500" : ""}>
                    {item.remaining < 0 ? "Over by " : "Remaining: "}
                    {formatCurrency(Math.abs(item.remaining))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

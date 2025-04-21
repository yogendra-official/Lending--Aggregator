import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";
import { ArrowDown, ArrowUp, PiggyBank, Percent } from "lucide-react";

interface SummaryCardsProps {
  income: number;
  expenses: number;
  savings: number;
  savingsRate: number;
  loading?: boolean;
}

export default function SummaryCards({ 
  income, 
  expenses, 
  savings, 
  savingsRate, 
  loading = false 
}: SummaryCardsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Card key={i}>
            <CardContent className="p-5">
              <div className="flex items-center">
                <Skeleton className="h-10 w-10 rounded-md" />
                <div className="ml-5 w-0 flex-1">
                  <Skeleton className="h-4 w-24 mb-2" />
                  <Skeleton className="h-6 w-32" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Income */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-primary-100 rounded-md p-3">
              <ArrowDown className="h-6 w-6 text-primary" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Income</dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">{formatCurrency(income)}</div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total Expenses */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-red-100 rounded-md p-3">
              <ArrowUp className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Total Expenses</dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">{formatCurrency(expenses)}</div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Net Savings */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-green-100 rounded-md p-3">
              <PiggyBank className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Net Savings</dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">{formatCurrency(savings)}</div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Savings Rate */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-yellow-100 rounded-md p-3">
              <Percent className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">Savings Rate</dt>
                <dd>
                  <div className="text-lg font-semibold text-gray-900">{savingsRate.toFixed(1)}%</div>
                </dd>
              </dl>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart as RechartsBarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency } from "@/lib/utils";

interface BarChartProps {
  data: any[];
  title: string;
  loading?: boolean;
}

export default function BarChart({ data, title, loading = false }: BarChartProps) {
  const formatYAxis = (value: number) => {
    if (value >= 1000) {
      return `$${value / 1000}k`;
    }
    return `$${value}`;
  };

  const formatTooltipValue = (value: number) => {
    return formatCurrency(value);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="border-b border-gray-200">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] bg-gray-50 rounded flex items-center justify-center">
            <Skeleton className="h-40 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="border-b border-gray-200">
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        {data.length === 0 ? (
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded">
            <div className="text-center">
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
              <p className="text-sm text-gray-500">Not enough data to display chart</p>
              <p className="text-xs text-gray-400 mt-1">Add more transactions to see insights</p>
            </div>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <RechartsBarChart
              data={data}
              margin={{
                top: 20,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatYAxis} />
              <Tooltip formatter={formatTooltipValue} />
              <Legend />
              <Bar dataKey="income" name="Income" fill="#4caf50" />
              <Bar dataKey="expenses" name="Expenses" fill="#ff9800" />
            </RechartsBarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

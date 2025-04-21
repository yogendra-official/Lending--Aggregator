import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { ChartData } from "@/lib/api-types";
import { Skeleton } from "@/components/ui/skeleton";

interface ExpenseChartProps {
  data: ChartData[];
  title: string;
  loading?: boolean;
  colors?: string[];
}

export default function ExpenseChart({ 
  data, 
  title,
  loading = false,
  colors = ["#1976d2", "#4caf50", "#ff9800", "#f44336", "#9c27b0", "#607d8b"]
}: ExpenseChartProps) {

  const formatTooltipValue = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  if (loading) {
    return (
      <Card>
        <CardHeader className="border-b border-gray-200">
          <Skeleton className="h-6 w-48" />
        </CardHeader>
        <CardContent className="p-6">
          <div className="h-[300px] flex items-center justify-center bg-gray-50 rounded">
            <Skeleton className="h-40 w-40 rounded-full" />
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
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value: number) => formatTooltipValue(value)} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

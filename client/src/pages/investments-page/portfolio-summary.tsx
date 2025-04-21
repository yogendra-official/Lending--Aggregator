import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { formatCurrency } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface PortfolioSummaryProps {
  portfolio: {
    lenderId: string;
    totalInvestedAmount: number;
    totalReturnsEarned: number;
    totalExpectedReturns: number;
    riskScore: number;
    diversificationIndex: number;
    annualizedReturn: number;
    riskAllocation: Record<string, number>;
    purposeAllocation: Record<string, number>;
    termAllocation: Record<string, number>;
  };
}

export default function PortfolioSummary({ portfolio }: PortfolioSummaryProps) {
  const {
    totalInvestedAmount,
    totalReturnsEarned,
    annualizedReturn,
    riskScore,
    diversificationIndex,
    riskAllocation,
    purposeAllocation,
    termAllocation
  } = portfolio;

  // Format data for charts
  const riskAllocationData = Object.entries(riskAllocation).map(([name, value]) => ({
    name,
    value: Number(value)
  }));

  const purposeAllocationData = Object.entries(purposeAllocation).map(([name, value]) => ({
    name,
    value: Number(value)
  }));

  const termAllocationData = Object.entries(termAllocation).map(([name, value]) => ({
    name,
    value: Number(value)
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Investment</CardTitle>
            <CardDescription>Current portfolio value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(totalInvestedAmount)}</div>
            <div className={`text-sm mt-1 ${totalReturnsEarned >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {totalReturnsEarned >= 0 ? '↑' : '↓'} {formatCurrency(Math.abs(totalReturnsEarned))} ({((totalReturnsEarned / totalInvestedAmount) * 100).toFixed(2)}%)
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Risk Score</CardTitle>
            <CardDescription>Based on your portfolio allocation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{riskScore.toFixed(2)}/100</div>
            <Progress value={riskScore} className="h-2 mt-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Conservative</span>
              <span>Moderate</span>
              <span>Aggressive</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Diversification</CardTitle>
            <CardDescription>Portfolio diversification index</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{diversificationIndex.toFixed(2)}%</div>
            <Progress value={diversificationIndex} className="h-2 mt-2" />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Concentrated</span>
              <span>Balanced</span>
              <span>Diversified</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Allocation Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Portfolio Allocation</CardTitle>
          <CardDescription>View by risk level, purpose, or time horizon</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="risk">
            <TabsList className="mb-4">
              <TabsTrigger value="risk">Risk Level</TabsTrigger>
              <TabsTrigger value="purpose">Purpose</TabsTrigger>
              <TabsTrigger value="term">Time Horizon</TabsTrigger>
            </TabsList>
            
            <TabsContent value="risk" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  <PieChart>
                    <Pie
                      data={riskAllocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {riskAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                  
                  <BarChart data={riskAllocationData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#8884d8">
                      {riskAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </div>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="purpose" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  <PieChart>
                    <Pie
                      data={purposeAllocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {purposeAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                  
                  <BarChart data={purposeAllocationData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#8884d8">
                      {purposeAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </div>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="term" className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
                  <PieChart>
                    <Pie
                      data={termAllocationData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                      nameKey="name"
                      label={({name, percent}) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {termAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                  </PieChart>
                  
                  <BarChart data={termAllocationData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                    <Bar dataKey="value" fill="#8884d8">
                      {termAllocationData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </div>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Return Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Returns Summary</CardTitle>
          <CardDescription>Performance metrics for your investments</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Current Returns</h4>
              <p className={`text-2xl font-bold ${totalReturnsEarned >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(totalReturnsEarned)}
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Annualized Return</h4>
              <p className={`text-2xl font-bold ${annualizedReturn >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {annualizedReturn.toFixed(2)}%
              </p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Fees Paid</h4>
              <p className="text-2xl font-bold">
                {formatCurrency(totalInvestedAmount * 0.005)} {/* Assuming 0.5% fee for illustration */}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
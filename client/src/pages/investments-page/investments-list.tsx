import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { formatCurrency } from '@/lib/utils';
import { Loader2, Info, ArrowRight, Filter, CircleDollarSign } from 'lucide-react';

interface Investment {
  id: string;
  loanId: string;
  amount: number;
  interestRate: number;
  riskLevel: string;
  createdAt?: string;
  maturityDate?: string;
  status?: string;
  purpose?: string;
  term?: string;
  platform: string;
  platformInstrumentId: string;
}

interface InvestmentsListProps {
  investments: Investment[];
  onInvest: (investment: Investment, amount: number) => void;
  isInvesting: boolean;
}

export default function InvestmentsList({ investments, onInvest, isInvesting }: InvestmentsListProps) {
  const [selectedInvestment, setSelectedInvestment] = useState<Investment | null>(null);
  const [investmentAmount, setInvestmentAmount] = useState<number>(1000); // Default investment amount
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [riskFilter, setRiskFilter] = useState<string | null>(null);
  
  const sortedInvestments = [...investments].sort((a, b) => {
    // Sort by risk level (low to high), then by interest rate (high to low)
    const riskCompare = getRiskLevel(a.riskLevel) - getRiskLevel(b.riskLevel);
    if (riskCompare !== 0) return riskCompare;
    return b.interestRate - a.interestRate;
  });
  
  const filteredInvestments = sortedInvestments.filter(investment => {
    const matchesSearch = !searchTerm || 
      investment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (investment.purpose?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (investment.term?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesRisk = !riskFilter || investment.riskLevel === riskFilter;
    
    return matchesSearch && matchesRisk;
  });
  
  function getRiskLevel(risk: string): number {
    switch(risk) {
      case 'VERY_LOW': return 1;
      case 'LOW': return 2;
      case 'MEDIUM': return 3;
      case 'MEDIUM_HIGH': return 4;
      case 'HIGH': return 5;
      case 'VERY_HIGH': return 6;
      default: return 3;
    }
  }
  
  function getRiskBadgeVariant(risk: string): "default" | "outline" | "secondary" | "destructive" {
    switch(risk) {
      case 'VERY_LOW': return 'secondary';
      case 'LOW': return 'secondary';
      case 'MEDIUM': return 'default';
      case 'MEDIUM_HIGH': return 'default';
      case 'HIGH': return 'destructive';
      case 'VERY_HIGH': return 'destructive';
      default: return 'default';
    }
  }
  
  function formatRiskLabel(risk: string): string {
    return risk.replace('_', ' ');
  }
  
  function handleInvest() {
    if (selectedInvestment && investmentAmount > 0) {
      onInvest(selectedInvestment, investmentAmount);
      // Reset the dialog
      setSelectedInvestment(null);
      setInvestmentAmount(1000);
    }
  }
  
  function handleFilterRisk(risk: string | null) {
    setRiskFilter(risk === riskFilter ? null : risk);
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Available Investments</CardTitle>
              <CardDescription>Browse and invest in available opportunities</CardDescription>
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Input
                  placeholder="Search investments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-[250px]"
                />
              </div>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline" size="icon">
                    <Filter className="h-4 w-4" />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Filter Investments</DialogTitle>
                    <DialogDescription>
                      Select filters to narrow down investment options
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                      <Label>Risk Level</Label>
                      <div className="flex flex-wrap gap-2">
                        {['VERY_LOW', 'LOW', 'MEDIUM', 'MEDIUM_HIGH', 'HIGH', 'VERY_HIGH'].map(risk => (
                          <Badge
                            key={risk}
                            variant={riskFilter === risk ? 'default' : 'outline'}
                            className="cursor-pointer"
                            onClick={() => handleFilterRisk(risk)}
                          >
                            {formatRiskLabel(risk)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvestments.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-muted-foreground">No investment opportunities found matching your criteria.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Minimum Investment</TableHead>
                  <TableHead>Interest Rate</TableHead>
                  <TableHead>Risk Level</TableHead>
                  <TableHead>Term</TableHead>
                  <TableHead className="text-right">Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell className="font-medium">{investment.id.substring(0, 8)}...</TableCell>
                    <TableCell>{investment.purpose || 'Investment'}</TableCell>
                    <TableCell>{formatCurrency(investment.amount)}</TableCell>
                    <TableCell>{investment.interestRate}%</TableCell>
                    <TableCell>
                      <Badge variant={getRiskBadgeVariant(investment.riskLevel)}>
                        {formatRiskLabel(investment.riskLevel)}
                      </Badge>
                    </TableCell>
                    <TableCell>{investment.term || 'Medium Term'}</TableCell>
                    <TableCell className="text-right">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedInvestment(investment)}
                          >
                            Invest <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Invest in {investment.id.substring(0, 8)}...</DialogTitle>
                            <DialogDescription>
                              Enter the amount you want to invest in this opportunity.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="grid gap-4 py-4">
                            <div className="grid gap-2">
                              <Label htmlFor="investment-amount">Investment Amount (₹)</Label>
                              <div className="relative">
                                <CircleDollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                  id="investment-amount"
                                  type="number"
                                  min={investment.amount}
                                  step={100}
                                  value={investmentAmount}
                                  onChange={(e) => setInvestmentAmount(Number(e.target.value))}
                                  className="pl-8"
                                />
                              </div>
                            </div>
                            <div className="space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Interest Rate:</span>
                                <span className="font-medium">{investment.interestRate}%</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Risk Level:</span>
                                <span>
                                  <Badge variant={getRiskBadgeVariant(investment.riskLevel)}>
                                    {formatRiskLabel(investment.riskLevel)}
                                  </Badge>
                                </span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-muted-foreground">Estimated Return:</span>
                                <span className="font-medium text-green-600">
                                  {formatCurrency(investmentAmount * (investment.interestRate / 100))} per year
                                </span>
                              </div>
                            </div>
                          </div>
                          <DialogFooter>
                            <Button
                              onClick={handleInvest}
                              disabled={isInvesting || investmentAmount < investment.amount}
                            >
                              {isInvesting ? (
                                <>
                                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                  Processing
                                </>
                              ) : (
                                'Confirm Investment'
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="pb-3">
          <CardTitle>Risk Information</CardTitle>
          <CardDescription>Understanding investment risks</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-start gap-4">
            <Info className="h-5 w-5 text-primary mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-medium leading-none">Investment Disclaimer</h4>
              <p className="text-sm text-muted-foreground">
                All investments involve risks, including the possible loss of principal. Investment returns and principal value will fluctuate so that investments, when redeemed, may be worth more or less than original cost.
              </p>
              <p className="text-sm text-muted-foreground">
                Past performance does not guarantee future results. Higher risk investments typically offer higher returns to compensate investors for the increased risk.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
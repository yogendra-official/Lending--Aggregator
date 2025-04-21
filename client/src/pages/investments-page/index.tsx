import { useState } from "react";
import { Loader2, AlertCircle, Briefcase, RefreshCw, ExternalLink, ArrowLeft } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PortfolioSummary from "@/pages/investments-page/portfolio-summary";
import InvestmentsList from "@/pages/investments-page/investments-list";
import PlatformConnection from "@/pages/investments-page/platform-connection";

// Define types for investment data
interface RiskAllocation {
  [key: string]: number;
}

interface PortfolioData {
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
}

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

export default function InvestmentsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("portfolio");
  const [activePlatform, setActivePlatform] = useState<string | null>(null);
  const [platformToken, setPlatformToken] = useState<string | null>(null);

  // Mock portfolio data for demo
  const mockPortfolioData: PortfolioData = {
    lenderId: "zerodha-1",
    totalInvestedAmount: 250000,
    totalReturnsEarned: 32500,
    totalExpectedReturns: 45000,
    riskScore: 65,
    diversificationIndex: 78,
    annualizedReturn: 12.5,
    riskAllocation: {
      "Low Risk": 75000,
      "Medium Risk": 125000,
      "High Risk": 50000
    },
    purposeAllocation: {
      "Education": 50000,
      "Retirement": 100000,
      "Wealth Growth": 75000,
      "Emergency": 25000
    },
    termAllocation: {
      "Short Term": 50000,
      "Medium Term": 125000,
      "Long Term": 75000
    }
  };

  // Mock available investments
  const mockInvestments: Investment[] = [
    {
      id: "loan-1",
      loanId: "ZRD-1001",
      amount: 25000,
      interestRate: 12,
      riskLevel: "Medium Risk",
      createdAt: "2025-01-15",
      maturityDate: "2025-07-15",
      status: "Active",
      purpose: "Education",
      term: "Short Term",
      platform: "Zerodha",
      platformInstrumentId: "ZRD-INST-1001"
    },
    {
      id: "loan-2",
      loanId: "ZRD-1002",
      amount: 50000,
      interestRate: 9.5,
      riskLevel: "Low Risk",
      createdAt: "2025-02-01",
      maturityDate: "2026-02-01",
      status: "Active",
      purpose: "Wealth Growth",
      term: "Medium Term",
      platform: "Zerodha",
      platformInstrumentId: "ZRD-INST-1002"
    }
  ];

  // Mock platform investments
  const mockPlatformInvestments: Investment[] = [
    {
      id: "invest-1",
      loanId: "GROW-1001",
      amount: 35000,
      interestRate: 14,
      riskLevel: "High Risk",
      createdAt: "2025-03-10",
      maturityDate: "2025-09-10",
      status: "Active",
      purpose: "Wealth Growth",
      term: "Short Term",
      platform: "Grow",
      platformInstrumentId: "GROW-INST-1001"
    },
    {
      id: "invest-2",
      loanId: "GROW-1002",
      amount: 65000,
      interestRate: 10.5,
      riskLevel: "Medium Risk",
      createdAt: "2025-02-15",
      maturityDate: "2026-08-15",
      status: "Active",
      purpose: "Retirement",
      term: "Medium Term",
      platform: "Grow",
      platformInstrumentId: "GROW-INST-1002"
    },
    {
      id: "invest-3",
      loanId: "GROW-1003",
      amount: 100000,
      interestRate: 8.75,
      riskLevel: "Low Risk",
      createdAt: "2025-01-05",
      maturityDate: "2027-01-05",
      status: "Active",
      purpose: "Education",
      term: "Long Term",
      platform: "Grow",
      platformInstrumentId: "GROW-INST-1003"
    }
  ];

  // Portfolio query using mock data
  const { data: portfolio, isLoading: isLoadingPortfolio, error: portfolioError } = useQuery<PortfolioData>({
    queryKey: ['/api/investments/portfolio'],
    queryFn: () => {
      return Promise.resolve(mockPortfolioData);
    },
    enabled: !!user,
  });

  // Available investments query using mock data
  const { data: availableInvestments, isLoading: isLoadingInvestments } = useQuery<Investment[]>({
    queryKey: ['/api/investments/loans'],
    queryFn: () => {
      return Promise.resolve(mockInvestments);
    },
    enabled: !!user,
  });

  // Platform investments query using mock data
  const { data: platformInvestments, isLoading: isLoadingPlatformInvestments } = useQuery<Investment[]>({
    queryKey: ['/api/investments/platforms', activePlatform, platformToken],
    queryFn: () => {
      if (!activePlatform || !platformToken) return [];
      return Promise.resolve(mockPlatformInvestments);
    },
    enabled: !!activePlatform && !!platformToken && !!user,
  });

  // Import platform portfolio mutation
  const importMutation = useMutation({
    mutationFn: async ({ platform, token }: { platform: string, token: string }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/investments/portfolio'] });
      toast({
        title: "Portfolio imported",
        description: "Your portfolio has been successfully imported.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Import failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Execute investment mutation
  const investMutation = useMutation({
    mutationFn: async ({ platform, token, investmentId, externalId, amount }: { 
      platform: string, 
      token: string, 
      investmentId: string, 
      externalId: string, 
      amount: number 
    }) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/investments/portfolio'] });
      toast({
        title: "Investment successful",
        description: "Your investment has been successfully processed.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Investment failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleConnectPlatform = (platform: string, token: string) => {
    setActivePlatform(platform);
    setPlatformToken(token);
    toast({
      title: "Platform connected",
      description: `Connected to ${platform} successfully.`,
    });
  };

  const handleImportPortfolio = () => {
    if (!activePlatform || !platformToken) {
      toast({
        title: "Connection required",
        description: "Please connect to a platform first.",
        variant: "destructive",
      });
      return;
    }
    
    importMutation.mutate({ platform: activePlatform, token: platformToken });
  };

  const handleInvest = (investment: Investment, amount: number) => {
    if (!activePlatform || !platformToken) {
      toast({
        title: "Connection required",
        description: "Please connect to a platform first.",
        variant: "destructive",
      });
      return;
    }
    
    investMutation.mutate({ 
      platform: activePlatform, 
      token: platformToken,
      investmentId: investment.id,
      externalId: investment.platformInstrumentId,
      amount,
    });
  };

  if (!user) {
    return (
      <div className="container mx-auto py-10">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Please log in to access investment features.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-4">
        <Button variant="ghost" className="gap-1 pl-0" onClick={() => window.location.href = "/"}>
          <ArrowLeft size={16} /> Back
        </Button>
      </div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Investment Platform</h1>
        <div className="flex space-x-4">
          <Button 
            variant="outline" 
            onClick={handleImportPortfolio}
            disabled={importMutation.isPending || !activePlatform}
          >
            {importMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Briefcase className="mr-2 h-4 w-4" />
            )}
            Import Portfolio
          </Button>
          <Button 
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ['/api/investments/portfolio'] })}
            disabled={isLoadingPortfolio}
          >
            {isLoadingPortfolio ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-1">
          <PlatformConnection onConnect={handleConnectPlatform} activePlatform={activePlatform} />
        </div>

        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="portfolio">Portfolio</TabsTrigger>
              <TabsTrigger value="invest">Invest</TabsTrigger>
            </TabsList>
            
            <TabsContent value="portfolio">
              {portfolioError ? (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    Error loading portfolio: {(portfolioError as Error).message}
                  </AlertDescription>
                </Alert>
              ) : isLoadingPortfolio ? (
                <div className="flex justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
              ) : portfolio ? (
                <PortfolioSummary portfolio={portfolio} />
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>No Portfolio Data</CardTitle>
                    <CardDescription>
                      Connect to an investment platform and import your portfolio to get started.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8">
                      <Briefcase className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-center text-muted-foreground">
                        Your investment portfolio will appear here after importing from a connected platform.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
            
            <TabsContent value="invest">
              {activePlatform ? (
                isLoadingPlatformInvestments ? (
                  <div className="flex justify-center py-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : (
                  <InvestmentsList 
                    investments={platformInvestments || []} 
                    onInvest={handleInvest}
                    isInvesting={investMutation.isPending}
                  />
                )
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle>Connect to a Platform</CardTitle>
                    <CardDescription>
                      Please connect to an investment platform to view available investment options.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col items-center justify-center py-8">
                      <ExternalLink className="h-16 w-16 text-muted-foreground mb-4" />
                      <p className="text-center text-muted-foreground">
                        Use the connection panel on the left to link your investment platform account.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
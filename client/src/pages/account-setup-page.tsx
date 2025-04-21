import { useState } from "react";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import SetupWizard from "@/components/account-setup/setup-wizard";
import InstitutionGrid from "@/components/account-setup/institution-grid";
import { 
  Card, 
  CardContent,
  CardFooter,
  CardHeader, 
  CardTitle, 
  CardDescription
} from "@/components/ui/card";
import { 
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { InfoIcon } from "lucide-react";

// Wizard steps
enum Step {
  SelectType = 1,
  SelectInstitution = 2,
  Connect = 3,
  VerifyAccess = 4,
  Confirm = 5,
}

export default function AccountSetupPage() {
  const [currentStep, setCurrentStep] = useState<Step>(Step.SelectType);
  const [accountType, setAccountType] = useState<string>("");
  const [selectedInstitution, setSelectedInstitution] = useState<string>("");
  
  // Handle account type selection
  const handleAccountTypeSelect = (type: string) => {
    setAccountType(type);
    setCurrentStep(Step.SelectInstitution);
  };
  
  // Handle institution selection
  const handleInstitutionSelect = (institution: string) => {
    setSelectedInstitution(institution);
    setCurrentStep(Step.Connect);
  };
  
  // Handle next step
  const handleNextStep = () => {
    setCurrentStep(prev => 
      prev < Step.Confirm ? ((prev + 1) as Step) : prev
    );
  };
  
  // Handle previous step
  const handlePreviousStep = () => {
    setCurrentStep(prev => 
      prev > Step.SelectType ? ((prev - 1) as Step) : prev
    );
  };
  
  // Render step content
  const renderStepContent = () => {
    switch (currentStep) {
      case Step.SelectType:
        return (
          <div>
            <CardHeader>
              <CardTitle>Step 1: Select Account Type</CardTitle>
              <CardDescription>
                Choose the type of account you want to link
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Bank Account */}
                <div 
                  className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:border-primary hover:shadow-sm focus:outline-none cursor-pointer"
                  onClick={() => handleAccountTypeSelect("bank")}
                >
                  <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-3">
                    <svg className="h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-gray-900">Bank Account</span>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Checking, savings, and money market accounts
                  </p>
                </div>
                
                {/* Credit Card */}
                <div 
                  className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:border-primary hover:shadow-sm focus:outline-none cursor-pointer"
                  onClick={() => handleAccountTypeSelect("credit")}
                >
                  <div className="w-16 h-16 rounded-full bg-red-100 flex items-center justify-center mb-3">
                    <svg className="h-8 w-8 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-gray-900">Credit Card</span>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Credit cards and charge cards
                  </p>
                </div>
                
                {/* Investment Account */}
                <div 
                  className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:border-primary hover:shadow-sm focus:outline-none cursor-pointer"
                  onClick={() => handleAccountTypeSelect("investment")}
                >
                  <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-3">
                    <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-lg font-medium text-gray-900">Investment</span>
                  <p className="text-sm text-gray-500 text-center mt-2">
                    Brokerage, IRA, and retirement accounts
                  </p>
                </div>
              </div>
            </CardContent>
          </div>
        );
        
      case Step.SelectInstitution:
        return (
          <div>
            <CardHeader>
              <CardTitle>Step 2: Select Your Institution</CardTitle>
              <CardDescription>
                Search for the financial institution you want to connect
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <InstitutionGrid 
                accountType={accountType} 
                onSelect={handleInstitutionSelect}
              />
            </CardContent>
          </div>
        );
        
      case Step.Connect:
        return (
          <div>
            <CardHeader>
              <CardTitle>Step 3: Connect to {selectedInstitution}</CardTitle>
              <CardDescription>
                Enter your credentials to securely connect your account
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="bg-gray-50 p-6 rounded-lg mb-4 text-center">
                <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                  <svg className="h-8 w-8 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 9l3 3m0 0l-3 3m3-3H8m13 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  You will be redirected to {selectedInstitution}
                </h3>
                <p className="text-gray-600 mb-4">
                  To securely connect your account, you'll be temporarily redirected to sign in to your {selectedInstitution} account.
                </p>
                <button 
                  onClick={handleNextStep}
                  className="w-full sm:w-auto px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Connect to {selectedInstitution}
                </button>
              </div>
            </CardContent>
          </div>
        );
        
      case Step.VerifyAccess:
        return (
          <div>
            <CardHeader>
              <CardTitle>Step 4: Verify Access</CardTitle>
              <CardDescription>
                Confirm the permissions you want to grant
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Account Details</h3>
                      <p className="text-sm text-gray-500">View account name, type, balance, and status</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Transaction History</h3>
                      <p className="text-sm text-gray-500">Access transaction data for the past 24 months</p>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-0.5">
                      <svg className="h-5 w-5 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-gray-900">Account Refresh</h3>
                      <p className="text-sm text-gray-500">Periodically update account information</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6 text-center">
                <button 
                  onClick={handleNextStep}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Confirm Access
                </button>
              </div>
            </CardContent>
          </div>
        );
        
      case Step.Confirm:
        return (
          <div>
            <CardHeader>
              <CardTitle>Success! Account Connected</CardTitle>
              <CardDescription>
                Your account has been successfully linked
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Your {accountType} account with {selectedInstitution} has been linked!
              </h3>
              <p className="text-gray-600 mb-6">
                You can now view your account details and transaction history.
              </p>
              <div className="space-x-4">
                <a 
                  href="/linked-accounts" 
                  className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  View Linked Accounts
                </a>
                <a 
                  href="/account-setup" 
                  className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                >
                  Link Another Account
                </a>
              </div>
            </CardContent>
          </div>
        );
        
      default:
        return null;
    }
  };

  return (
    <SidebarLayout>
      <div className="py-6">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-semibold text-gray-900">Link a New Account</h1>
            <p className="mt-1 text-sm text-gray-600">Follow these steps to connect your financial account</p>
          </div>
          
          {/* Step Progress */}
          <div className="mt-8">
            <SetupWizard currentStep={currentStep} />
          </div>
          
          {/* Step Content */}
          <div className="mt-8">
            <Card>
              {renderStepContent()}
              
              {/* Navigation Buttons */}
              {currentStep !== Step.Confirm && currentStep !== Step.SelectType && (
                <CardFooter className="px-4 py-3 bg-gray-50 sm:px-6 border-t border-gray-200">
                  <div className="flex justify-between w-full">
                    <button
                      type="button"
                      onClick={handlePreviousStep}
                      className="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                    >
                      Back
                    </button>
                    
                    {currentStep !== Step.Connect && currentStep !== Step.VerifyAccess && (
                      <button
                        type="button"
                        onClick={handleNextStep}
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
                      >
                        Continue
                      </button>
                    )}
                  </div>
                </CardFooter>
              )}
            </Card>
          </div>
          
          {/* Security Information */}
          <div className="mt-6">
            <Alert variant="info">
              <InfoIcon className="h-4 w-4" />
              <AlertTitle>Connection Security</AlertTitle>
              <AlertDescription>
                Your security is our priority. We use bank-level encryption and secure connections. 
                We never store your bank login credentials.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}

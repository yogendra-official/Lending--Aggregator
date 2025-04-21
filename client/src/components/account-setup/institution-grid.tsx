import { useState } from "react";
import { Input } from "@/components/ui/input";
import { SearchIcon } from "lucide-react";

interface InstitutionGridProps {
  accountType: string;
  onSelect: (institution: string) => void;
}

// Sample Indian institution data - in a real app this would come from an API
const institutions = [
  { id: "sbi", name: "State Bank of India", type: "bank", popular: true },
  { id: "hdfc", name: "HDFC Bank", type: "bank", popular: true },
  { id: "icici", name: "ICICI Bank", type: "bank", popular: true },
  { id: "axis", name: "Axis Bank", type: "bank", popular: true },
  { id: "sbicard", name: "SBI Card", type: "credit", popular: true },
  { id: "zerodha", name: "Zerodha", type: "investment", popular: true },
  { id: "pnb", name: "Punjab National Bank", type: "bank" },
  { id: "kotak", name: "Kotak Mahindra Bank", type: "bank" },
  { id: "hdfccard", name: "HDFC Credit Card", type: "credit" },
  { id: "groww", name: "Groww", type: "investment" },
  { id: "upstox", name: "Upstox", type: "investment" },
  { id: "bob", name: "Bank of Baroda", type: "bank" },
  { id: "canara", name: "Canara Bank", type: "bank" },
  { id: "indusind", name: "IndusInd Bank", type: "bank" },
  { id: "yes", name: "Yes Bank", type: "bank" },
  { id: "idfc", name: "IDFC First Bank", type: "bank" },
  { id: "rbl", name: "RBL Bank", type: "bank" },
  { id: "icicicard", name: "ICICI Credit Card", type: "credit" },
  { id: "axiscard", name: "Axis Credit Card", type: "credit" },
  { id: "kotakcard", name: "Kotak Credit Card", type: "credit" },
  { id: "amazonpay", name: "Amazon Pay ICICI", type: "credit" },
  { id: "onecard", name: "OneCard", type: "credit" },
  { id: "paytm", name: "Paytm Money", type: "investment" },
  { id: "angelone", name: "Angel One", type: "investment" },
  { id: "icicidirect", name: "ICICI Direct", type: "investment" },
  { id: "motilaloswal", name: "Motilal Oswal", type: "investment" }
];

export default function InstitutionGrid({ accountType, onSelect }: InstitutionGridProps) {
  const [searchTerm, setSearchTerm] = useState("");
  
  // Filter institutions based on account type and search term
  const filteredInstitutions = institutions.filter(institution => 
    (accountType === "" || institution.type === accountType) &&
    institution.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Separate popular institutions
  const popularInstitutions = filteredInstitutions.filter(inst => inst.popular);
  const otherInstitutions = filteredInstitutions.filter(inst => !inst.popular);

  const getIconForInstitution = (institution: string) => {
    // Mock institution icons - in a real app these would be proper logos
    switch (institution.toLowerCase()) {
      case 'state bank of india':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
              <path d="M12 7v14" />
              <path d="M8 12h8" />
            </svg>
          </div>
        );
      case 'hdfc bank':
        return (
          <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
            <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 5H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
              <path d="M8 10v6" />
              <path d="M12 10v6" />
              <path d="M16 10v6" />
            </svg>
          </div>
        );
      case 'icici bank':
        return (
          <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center mb-2">
            <svg className="h-6 w-6 text-orange-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
              <path d="M3 9V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v4" />
              <path d="M8 14h8" />
            </svg>
          </div>
        );
      case 'axis bank':
        return (
          <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-2">
            <svg className="h-6 w-6 text-purple-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 5H5a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2Z" />
              <path d="m8 9 4 6 4-6" />
              <path d="M8 15h8" />
            </svg>
          </div>
        );
      case 'sbi card':
        return (
          <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
            <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect width="20" height="14" x="2" y="5" rx="2" />
              <line x1="2" x2="22" y1="10" y2="10" />
              <path d="M7 15h.01" />
              <path d="M11 15h2" />
            </svg>
          </div>
        );
      case 'zerodha':
        return (
          <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
            <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
              <polyline points="16 7 22 7 22 13" />
            </svg>
          </div>
        );
      default:
        // Different themed default icons based on type
        const institution_obj = institutions.find(i => i.name.toLowerCase() === institution.toLowerCase());
        if (institution_obj) {
          switch (institution_obj.type) {
            case 'bank':
              return (
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-2">
                  <svg className="h-6 w-6 text-blue-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 21h18" />
                    <path d="M3 10h18" />
                    <path d="M5 6l7-3 7 3" />
                    <path d="M4 10v11" />
                    <path d="M20 10v11" />
                    <path d="M8 14v3" />
                    <path d="M12 14v3" />
                    <path d="M16 14v3" />
                  </svg>
                </div>
              );
            case 'credit':
              return (
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-2">
                  <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                    <path d="M7 15h.01" />
                    <path d="M11 15h2" />
                  </svg>
                </div>
              );
            case 'investment':
              return (
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-2">
                  <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M2 12h20" />
                    <path d="M5 20a2 2 0 0 1-2-2v-8h4v8a2 2 0 0 1-2 2Z" />
                    <path d="M10 10v8a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-8h-5Z" />
                    <path d="M19 20a2 2 0 0 0 2-2v-8h-4v8a2 2 0 0 0 2 2Z" />
                  </svg>
                </div>
              );
            default:
              return (
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
                  <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m3 21 18-6.5V5L3 12v9Z" />
                    <path d="M10 12v7.5" />
                    <path d="M13 10.5v9" />
                  </svg>
                </div>
              );
          }
        } else {
          return (
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-2">
              <svg className="h-6 w-6 text-gray-600" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 21 18-6.5V5L3 12v9Z" />
                <path d="M10 12v7.5" />
                <path d="M13 10.5v9" />
              </svg>
            </div>
          );
        }
    }
  };

  return (
    <div className="mb-6">
      {/* Search Box */}
      <div className="mb-6">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <Input
            type="text"
            className="pl-10"
            placeholder="Search for your Indian bank, credit card, or investment firm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      
      {/* Popular Institutions */}
      {popularInstitutions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-3">Popular Indian Financial Institutions</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {popularInstitutions.map((institution) => (
              <button
                key={institution.id}
                className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:border-primary hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => onSelect(institution.name)}
              >
                {getIconForInstitution(institution.name)}
                <span className="text-sm font-medium text-gray-900">{institution.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Other Institutions */}
      {otherInstitutions.length > 0 && popularInstitutions.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Other Indian Financial Institutions</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {otherInstitutions.map((institution) => (
              <button
                key={institution.id}
                className="flex flex-col items-center p-4 border border-gray-300 rounded-lg hover:border-primary hover:shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                onClick={() => onSelect(institution.name)}
              >
                {getIconForInstitution(institution.name)}
                <span className="text-sm font-medium text-gray-900">{institution.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* No results */}
      {filteredInstitutions.length === 0 && (
        <div className="text-center py-8">
          <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <p className="text-gray-500 mb-2">No Indian financial institutions found</p>
          <p className="text-sm text-gray-400">
            Try adjusting your search or select a different account type
          </p>
        </div>
      )}
    </div>
  );
}

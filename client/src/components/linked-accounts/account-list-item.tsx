import { useState } from "react";
import { Link } from "wouter";
import { Account } from "@shared/schema";
import { 
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { BankIcon, CreditCardIcon, InvestmentIcon } from "@/components/ui/icons";
import { formatCurrency } from "@/lib/utils";
import { MoreVertical, ChevronRight, Trash } from "lucide-react";

interface AccountListItemProps {
  account: Account;
  onDelete: (accountId: number) => void;
}

export default function AccountListItem({ account, onDelete }: AccountListItemProps) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const getIconForAccountType = () => {
    switch (account.accountType.toLowerCase()) {
      case "bank":
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
            <BankIcon className="text-blue-600" size={20} />
          </div>
        );
      case "credit":
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
            <CreditCardIcon className="text-red-600" size={20} />
          </div>
        );
      case "investment":
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
            <InvestmentIcon className="text-green-600" size={20} />
          </div>
        );
      default:
        return (
          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
            <BankIcon className="text-gray-600" size={20} />
          </div>
        );
    }
  };

  const formatLastUpdated = () => {
    const lastUpdatedDate = new Date(account.lastUpdated);
    const now = new Date();
    
    // If today
    if (
      lastUpdatedDate.getDate() === now.getDate() &&
      lastUpdatedDate.getMonth() === now.getMonth() &&
      lastUpdatedDate.getFullYear() === now.getFullYear()
    ) {
      return "Today";
    }
    
    // If yesterday
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    if (
      lastUpdatedDate.getDate() === yesterday.getDate() &&
      lastUpdatedDate.getMonth() === yesterday.getMonth() &&
      lastUpdatedDate.getFullYear() === yesterday.getFullYear()
    ) {
      return "Yesterday";
    }
    
    // Otherwise, return formatted date
    return lastUpdatedDate.toLocaleDateString();
  };

  const handleDelete = () => {
    setShowDeleteConfirm(false);
    onDelete(account.id);
  };

  return (
    <li>
      <div className="block hover:bg-gray-50">
        <div className="px-4 py-4 sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              {getIconForAccountType()}
              <div className="ml-4">
                <div className="text-sm font-medium text-gray-900">{account.institution}</div>
                <div className="text-xs text-gray-500">{account.accountName}</div>
              </div>
            </div>
            <div className="flex items-center">
              <div className="mr-6 text-right">
                <div className={`text-sm font-semibold ${account.balance < 0 ? "text-red-500" : "text-gray-900"}`}>
                  {formatCurrency(account.balance)}
                </div>
                <div className="text-xs text-gray-500">Last updated: {formatLastUpdated()}</div>
              </div>
              <div className="ml-2 flex-shrink-0 flex">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                      <span className="sr-only">Open options</span>
                      <MoreVertical className="h-5 w-5" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Link href={`/transactions?accountId=${account.id}`}>
                        <a className="flex w-full">View transactions</a>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>Update account</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600 focus:text-red-600"
                      onClick={() => setShowDeleteConfirm(true)}
                    >
                      <Trash className="h-4 w-4 mr-2" />
                      Remove account
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="mt-2 sm:flex sm:justify-between">
            <div className="flex items-center text-xs text-gray-500">
              <span className="flex-shrink-0">••••{account.accountNumber.slice(-4)}</span>
            </div>
            <div className="mt-2 flex items-center text-xs text-gray-500 sm:mt-0">
              <Link href={`/transactions?accountId=${account.id}`}>
                <a className="inline-flex items-center text-primary hover:text-primary-dark">
                  <span>View transactions</span>
                  <ChevronRight className="ml-1 h-4 w-4" />
                </a>
              </Link>
            </div>
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure you want to remove this account?</AlertDialogTitle>
            <AlertDialogDescription>
              This will remove the account from your dashboard and all transaction history for this account.
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-red-600 hover:bg-red-700" onClick={handleDelete}>
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </li>
  );
}

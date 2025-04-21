import { useState } from "react";
import { BudgetItem } from "@/lib/api-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription
} from "@/components/ui/dialog";
import { PencilIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface BudgetEditorProps {
  budgetItems: BudgetItem[];
  onBudgetUpdate: (updatedBudgets: Record<string, number>) => void;
}

export default function BudgetEditor({ budgetItems, onBudgetUpdate }: BudgetEditorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [budgetValues, setBudgetValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const handleOpenChange = (open: boolean) => {
    if (open) {
      // Initialize form with current budget values
      const initialValues: Record<string, string> = {};
      budgetItems.forEach(item => {
        initialValues[item.category] = item.budgeted.toString();
      });
      setBudgetValues(initialValues);
    }
    setIsOpen(open);
  };

  const handleInputChange = (category: string, value: string) => {
    setBudgetValues(prev => ({
      ...prev,
      [category]: value
    }));
  };

  const handleSave = () => {
    // Validate inputs and convert to numbers
    const updatedBudgets: Record<string, number> = {};
    let hasError = false;

    Object.entries(budgetValues).forEach(([category, valueStr]) => {
      const value = Number(valueStr);
      
      if (isNaN(value) || value < 0) {
        toast({
          title: "Invalid budget amount",
          description: `Please enter a valid positive number for ${category}`,
          variant: "destructive"
        });
        hasError = true;
        return;
      }
      
      updatedBudgets[category] = value;
    });

    if (!hasError) {
      onBudgetUpdate(updatedBudgets);
      setIsOpen(false);
      toast({
        title: "Budgets updated",
        description: "Your budget limits have been updated successfully."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center bg-white hover:bg-gray-50 text-teal-600 border-teal-300 hover:border-teal-500"
        >
          <PencilIcon className="h-4 w-4 mr-2" />
          Edit Budgets
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Manage Budget Limits</DialogTitle>
          <DialogDescription>
            Set monthly spending limits for each category to help track your financial goals.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {budgetItems.map((item) => (
            <div key={item.category} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={`budget-${item.category}`} className="text-right col-span-1">
                {item.category}
              </Label>
              <div className="col-span-3 flex items-center">
                <span className="mr-2 text-gray-500">₹</span>
                <Input
                  id={`budget-${item.category}`}
                  type="number"
                  min="0"
                  value={budgetValues[item.category] || ""}
                  onChange={(e) => handleInputChange(item.category, e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
          ))}
        </div>
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleSave}
            className="bg-gradient-to-r from-teal-500 to-emerald-600 hover:from-teal-600 hover:to-emerald-700"
          >
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
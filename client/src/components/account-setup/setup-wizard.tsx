import { cn } from "@/lib/utils";

interface SetupWizardProps {
  currentStep: number;
}

export default function SetupWizard({ currentStep }: SetupWizardProps) {
  const steps = [
    { label: "Select Account Type", number: 1 },
    { label: "Connect", number: 2 },
    { label: "Verify Access", number: 3 },
    { label: "Confirm", number: 4 }
  ];

  return (
    <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, stepIdx) => (
          <li key={step.label} className={cn("relative flex-1", { "pr-8": stepIdx !== steps.length - 1 })}>
            {currentStep > step.number ? (
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="h-0.5 w-full bg-primary"></div>
              </div>
            ) : stepIdx < steps.length - 1 ? (
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="h-0.5 w-full bg-gray-200"></div>
              </div>
            ) : null}
            
            <div
              className={cn(
                "relative flex h-8 w-8 items-center justify-center rounded-full",
                {
                  "bg-primary text-white": currentStep > step.number,
                  "bg-white border-2 border-primary": currentStep === step.number,
                  "bg-white border-2 border-gray-300": currentStep < step.number
                }
              )}
            >
              {currentStep > step.number ? (
                <svg className="h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <span 
                  className={cn(
                    "h-2.5 w-2.5 rounded-full",
                    {
                      "bg-primary": currentStep === step.number,
                      "bg-transparent": currentStep < step.number
                    }
                  )}
                />
              )}
            </div>
            <span className="absolute -bottom-6 w-full text-center text-xs text-gray-500">
              {step.label}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}

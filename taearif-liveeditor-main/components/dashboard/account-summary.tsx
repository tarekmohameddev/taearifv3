import { CreditCard, Landmark, Wallet } from "lucide-react";

import { Progress } from "@/components/ui/progress";

const accounts = [
  {
    id: "1",
    name: "Checking Account",
    balance: 5280.42,
    type: "bank",
    icon: Landmark,
    color: "bg-blue-100",
    iconColor: "text-blue-500",
  },
  {
    id: "2",
    name: "Savings Account",
    balance: 12750.89,
    type: "bank",
    icon: Wallet,
    color: "bg-green-100",
    iconColor: "text-green-500",
  },
  {
    id: "3",
    name: "Credit Card",
    balance: -1820.42,
    limit: 5000,
    type: "credit",
    icon: CreditCard,
    color: "bg-red-100",
    iconColor: "text-red-500",
  },
  {
    id: "4",
    name: "Investment Account",
    balance: 27200.16,
    type: "investment",
    icon: Wallet,
    color: "bg-purple-100",
    iconColor: "text-purple-500",
  },
];

export function AccountSummary() {
  return (
    <div className="space-y-6">
      {accounts.map((account) => (
        <div key={account.id} className="flex flex-col space-y-2">
          <div className="flex items-center">
            <div className={`p-2 rounded-full mr-4 ${account.color}`}>
              <account.icon className={`h-5 w-5 ${account.iconColor}`} />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-medium">{account.name}</h3>
              <p className="text-xs text-muted-foreground">
                {account.type.charAt(0).toUpperCase() + account.type.slice(1)}
              </p>
            </div>
            <div className="text-right">
              <p
                className={`text-sm font-medium ${account.balance < 0 ? "text-red-500" : ""}`}
              >
                $
                {account.balance.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </p>
              {account.type === "credit" && (
                <p className="text-xs text-muted-foreground">
                  Limit: ${account.limit.toLocaleString()}
                </p>
              )}
            </div>
          </div>
          {account.type === "credit" && account.limit && (
            <div className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span>Credit Used</span>
                <span>
                  {Math.round(
                    (Math.abs(account.balance) / account.limit) * 100,
                  )}
                  %
                </span>
              </div>
              <Progress
                value={Math.round(
                  (Math.abs(account.balance) / account.limit) * 100,
                )}
              />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

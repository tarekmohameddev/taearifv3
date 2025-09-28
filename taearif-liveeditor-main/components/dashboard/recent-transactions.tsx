import { ArrowDownIcon, ArrowUpIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const transactions = [
  {
    id: "1",
    amount: -320.5,
    status: "expense",
    date: "2023-04-01",
    description: "Grocery Store",
    category: "Food & Dining",
    icon: "🛒",
  },
  {
    id: "2",
    amount: 1200.0,
    status: "income",
    date: "2023-04-01",
    description: "Salary Deposit",
    category: "Income",
    icon: "💼",
  },
  {
    id: "3",
    amount: -45.2,
    status: "expense",
    date: "2023-03-31",
    description: "Gas Station",
    category: "Transportation",
    icon: "⛽",
  },
  {
    id: "4",
    amount: -125.0,
    status: "expense",
    date: "2023-03-30",
    description: "Electric Bill",
    category: "Utilities",
    icon: "💡",
  },
  {
    id: "5",
    amount: -55.3,
    status: "expense",
    date: "2023-03-29",
    description: "Restaurant",
    category: "Food & Dining",
    icon: "🍔",
  },
];

export function RecentTransactions() {
  return (
    <div className="space-y-4">
      {transactions.map((transaction) => (
        <div key={transaction.id} className="flex items-center">
          <Avatar className="h-9 w-9 mr-4">
            <AvatarFallback>{transaction.icon}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <p className="text-sm font-medium leading-none">
              {transaction.description}
            </p>
            <p className="text-xs text-muted-foreground">
              {transaction.category}
            </p>
          </div>
          <div className="text-right">
            <p
              className={cn(
                "text-sm font-medium",
                transaction.status === "expense"
                  ? "text-red-500"
                  : "text-green-500",
              )}
            >
              {transaction.status === "expense" ? (
                <ArrowDownIcon className="mr-1 h-4 w-4 inline" />
              ) : (
                <ArrowUpIcon className="mr-1 h-4 w-4 inline" />
              )}
              ${Math.abs(transaction.amount).toFixed(2)}
            </p>
            <p className="text-xs text-muted-foreground">
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

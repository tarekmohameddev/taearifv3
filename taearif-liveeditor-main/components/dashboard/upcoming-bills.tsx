import { CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const bills = [
  {
    id: "1",
    name: "Rent",
    amount: 1200,
    dueDate: "2023-04-05",
    status: "upcoming",
    category: "Housing",
  },
  {
    id: "2",
    name: "Internet",
    amount: 79.99,
    dueDate: "2023-04-10",
    status: "upcoming",
    category: "Utilities",
  },
  {
    id: "3",
    name: "Phone Bill",
    amount: 65.5,
    dueDate: "2023-04-15",
    status: "upcoming",
    category: "Utilities",
  },
  {
    id: "4",
    name: "Car Insurance",
    amount: 150,
    dueDate: "2023-04-20",
    status: "upcoming",
    category: "Insurance",
  },
  {
    id: "5",
    name: "Electricity",
    amount: 120.75,
    dueDate: "2023-04-25",
    status: "upcoming",
    category: "Utilities",
  },
];

export function UpcomingBills() {
  return (
    <div className="space-y-4">
      {bills.map((bill) => {
        const dueDate = new Date(bill.dueDate);
        const today = new Date();
        const daysUntilDue = Math.ceil(
          (dueDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24),
        );

        return (
          <div key={bill.id} className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="space-y-1">
                <p className="text-sm font-medium leading-none">{bill.name}</p>
                <p className="text-xs text-muted-foreground">{bill.category}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">
                  {daysUntilDue === 0
                    ? "Due today"
                    : daysUntilDue === 1
                      ? "Due tomorrow"
                      : `Due in ${daysUntilDue} days`}
                </span>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium">${bill.amount.toFixed(2)}</p>
                <Button variant="outline" size="sm" className="mt-1">
                  Pay Now
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

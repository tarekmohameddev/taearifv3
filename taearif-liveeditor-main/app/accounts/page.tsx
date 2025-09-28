import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AccountsList } from "@/components/accounts/accounts-list";
import { AccountBalances } from "@/components/accounts/account-balances";
import { AccountActivity } from "@/components/accounts/account-activity";

export default function AccountsPage() {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold tracking-tight">Accounts</h1>
      <Tabs defaultValue="all" className="space-y-4">
        <TabsList>
          <TabsTrigger value="all">All Accounts</TabsTrigger>
          <TabsTrigger value="bank">Bank Accounts</TabsTrigger>
          <TabsTrigger value="credit">Credit Cards</TabsTrigger>
          <TabsTrigger value="investment">Investments</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Assets</CardTitle>
                <CardDescription>All your account balances</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$45,231.89</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Total Debt</CardTitle>
                <CardDescription>Credit cards and loans</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$1,820.42</div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2">
                <CardTitle>Net Worth</CardTitle>
                <CardDescription>Assets minus debt</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$43,411.47</div>
              </CardContent>
            </Card>
          </div>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Account Balances</CardTitle>
                <CardDescription>
                  Overview of all your financial accounts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AccountBalances />
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Account List</CardTitle>
                <CardDescription>All your connected accounts</CardDescription>
              </CardHeader>
              <CardContent>
                <AccountsList />
              </CardContent>
            </Card>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Recent Account Activity</CardTitle>
              <CardDescription>
                Recent transactions across all accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccountActivity />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="bank" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Bank Accounts</CardTitle>
              <CardDescription>
                Your checking and savings accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccountsList type="bank" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="credit" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Credit Cards</CardTitle>
              <CardDescription>Your credit card accounts</CardDescription>
            </CardHeader>
            <CardContent>
              <AccountsList type="credit" />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="investment" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Investment Accounts</CardTitle>
              <CardDescription>
                Your investment and retirement accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AccountsList type="investment" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

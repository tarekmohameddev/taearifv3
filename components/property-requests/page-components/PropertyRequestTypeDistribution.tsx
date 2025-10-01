import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const PropertyRequestTypeDistribution = ({
  buyerCount,
  sellerCount,
  renterCount,
  landlordCount,
  investorCount,
}: any) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">توزيع العملاء حسب النوع</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{buyerCount}</div>
            <div className="text-sm text-muted-foreground">مشتري</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {sellerCount}
            </div>
            <div className="text-sm text-muted-foreground">بائع</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {renterCount}
            </div>
            <div className="text-sm text-muted-foreground">مستأجر</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {landlordCount}
            </div>
            <div className="text-sm text-muted-foreground">مؤجر</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {investorCount}
            </div>
            <div className="text-sm text-muted-foreground">مستثمر</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

import { PurchaseDetailPage } from "@/components/purchase-management/purchase-detail-page";

interface PageProps {
  params: {
    id: string;
  };
}

export default function PurchaseDetailPageRoute({ params }: PageProps) {
  return <PurchaseDetailPage requestId={params.id} />;
}

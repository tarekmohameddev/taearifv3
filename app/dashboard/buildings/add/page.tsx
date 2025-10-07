import BuildingForm from "@/components/buildings/building-form";

export const metadata = {
  title: "إضافة عمارة جديدة",
  description: "إضافة عمارة جديدة إلى النظام",
};

export default function AddBuildingPage() {
  return <BuildingForm mode="add" />;
}

import BuildingForm from "@/components/buildings/building-form";

export const metadata = {
  title: "تعديل العمارة",
  description: "تعديل بيانات العمارة",
};

export default function EditBuildingPage() {
  return <BuildingForm mode="edit" />;
}
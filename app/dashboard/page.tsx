import { GuidedTour } from "@/components/mainCOMP/sidebarComponents/guided-tour";
import { DashboardHomeDynamic } from "@/components/dashboard/DashboardHomeDynamic";

export const metadata = {
  title: "لوحة تحكم تعاريف",
};

export default function Page() {
  return (
    <>
      <DashboardHomeDynamic />
      <GuidedTour />
    </>
  );
}

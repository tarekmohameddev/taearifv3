// Export all building management components
export { default as BuildingsManagementPage } from "./buildings-management-page";
export { default as BuildingCard } from "./building-card";
export { default as BuildingsStats } from "./buildings-stats";
export { default as BuildingForm } from "./building-form";
export { default as AddBuildingPage } from "./add-building-page";
export { default as EditBuildingPage } from "./edit-building-page";

// Export types
export type {
  Building,
  Property,
  User,
  BuildingsResponse,
  BuildingsStats as BuildingsStatsType,
} from "./types";

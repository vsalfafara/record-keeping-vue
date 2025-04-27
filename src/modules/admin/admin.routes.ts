import { accessManagementModuleRoutes } from "./access-management/access-management";
import { propertiesModuleRoutes } from "./property-portfolio/properties/properties.routes";

export const adminModuleRoutes = [
  ...propertiesModuleRoutes,
  ...accessManagementModuleRoutes,
];

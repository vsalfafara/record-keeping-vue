import { accessManagementModuleRoutes } from "./access-management/access-management.routes";
import { propertyPortfolioModuleRoutes } from "./property-portfolio/property-portfolio.routes";

export const adminModuleRoutes = [
  ...propertyPortfolioModuleRoutes,
  ...accessManagementModuleRoutes,
];

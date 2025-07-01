import { accessManagementModuleRoutes } from "./access-management/access-management";
import { propertyPortfolioModuleRoutes } from "./property-portfolio/property-portfolio.routes";

export const adminModuleRoutes = [
  ...propertyPortfolioModuleRoutes,
  ...accessManagementModuleRoutes,
];

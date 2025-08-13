import { ROLES, SIDEBARGROUPS } from "@/lib/constants";
import { MapPin } from "lucide-vue-next";

export const propertyPortfolioModuleRoutes = [
  {
    path: "/properties",
    name: "Property Portfolio",
    component: () => import("./pages/properties/Properties.vue"),
    meta: {
      access: [ROLES.admin],
      group: SIDEBARGROUPS.admin,
      icon: MapPin,
    },
  },
  {
    path: "/properties/:id",
    name: "Property",
    component: () => import("./pages/property/Property.vue"),
    meta: {
      access: [ROLES.admin],
    },
  },
];

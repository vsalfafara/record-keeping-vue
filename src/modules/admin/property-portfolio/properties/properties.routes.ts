import { ROLES, SIDEBARGROUPS } from "@/lib/constants";
import { MapPin } from "lucide-vue-next";

export const propertiesModuleRoutes = [
  {
    path: "/properties",
    name: "Property Portfolio",
    component: () => import("./Properties.vue"),
    meta: {
      access: [ROLES.admin],
      group: SIDEBARGROUPS.admin,
      icon: MapPin,
    },
  },
];

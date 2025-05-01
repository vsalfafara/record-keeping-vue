import { ROLES, SIDEBARGROUPS } from "@/lib/constants";
import { UserCog } from "lucide-vue-next";

export const accessManagementModuleRoutes = [
  {
    path: "/access-management",
    name: "Access Management",
    component: () => import("./AccessManagement.vue"),
    meta: {
      access: [ROLES.admin],
      group: SIDEBARGROUPS.admin,
      icon: UserCog,
    },
  },
];

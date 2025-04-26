import { ROLES, SIDEBARGROUPS } from "@/lib/constants";
import { Users2 } from "lucide-vue-next";

export const accessManagementModuleRoutes = [
  {
    path: "/users",
    name: "Access Management",
    component: () => import("./AccessManagement.vue"),
    meta: {
      access: [ROLES.admin],
      group: SIDEBARGROUPS.admin,
      icon: Users2,
    },
  },
];

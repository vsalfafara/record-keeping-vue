import { ROLES, SIDEBARGROUPS } from "@/lib/constants";
import { FileCheck } from "lucide-vue-next";

export const tasksModuleRoutes = [
  {
    path: "/tasks",
    name: "Tasks",
    component: () => import("./Tasks.vue"),
    meta: {
      access: [ROLES.accountsClerk, ROLES.admin],
      group: SIDEBARGROUPS.platform,
      icon: FileCheck,
    },
  },
];

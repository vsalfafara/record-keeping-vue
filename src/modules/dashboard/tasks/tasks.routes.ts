import { SIDEBARGROUPS } from "@/lib/types";
import { FileCheck } from "lucide-vue-next";

export const tasksModuleRoutes = [
  {
    path: "/tasks",
    name: "Tasks",
    component: () => import("./Tasks.vue"),
    meta: {
      group: SIDEBARGROUPS.dashboard,
      icon: FileCheck,
    },
  },
];

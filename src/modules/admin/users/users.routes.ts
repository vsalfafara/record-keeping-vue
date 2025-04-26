import { SIDEBARGROUPS } from "@/lib/types";
import { Users2 } from "lucide-vue-next";

export const usersModuleRoutes = [
  {
    path: "/users",
    name: "Users",
    component: () => import("./Users.vue"),
    meta: {
      group: SIDEBARGROUPS.admin,
      icon: Users2,
    },
  },
];

import { ROLES, SIDEBARGROUPS } from "@/lib/constants";
import { Users } from "lucide-vue-next";

export const clientsModuleRoutes = [
  {
    path: "/clients",
    name: "Clients",
    component: () => import("./Clients.vue"),
    meta: {
      access: [ROLES.admin, ROLES.accountsClerk],
      group: SIDEBARGROUPS.platform,
      icon: Users,
    },
  },
  {
    path: "/clients/:id",
    name: "Client",
    component: () => import("./pages/Client.vue"),
  },
];

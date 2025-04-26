import { authenticationRoutes } from "@/authentication/authentication.routes";
import { useAuthenticationStore } from "@/authentication/authentication.store";
import { adminModuleRoutes } from "@/modules/admin/admin.routes";
import { dashboardModuleRoutes } from "@/modules/dashboard/dashboard.routes";
import { createRouter, createWebHistory } from "vue-router";

export const sidebarRoutes = [...dashboardModuleRoutes, ...adminModuleRoutes];

const dashboardRoutes = [
  {
    path: "/",
    component: () => import("@/layouts/AppLayout.vue"),
    children: [...sidebarRoutes],
  },
];

const routes = [
  ...authenticationRoutes,
  ...dashboardRoutes,
  {
    path: "/:pathMatch(.*)*",
    redirect: {
      name: "Login",
    },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, _, next) => {
  const { isAuthenticated } = useAuthenticationStore();

  if (!isAuthenticated && to.name !== "Login") next({ name: "Login" });
  else if (isAuthenticated && to.name === "Login") next({ name: "Tasks" });
  else next();
});

export default router;

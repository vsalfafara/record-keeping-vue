import { authenticationRoutes } from "@/authentication/authentication.routes";
import { useAuthenticationStore } from "@/authentication/authentication.store";
import { adminModuleRoutes } from "@/modules/admin/admin.routes";
import { platformModuleRoutes } from "@/modules/platform/platform.routes";
import { computed } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import { toast } from "vue-sonner";

export const sidebarRoutes = [...platformModuleRoutes, ...adminModuleRoutes];

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

router.beforeEach((to, from, next) => {
  const { isAuthenticated, getUser } = useAuthenticationStore();
  const user = computed(() => getUser.value);

  if (!isAuthenticated && to.name !== "Login") next({ name: "Login" });
  else if (isAuthenticated) {
    if (to.name === "Login") next({ name: "Tasks" });
    else if (
      to.meta.access instanceof Array &&
      !to.meta.access.includes(user.value?.data.role)
    ) {
      toast.error("You do not have permission to access this page");
      next(from);
    } else next();
  } else next();
});

export default router;

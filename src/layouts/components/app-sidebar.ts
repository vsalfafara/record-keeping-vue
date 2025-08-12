import { SIDEBARGROUPS } from "@/lib/constants";
import { sidebarRoutes } from "@/router/router.index";
import { computed, ref } from "vue";
import { type GroupedRoute } from "./app-sidebar.types";
import { useAuthenticationStore } from "@/authentication/authentication.store";

export function useGroupedSidebarRoutes() {
  const groupedRoutes = ref<GroupedRoute[]>([]);
  const { getUser } = useAuthenticationStore();
  const user = computed(() => getUser.value);
  Object.values(SIDEBARGROUPS).forEach((name) => {
    const routes = sidebarRoutes.filter(({ meta }) => {
      if (!meta) return false;
      const groupIsEqual = meta.group === name;
      const userHasAccess = meta.access.includes(user.value?.data.role || "");
      return groupIsEqual && userHasAccess;
    });
    const group = {
      name,
      routes,
    };
    if (group.routes.length) groupedRoutes.value.push(group);
  });

  return { groupedRoutes };
}

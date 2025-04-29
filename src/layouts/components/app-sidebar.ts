import { SIDEBARGROUPS } from "@/lib/constants";
import { sidebarRoutes } from "@/router/router.index";
import { computed, ref } from "vue";
import { type GroupedRoute } from "./app-sidebar.types";
import { useAuthenticationStore } from "@/authentication/authentication.store";

export function useGroupedSidebarRoutes() {
  const groupedRoutes = ref<GroupedRoute[]>([]);
  const { getUser } = useAuthenticationStore();
  const user = computed(() => getUser.value);
  Object.values(SIDEBARGROUPS).forEach((group) => {
    const routes = {
      name: group,
      routes: sidebarRoutes.filter(({ meta }) => {
        if (meta) {
          const groupIsEqual = meta.group === group;
          const userHasAccess = meta.access.includes(
            user.value?.data.role || "",
          );
          return groupIsEqual && userHasAccess;
        }
        return false;
      }),
    };
    if (routes.routes.length) groupedRoutes.value.push(routes);
  });

  return { groupedRoutes };
}

import { computed } from "vue";
import { useRoute, useRouter } from "vue-router";

export interface BreadcrumbItem {
  name: string;
  isCurrent: boolean;
}

export function useBreadcrumbs() {
  const router = useRouter();
  const route = useRoute();

  function getRouteSegments(): BreadcrumbItem[] {
    const current = router.currentRoute.value;
    const pathSegments = current.path.split("/").filter(Boolean);
    // Generates an incremental set of paths based on the slashes in the current URL.
    // For example if we are in the `/users/1/reports/`
    // We want to breadcrumb it like this: [`/users`, `/users/1`, `/users/1/reports`]
    const pathIncrementalSegments = pathSegments.map(
      (_, idx) => `/${pathSegments.slice(0, idx + 1).join("/")}`
    );

    const matchedRoutes = pathIncrementalSegments.map((s) => router.resolve(s));

    // In our app, titled routes are the ones that the user will face
    // Vue router will have a list of routes that do not neccesairly map to user-visitable routes.
    // For example routes with children, you want to match the children but not the parent.
    // So we discriminate with meta titles, but you can use any other filter that suits you.
    return matchedRoutes
      .filter((r) => r.name)
      .map((r) => {
        return {
          name: String(r.name),
          isCurrent: r.name === route.name,
        };
      });
  }

  const items = computed(getRouteSegments);

  return items;
}

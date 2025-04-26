<template>
  <Sidebar>
    <SidebarHeader
      ><h3 class="text-lg font-semibold text-center">Vue - ShadCN Template</h3>
    </SidebarHeader>
    <SidebarContent>
      <template v-for="(group, index) in groupedRoutes" :key="group.name">
        <Collapsible
          :default-open="
            !!group.routes.find((route) => activeRoute.name === route.name)
          "
          class="group/collapsible"
        >
          <SidebarGroup>
            <SidebarGroupLabel as-child>
              <CollapsibleTrigger>
                {{ group.name }}
                <ChevronDown
                  class="ml-auto transition-transform group-data-[state=open]/collapsible:rotate-180"
                />
              </CollapsibleTrigger>
            </SidebarGroupLabel>
            <CollapsibleContent>
              <SidebarGroupContent>
                <SidebarMenu v-for="route in group.routes" :key="route.name">
                  <SidebarMenuItem>
                    <SidebarMenuButton
                      as-child
                      :is-active="activeRoute.name === route.name"
                      @click="handleNavigate(route.name)"
                      class="cursor-pointer"
                    >
                      <div>
                        <component :is="route.meta?.icon" />
                        {{ route.name }}
                      </div>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </CollapsibleContent>
          </SidebarGroup>
        </Collapsible>
        <Separator v-if="index < groupedRoutes.length - 1" />
      </template>
    </SidebarContent>
    <SidebarFooter>
      <SidebarMenu>
        <SidebarMenuItem>
          <DropdownMenu>
            <DropdownMenuTrigger as-child>
              <SidebarMenuButton>
                <User /> {{ user?.emailAddress }}
              </SidebarMenuButton>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              side="top"
              class="w-[--reka-popper-anchor-width]"
            >
              <DropdownMenuItem @click="handleLogout">Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarFooter>
  </Sidebar>
</template>

<script setup lang="ts">
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import SidebarGroupContent from "@/components/ui/sidebar/SidebarGroupContent.vue";
import { ChevronDown, User } from "lucide-vue-next";
import { computed, onBeforeMount, ref } from "vue";
import { sidebarRoutes } from "@/router/router.index";
import { SIDEBARGROUPS } from "@/lib/types";
import {
  useRoute,
  useRouter,
  type RouteRecordName,
  type RouteRecordRaw,
} from "vue-router";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthenticationStore } from "@/authentication/authentication.store";
import { Separator } from "@/components/ui/separator";

type GroupedRoute = {
  name: string;
  routes: RouteRecordRaw[];
};

const { openMobile, setOpenMobile } = useSidebar();
const { getUser, logout } = useAuthenticationStore();
const user = computed(() => getUser.value);
const activeRoute = useRoute();
const router = useRouter();
const groupedRoutes = ref<GroupedRoute[]>([]);

onBeforeMount(() => {
  Object.values(SIDEBARGROUPS).forEach((group) => {
    const routes = {
      name: group,
      routes: sidebarRoutes.filter(({ meta }) =>
        meta ? meta.group === group : false
      ),
    };
    if (routes.routes.length) groupedRoutes.value.push(routes);
  });
});

function handleNavigate(name: RouteRecordName) {
  if (openMobile) setOpenMobile(false);
  router.push({ name });
}

function handleLogout() {
  logout();
  router.replace({ name: "Login" });
}
</script>

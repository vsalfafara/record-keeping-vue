import type { RouteRecordRaw } from "vue-router";

export type GroupedRoute = {
  name: string;
  routes: RouteRecordRaw[];
};

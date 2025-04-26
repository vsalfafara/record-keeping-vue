<template>
  <div
    class="p-4 flex items-center justify-between border-b bg-header bg-primary-foreground"
  >
    <div class="flex gap-4 items-center">
      <SidebarTrigger />
      <Breadcrumb>
        <BreadcrumbList>
          <template
            v-for="(breadcrumb, index) in breadcrumbs"
            :key="breadcrumb.name"
          >
            <BreadcrumbItem>
              <BreadcrumbPage v-if="breadcrumb.name === route.name">
                {{ breadcrumb.name }}
              </BreadcrumbPage>
              <BreadcrumbLink v-else as-child>
                <RouterLink :to="{ name: breadcrumb.name }">{{
                  breadcrumb.name
                }}</RouterLink>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator v-if="index < breadcrumbs.length - 1" />
          </template>
        </BreadcrumbList>
      </Breadcrumb>
    </div>
    <DarkMode />
  </div>
</template>

<script setup lang="ts">
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { DarkMode } from "@/components/custom/dark-mode";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useBreadcrumbs } from "@/lib/breadcrumbs";
import { useRoute } from "vue-router";

const breadcrumbs = useBreadcrumbs();
const route = useRoute();
</script>

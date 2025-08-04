<template>
  <div
    class="bg-header bg-primary-foreground flex items-center justify-between border-b p-4"
  >
    <div class="flex items-center gap-4">
      <SidebarTrigger />
      <AppBreadcrumbs />
    </div>
    <DarkMode />
  </div>
</template>

<script setup lang="ts">
import { DarkMode } from "@/components/custom/dark-mode";
import { SidebarTrigger } from "@/components/ui/sidebar";
import AppBreadcrumbs from "./AppBreadcrumbs.vue";
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <main class="w-full h-screen overflow-hidden">
      <AppHeader />
      <div class="p-4 max-h-[calc(100dvh-69px)] overflow-y-auto">
        <RouterView></RouterView>
      </div>
    </main>
  </SidebarProvider>
</template>

<script setup lang="ts">
import { SidebarProvider } from "@/components/ui/sidebar";
import AppHeader from "./components/AppHeader.vue";
import AppSidebar from "./components/AppSidebar.vue";
</script>

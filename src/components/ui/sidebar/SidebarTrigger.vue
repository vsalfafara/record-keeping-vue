<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { PanelLeft } from "lucide-vue-next";
import { useSidebar } from "./utils";

const { toggleSidebar } = useSidebar();
</script>

<template>
  <Button
    data-sidebar="trigger"
    data-slot="sidebar-trigger"
    variant="ghost"
    size="icon"
    @click="toggleSidebar"
  >
    <PanelLeft />
    <span class="sr-only">Toggle Sidebar</span>
  </Button>
</template>

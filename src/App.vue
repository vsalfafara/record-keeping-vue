<template>
  <div>
    <RouterView></RouterView>
    <Toaster class="pointer-events-auto" rich-colors />
  </div>
</template>

<script lang="ts" setup>
import { Toaster } from "@/components/ui/sonner";
</script>

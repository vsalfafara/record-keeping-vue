<template>
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger
        class="max-w-32 cursor-pointer overflow-hidden px-4 text-start text-ellipsis"
        >{{ remarks }}</TooltipTrigger
      >
      <TooltipContent class="text-sm">
        <p class="max-w-96">{{ remarks }}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
</template>

<script setup lang="ts">
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
const { remarks } = defineProps<{ remarks: string | null }>();
</script>

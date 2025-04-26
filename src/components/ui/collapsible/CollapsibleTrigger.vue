<script setup lang="ts">
import { CollapsibleTrigger, type CollapsibleTriggerProps } from "reka-ui";

const props = defineProps<CollapsibleTriggerProps>();
</script>

<template>
  <CollapsibleTrigger
    class="cursor-pointer"
    data-slot="collapsible-trigger"
    v-bind="props"
  >
    <slot />
  </CollapsibleTrigger>
</template>

<template>
  <div class="grid gap-4">
    <EditClientCard />
    <div>
      <p class="text-info">Property Information</p>
      <ClientLotsDataTable />
    </div>
  </div>
</template>

<script setup lang="ts">
import ClientLotsDataTable from "./components/ClientLotsDataTable.vue";
import EditClientCard from "./components/EditClientCard.vue";
</script>

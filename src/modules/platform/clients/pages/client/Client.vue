<template>
  <div class="grid gap-4">
    <EditClientCard />
    <ClientLotsDataTable />
  </div>
</template>

<script setup lang="ts">
import ClientLotsDataTable from "./components/ClientLotsDataTable.vue";
import EditClientCard from "./components/EditClientCard.vue";
</script>

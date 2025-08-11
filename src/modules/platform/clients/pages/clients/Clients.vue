<template>
  <div>
    <div class="mb-4 grid gap-y-4">
      <div class="flex items-center gap-2">
        <h1 class="text-3xl font-semibold">Client Records</h1>
      </div>
      <p class="text-muted-foreground text-sm">
        Here's a list of all your client Records
      </p>
    </div>
    <ClientsDataTable />
  </div>
</template>

<script setup lang="ts">
import ClientsDataTable from "./components/ClientsDataTable.vue";
</script>

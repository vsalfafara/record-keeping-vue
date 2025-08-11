<template>
  <div>
    <div class="mb-4 grid gap-y-4">
      <h1 class="text-3xl font-semibold">Access Management</h1>
      <p class="text-muted-foreground text-sm">
        Here's a list of all your admin access
      </p>
    </div>
    <UsersDataTable />
  </div>
</template>

<script setup lang="ts">
import UsersDataTable from "./components/UsersDataTable.vue";
</script>

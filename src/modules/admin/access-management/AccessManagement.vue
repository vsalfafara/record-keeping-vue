<template>
  <div>
    <div class="mb-4 grid gap-y-4">
      <h1 class="text-3xl font-semibold">Access Management</h1>
      <p class="text-secondary-foreground text-sm">
        Here's a list of all your admin access
      </p>
    </div>
    <DataTable enable-filter :columns :data :is-loading :visibleColumns>
      <template #actions>
        <AddUserDialog @refresh="execute" />
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { useGuardedAxiosInstance } from "@/lib/axios";
import { type VisibilityState, type ColumnDef } from "@tanstack/vue-table";
import { useStorage } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { ArrowUpDown } from "lucide-vue-next";
import { h } from "vue";
import AddUserDialog from "./components/AddUserDialog.vue";

type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: ["ADMIN", "ACCOUNTS_CLERK"];
  hasLoggedInOnce: boolean;
  createdBy: string;
  createdOn: string;
};

const visibleColumns = useStorage<VisibilityState>(
  "users-table",
  {},
  localStorage,
);

const { data, execute, isLoading } = useAxios(
  "/users",
  useGuardedAxiosInstance(),
);

const columns: ColumnDef<User>[] = [
  {
    accessorKey: "firstName",
    enableSorting: true,
    meta: "First Name",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["First Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("firstName"),
  },
  {
    accessorKey: "lastName",
    enableSorting: true,
    meta: "Last Name",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Last Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("lastName"),
  },
  {
    accessorKey: "role",
    enableSorting: true,
    meta: "Role",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Role", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("role"),
  },
  {
    accessorKey: "email",
    enableSorting: true,
    meta: "Email",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Email", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("email"),
  },
  {
    accessorKey: "createdBy",
    enableSorting: true,
    meta: "Created By",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Created By", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("createdBy"),
  },
  {
    accessorKey: "createdOn",
    enableSorting: true,
    meta: "Created On",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Created On", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("createdOn"),
  },
];
</script>

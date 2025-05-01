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
    <DataTable
      enable-filter
      :columns
      :data="data || []"
      :is-loading
      :visibleColumns
    >
      <template #actions>
        <AddClientDialog @refresh="execute" />
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
import { type Client } from "./clients.types";
import AddClientDialog from "./components/AddClientDialog.vue";
import EditClientButton from "./components/EditClientButton.vue";

const visibleColumns = useStorage<VisibilityState>(
  "clients-table",
  {},
  localStorage,
);

const { data, execute, isLoading } = useAxios(
  "/clients",
  useGuardedAxiosInstance(),
);

const columns: ColumnDef<Client>[] = [
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
    accessorKey: "birthDate",
    enableSorting: true,
    meta: "Birth Date",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Birth Date", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("birthDate"),
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
    accessorKey: "fullAddress",
    enableSorting: true,
    meta: "Full Address",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Full Address", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("fullAddress"),
  },
  {
    accessorKey: "mobileNumber",
    enableSorting: true,
    meta: "Mobile Number",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Mobile Number", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("mobileNumber"),
  },
  {
    accessorKey: "landlineNumber",
    enableSorting: true,
    meta: "Landline Number",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Landline Number", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("landlineNumber"),
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
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const { id } = row.original;
      const actions = [];

      actions.push(h(EditClientButton, { id }));

      return h("div", { class: "flex gap-2 justify-end" }, actions);
    },
  },
];
</script>

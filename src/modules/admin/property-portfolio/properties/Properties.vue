<template>
  <div>
    <div class="mb-4 grid gap-y-4">
      <div class="flex items-center gap-2">
        <h1 class="text-3xl font-semibold">Property Portfolio</h1>
        <Badge variant="outline"
          >Total available lots:
          {{ isLoading ? "_" : data.totalAvailableLots }}</Badge
        >
        <Badge variant="outline"
          >Total taken lots: {{ isLoading ? "_" : data.totalTakenLots }}</Badge
        >
      </div>
      <p class="text-muted-foreground text-sm">
        Here's a list of all your property ownings
      </p>
    </div>
    <DataTable
      enable-filter
      :columns
      :data="data?.properties || []"
      :is-loading
      :visibleColumns
    >
      <template #actions>
        <AddPropertyDialog @refresh="execute" />
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
import type { Property } from "./properties.types";
import { Badge } from "@/components/ui/badge";
import AddPropertyDialog from "./components/AddPropertyDialog.vue";
import EditPropertyButton from "./components/EditPropertyButton.vue";

type PropertyColumns = Property & {
  numberOfBlocks: number;
  numberOfLots: number;
  takenLots: number;
  availableLots: number;
};

const visibleColumns = useStorage<VisibilityState>(
  "properties-table",
  {},
  localStorage,
);

const { data, execute, isLoading } = useAxios(
  "/properties",
  useGuardedAxiosInstance(),
);

const columns: ColumnDef<PropertyColumns>[] = [
  {
    accessorKey: "name",
    enableSorting: true,
    meta: "Name",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("name"),
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
    accessorKey: "numberOfBlocks",
    enableSorting: true,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    meta: "# of Blocks",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["# of Blocks", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("numberOfBlocks"),
  },
  {
    accessorKey: "numberOfLots",
    enableSorting: true,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    meta: "# of Lots",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["# of Lots", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("numberOfLots"),
  },
  {
    accessorKey: "takenLots",
    enableSorting: true,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    meta: "Taken Lots",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Taken Lots", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("takenLots"),
  },
  {
    accessorKey: "availableLots",
    enableSorting: true,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    meta: "Available Lots",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Available Lots", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("availableLots"),
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

      actions.push(h(EditPropertyButton, { id }));

      return h("div", { class: "flex gap-2 justify-end" }, actions);
    },
  },
];
</script>

<template>
  <DataTable enable-filter :data :isLoading :columns :visibleColumns>
    <template #actions>
      <AddBlockDialog @refresh="execute()" />
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { useGuardedAxiosInstance } from "@/lib/axios";
import type { ColumnDef, VisibilityState } from "@tanstack/vue-table";
import { useStorage } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { ArrowUpDown } from "lucide-vue-next";
import { h } from "vue";
import { useRoute } from "vue-router";
import AddBlockDialog from "./AddBlockDialog.vue";

type BlockColumns = {
  name: string;
  numberOfLots: number;
  takenLots: number;
  availableLots: number;
  createdBy: number;
  createdOn: number;
};

const { params } = useRoute();
const visibleColumns = useStorage<VisibilityState>(
  "blocks-table",
  {},
  localStorage,
);
const { data, execute, isLoading } = useAxios(
  `/properties/${params.id}/blocks`,
  useGuardedAxiosInstance(),
);

const columns: ColumnDef<BlockColumns>[] = [
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
    accessorKey: "numberOfLots",
    enableSorting: true,
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
];
</script>

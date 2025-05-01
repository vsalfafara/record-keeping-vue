<template>
  <DataTable enable-filter :data :isLoading :columns :visibleColumns>
    <template #actions>
      <AddClientLotDialog @refresh="execute()" />
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import { useGuardedAxiosInstance } from "@/lib/axios";
import { currencyFormatter } from "@/lib/utils";
import type { ColumnDef, VisibilityState } from "@tanstack/vue-table";
import { useStorage } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { ArrowUpDown } from "lucide-vue-next";
import { h } from "vue";
import { useRoute } from "vue-router";
import AddClientLotDialog from "./AddClientLotDialog.vue";

type ClientLotColumns = {
  id: number;
  property: {
    id: number;
    name: string;
  };
  block: {
    id: number;
    name: string;
  };
  lot: {
    id: number;
    name: string;
    price: number;
  };
  createdBy: number;
  createdOn: number;
};

const { params } = useRoute();
const visibleColumns = useStorage<VisibilityState>(
  "client-lots-table",
  {},
  localStorage,
);

const { data, execute, isLoading } = useAxios(
  `/clients/${params.id}/lots`,
  useGuardedAxiosInstance(),
);

const columns: ColumnDef<ClientLotColumns>[] = [
  {
    accessorKey: "property.name",
    enableSorting: true,
    meta: "Property Name",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Property Name", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.original.property.name,
  },
  {
    accessorKey: "block.name",
    enableSorting: true,
    meta: "Block",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Block", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.original.block.name,
  },
  {
    accessorKey: "lot.name",
    enableSorting: true,
    meta: "Lot No.",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Lot No.", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.original.lot.name,
  },
  {
    accessorKey: "lot.price",
    enableSorting: true,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    meta: "Lot Price",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Lot Price", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => currencyFormatter.format(row.original.lot.price),
  },
  {
    accessorKey: "actualPrice",
    enableSorting: true,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    meta: "Actual Price",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Actual Price", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => currencyFormatter.format(row.getValue("actualPrice")),
  },
  {
    accessorKey: "balance",
    enableSorting: true,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    meta: "Balance",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Balance", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => currencyFormatter.format(row.getValue("balance")),
  },
  {
    accessorKey: "agent",
    enableSorting: true,
    meta: "Agent",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Agent", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("agent"),
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
  // {
  //   id: "actions",
  //   enableHiding: false,
  //   cell: ({ row }) => {
  //     const { id: blockId } = row.original;
  //     const actions = [];

  //     actions.push(h(EditBlockSheet, { blockId, onRefresh: () => execute() }));

  //     return h("div", { class: "flex gap-2 justify-end" }, actions);
  //   },
  // },
];
</script>

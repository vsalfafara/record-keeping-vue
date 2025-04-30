<template>
  <DataTable enable-filter :data :isLoading :columns :visibleColumns>
    <template #actions>
      <AddLotDialog :blockId @refresh="execute()" />
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { DataTable } from "@/components/custom/data-table";
import { Button } from "@/components/ui/button";
import EditLotDialog from "./EditLotDialog.vue";
import { useGuardedAxiosInstance } from "@/lib/axios";
import type { ColumnDef, VisibilityState } from "@tanstack/vue-table";
import { useStorage } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { ArrowUpDown } from "lucide-vue-next";
import { h } from "vue";
import AddLotDialog from "./AddLotDialog.vue";
import { Badge } from "@/components/ui/badge";
import { RemarksTooltip } from "@/components/custom/remarks-tooltip";

type LotColumns = {
  id: number;
  name: string;
  lotType: string;
  price: number;
  taken: boolean;
  remarks: string;
  createdBy: number;
  createdOn: number;
};

type LotsProps = {
  blockId: number;
};

const { blockId } = defineProps<LotsProps>();
const visibleColumns = useStorage<VisibilityState>(
  "lots-table",
  {},
  localStorage,
);
const { data, execute, isLoading } = useAxios(
  `/blocks/${blockId}/lots`,
  useGuardedAxiosInstance(),
);

const columns: ColumnDef<LotColumns>[] = [
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
    accessorKey: "lotType",
    enableSorting: true,
    meta: "Lot Type",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Lot Type", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("lotType"),
  },
  {
    accessorKey: "price",
    enableSorting: true,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    meta: "Price",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Price", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("price"),
  },
  {
    accessorKey: "taken",
    enableSorting: false,
    enableColumnFilter: false,
    enableGlobalFilter: false,
    meta: "Is Taken",
    header: "Is Taken",
    cell: ({ row }) => {
      const isTaken = row.getValue("taken");
      const value = isTaken ? "Taken" : "Not Taken";
      const variant = isTaken ? "success" : "destructive";
      return h(Badge, { variant }, () => value);
    },
  },
  {
    accessorKey: "remarks",
    enableSorting: true,
    meta: "Remarks",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Remarks", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => {
      const remarks: string = row.getValue("remarks");
      if (remarks) return h(RemarksTooltip, { remarks });
      return remarks;
    },
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
      const lot: any = row.original;
      const actions = [];

      actions.push(h(EditLotDialog, { lot, onRefresh: () => execute() }));

      return h("div", { class: "flex gap-2 justify-end" }, actions);
    },
  },
];
</script>

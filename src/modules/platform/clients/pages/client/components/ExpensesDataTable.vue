<template>
  <DataTable
    enable-pagination
    client-lot-max-height
    :data
    :columns
    :is-loading
    :visibleColumns
  >
    <template #actions>
      <AddExpenseDialog @refresh="execute" />
    </template>
  </DataTable>
</template>
<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/custom/data-table";
import { RemarksTooltip } from "@/components/custom/remarks-tooltip";
import { useGuardedAxiosInstance } from "@/lib/axios";
import type { ColumnDef, VisibilityState } from "@tanstack/vue-table";
import { useDateFormat, useStorage } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { ArrowUpDown } from "lucide-vue-next";
import { h, inject } from "vue";
import Receipt from "./Receipt.vue";
import AddExpenseDialog from "./AddExpenseDialog.vue";

type ExpensesColumns = {
  purpose: string;
  payment: number;
  dateOfPayment: string;
  remarks: string;
  receipt: string;
  createdBy: string;
  createdOn: string;
};

const clientLotId = inject("clientLotId");

const { data, execute, isLoading } = useAxios(
  `/client-lots/${clientLotId}/expenses`,
  useGuardedAxiosInstance(),
);

const visibleColumns = useStorage<VisibilityState>(
  "expenses-table",
  {},
  localStorage,
);

const columns: ColumnDef<ExpensesColumns>[] = [
  {
    accessorKey: "purpose",
    enableSorting: true,
    meta: "Purpose",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Purpose", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("purpose"),
  },
  {
    accessorKey: "payment",
    meta: "Payment",
    header: "Payment",
    cell: ({ row }) => `₱${row.getValue("payment")}`,
  },
  {
    accessorKey: "dateOfPayment",
    enableSorting: true,
    meta: "Date of Payment",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Date of Payment", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) =>
      useDateFormat(row.getValue("dateOfPayment"), "DD MMM YYYY").value,
  },
  {
    accessorKey: "remarks",
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
    accessorKey: "receipt",
    meta: "Receipt",
    header: "Receipt",
    cell: ({ row }) => {
      const receiptName: string = row.getValue("receipt");
      return h(Receipt, {
        receiptName,
      });
    },
  },
  {
    accessorKey: "createdBy",
    enableSorting: true,
    meta: "Added By",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Added By", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => row.getValue("createdBy"),
  },
  {
    accessorKey: "createdOn",
    enableSorting: true,
    meta: "Added On",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Added On", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) =>
      useDateFormat(row.getValue("createdOn"), "DD MMM YYYY").value,
  },
];
</script>

<template>
  <DataTable
    enable-pagination
    client-lot-max-height
    :data
    :columns
    :is-loading
    :visibleColumns
  />
</template>
<script setup lang="ts">
import { DataTable } from "@/components/custom/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useGuardedAxiosInstance } from "@/lib/axios";
import type { ColumnDef, VisibilityState } from "@tanstack/vue-table";
import { useDateFormat, useStorage } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { ArrowUpDown } from "lucide-vue-next";
import { h, inject } from "vue";

type PaymentPlanColumns = {
  status: string;
  installmentMonths: string;
  dueDate: string;
  discount: number;
  penalty: number;
  paymentDue: number;
  paid: number;
};

const clientLotId = inject("clientLotId");

const { data, isLoading } = useAxios(
  `/client-lots/${clientLotId}/payment-plan`,
  useGuardedAxiosInstance(),
);

const visibleColumns = useStorage<VisibilityState>(
  "payment-plan-table",
  {},
  localStorage,
);

const columns: ColumnDef<PaymentPlanColumns>[] = [
  {
    accessorKey: "status",
    enableSorting: true,
    meta: "Status",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Status", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      return h(
        Badge,
        {
          class: {
            "bg-success text-white": status === "Paid",
            "bg-destructive text-white": status === "Overdue",
            "bg-slate-500 text-white": status === "Pending",
          },
        },
        () => row.getValue("status"),
      );
    },
  },
  {
    accessorKey: "installmentMonths",
    meta: "Installment Months",
    header: "Installment Months",
    cell: ({ row }) => `${row.getValue("installmentMonths")} Months`,
  },
  {
    accessorKey: "dueDate",
    enableSorting: true,
    meta: "Due Date",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Due Date", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) =>
      useDateFormat(row.getValue("dueDate"), "DD MMM YYYY").value,
  },
  {
    accessorKey: "discount",
    meta: "Discount",
    header: "Discount",
    cell: ({ row }) => `₱${row.getValue("discount")}`,
  },
  {
    accessorKey: "penalty",
    meta: "Penalty",
    header: "Penalty",
    cell: ({ row }) => `₱${row.getValue("penalty")}`,
  },
  {
    accessorKey: "paymentDue",
    enableSorting: true,
    meta: "Payment Due",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Payment Due", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => `₱${row.getValue("paymentDue")}`,
  },
  {
    accessorKey: "paid",
    enableSorting: true,
    meta: "Paid",
    header: ({ column }) => {
      return h(
        Button,
        {
          variant: "ghost",
          onClick: () => column.toggleSorting(column.getIsSorted() === "asc"),
        },
        () => ["Paid", h(ArrowUpDown, { class: "ml-2 h-4 w-4" })],
      );
    },
    cell: ({ row }) => `₱${row.getValue("paid")}`,
  },
];
</script>

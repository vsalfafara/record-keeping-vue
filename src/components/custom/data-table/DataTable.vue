<template>
  <div class="w-full">
    <div class="flex items-center justify-between gap-2 py-2">
      <div v-if="enableFilter" class="flex flex-1 items-center gap-2">
        <Input
          class="max-w-xs"
          :placeholder="`Search ${columnToFilter && columnToFilter !== 'all' ? table.getColumn(columnToFilter)?.columnDef.meta : 'All'}`"
          v-model="search"
          :disabled="!columnToFilter"
        />
        <Select v-model="columnToFilter">
          <SelectTrigger>
            <SelectValue placeholder="Search Column" />
            <template #icon>
              <Funnel class="size-4 opacity-50" />
            </template>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem
              v-for="column in table
                .getAllColumns()
                .filter((column) => column.getCanFilter())"
              :key="column.id"
              :value="column.id"
            >
              {{ column.columnDef.meta }}
            </SelectItem>
          </SelectContent>
        </Select>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button variant="outline" :class="{ 'ml-auto': !enableFilter }">
            <Settings2 /> Toggle Columns
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuCheckboxItem
            v-for="column in table
              .getAllColumns()
              .filter((column) => column.getCanHide())"
            :key="column.id"
            class="capitalize"
            :model-value="column.getIsVisible()"
            @update:model-value="
              (value) => {
                column.toggleVisibility(!!value);
                visibleColumns[column.id] = value;
              }
            "
          >
            {{ column.columnDef.meta }}
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <slot name="actions" />
    </div>
    <div
      class="rounded-md border"
      :class="{ 'max-h-[calc(100dvh-400px)] overflow-y-auto': maxHeight }"
    >
      <Table>
        <TableHeader>
          <TableRow
            v-for="headerGroup in table.getHeaderGroups()"
            :key="headerGroup.id"
          >
            <TableHead v-for="header in headerGroup.headers" :key="header.id">
              <FlexRender
                v-if="!header.isPlaceholder"
                :render="header.column.columnDef.header"
                :props="header.getContext()"
              />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow v-if="isLoading">
            <TableCell :colspan="columns.length" class="h-24 text-center">
              <div class="flex items-center justify-center">
                <Loader2 class="mr-2 animate-spin" /> Loading...
              </div>
            </TableCell>
          </TableRow>
          <template v-else-if="table.getRowModel().rows?.length">
            <template v-for="row in table.getRowModel().rows" :key="row.id">
              <TableRow :data-state="row.getIsSelected() && 'selected'">
                <TableCell v-for="cell in row.getVisibleCells()" :key="cell.id">
                  <FlexRender
                    :render="cell.column.columnDef.cell"
                    :props="cell.getContext()"
                  />
                </TableCell>
              </TableRow>
            </template>
          </template>
          <TableRow v-else>
            <TableCell :colspan="columns.length" class="h-24 text-center">
              No results.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
    <div class="flex items-center justify-end space-x-2 py-4">
      <div class="space-x-2">
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanPreviousPage()"
          @click="table.previousPage()"
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          :disabled="!table.getCanNextPage()"
          @click="table.nextPage()"
        >
          Next
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="TData, TValue">
import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  SortingState,
  VisibilityState,
} from "@tanstack/vue-table";
import { valueUpdater } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  FlexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useVueTable,
} from "@tanstack/vue-table";
import { Funnel, Loader2, Settings2 } from "lucide-vue-next";
import { ref, watch } from "vue";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type DataTableProps = {
  enableFilter?: boolean;
  columns: ColumnDef<TData, TValue>[];
  data: any[];
  isLoading: boolean;
  visibleColumns?: VisibilityState;
  maxHeight?: boolean;
};

const {
  columns,
  data = [],
  isLoading = false,
  enableFilter = false,
  visibleColumns = {},
  maxHeight = false,
} = defineProps<DataTableProps>();

const search = ref<any>();
const columnToFilter = ref<string>();

const sorting = ref<SortingState>([]);
const columnFilters = ref<ColumnFiltersState>([]);
const columnVisibility = ref<VisibilityState>(visibleColumns);
const rowSelection = ref({});
const expanded = ref<ExpandedState>({});

let table = initializeTable();

function initializeTable() {
  return useVueTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onSortingChange: (updaterOrValue) => valueUpdater(updaterOrValue, sorting),
    onColumnFiltersChange: (updaterOrValue) =>
      valueUpdater(updaterOrValue, columnFilters),
    onColumnVisibilityChange: (updaterOrValue) =>
      valueUpdater(updaterOrValue, columnVisibility),
    onRowSelectionChange: (updaterOrValue) =>
      valueUpdater(updaterOrValue, rowSelection),
    onExpandedChange: (updaterOrValue) =>
      valueUpdater(updaterOrValue, expanded),
    state: {
      get sorting() {
        return sorting.value;
      },
      get columnFilters() {
        return columnFilters.value;
      },
      get columnVisibility() {
        return columnVisibility.value;
      },
      get rowSelection() {
        return rowSelection.value;
      },
      get expanded() {
        return expanded.value;
      },
      columnPinning: {
        right: ["actions"],
      },
    },
  });
}

function handleFilter() {
  if (columnToFilter.value) {
    if (columnToFilter.value === "all") table.setGlobalFilter(search.value);
    else table.getColumn(columnToFilter.value)?.setFilterValue(search.value);
  }
}

watch(
  () => data,
  () => (table = initializeTable()),
);

watch(search, () => handleFilter());

watch(columnToFilter, () => {
  search.value = "";
  table.resetGlobalFilter();
  table.resetColumnFilters();
});
</script>

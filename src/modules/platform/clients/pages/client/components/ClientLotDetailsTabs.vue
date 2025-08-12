<template>
  <Tabs default-value="payment-plan">
    <TabsList>
      <TabsTrigger value="payment-plan"> Payment Plan </TabsTrigger>
      <TabsTrigger value="interment"> Interment </TabsTrigger>
      <TabsTrigger value="perpetual-care"> Perpetual Care </TabsTrigger>
      <TabsTrigger value="invoices"> Invoices </TabsTrigger>
      <TabsTrigger value="expenses"> Expenses </TabsTrigger>
    </TabsList>
    <TabsContent value="payment-plan">
      <PaymentPlanDataTable />
    </TabsContent>
    <TabsContent value="interment"> Under construction... </TabsContent>
    <TabsContent value="perpetual-care"> Under construction... </TabsContent>
    <TabsContent value="invoices"> <InvoiceDataTable /> </TabsContent>
    <TabsContent value="expenses"> Under construction... </TabsContent>
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentPlanDataTable from "./PaymentPlanDataTable.vue";
import InvoiceDataTable from "./InvoiceDataTable.vue";
</script>

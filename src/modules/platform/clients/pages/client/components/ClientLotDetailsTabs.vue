<template>
  <Tabs :default-value="isReservation() ? 'invoices' : 'payment-plan'">
    <TabsList>
      <TabsTrigger value="payment-plan" :disabled="isReservation()">
        Payment Plan
      </TabsTrigger>
      <TabsTrigger value="interment" :disabled="isReservation()">
        Interment
      </TabsTrigger>
      <TabsTrigger value="perpetual-care" :disabled="isReservation()">
        Perpetual Care
      </TabsTrigger>
      <TabsTrigger value="invoices"> Invoices </TabsTrigger>
      <TabsTrigger value="expenses"> Expenses </TabsTrigger>
    </TabsList>
    <TabsContent value="payment-plan">
      <PaymentPlanDataTable />
    </TabsContent>
    <TabsContent value="interment"> Under construction... </TabsContent>
    <TabsContent value="perpetual-care"> Under construction... </TabsContent>
    <TabsContent value="invoices"> <InvoiceDataTable /> </TabsContent>
    <TabsContent value="expenses"> <ExpensesDataTable /> </TabsContent>
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentPlanDataTable from "./PaymentPlanDataTable.vue";
import InvoiceDataTable from "./InvoiceDataTable.vue";
import ExpensesDataTable from "./ExpensesDataTable.vue";
import { inject } from "vue";

const paymentType = inject("paymentType");

function isReservation() {
  return paymentType === "Reservation";
}
</script>

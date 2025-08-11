<template>
  <Tabs default-value="payment-plan">
    <TabsList>
      <TabsTrigger value="payment-plan"> Payment Plan </TabsTrigger>
      <TabsTrigger value="interment"> Interment </TabsTrigger>
    </TabsList>
    <TabsContent value="payment-plan">
      <PaymentPlanDataTable />
    </TabsContent>
    <TabsContent value="interment"> Under construction... </TabsContent>
  </Tabs>
</template>

<script setup lang="ts">
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentPlanDataTable from "./PaymentPlanDataTable.vue";
</script>

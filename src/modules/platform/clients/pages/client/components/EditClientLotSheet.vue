<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button size="icon" variant="outline"><Pencil /></Button>
    </SheetTrigger>
    <SheetContent class="p-4 sm:max-w-full">
      <EditClientLotForm />
      <ClientLotDetailsTabs />
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Pencil } from "lucide-vue-next";
import EditClientLotForm from "./EditClientLotForm.vue";
import ClientLotDetailsTabs from "./ClientLotDetailsTabs.vue";
import { provide } from "vue";

type EditClientLotSheetProps = {
  clientLotId: number;
  paymentType: string;
};

const { clientLotId, paymentType } = defineProps<EditClientLotSheetProps>();

provide("clientLotId", clientLotId);
provide("paymentType", paymentType);
</script>

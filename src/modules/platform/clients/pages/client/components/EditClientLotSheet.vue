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
  clientId: number;
  propertyId: number;
  blockId: number;
  lot: {
    id: number;
    name: string;
    price: number;
  };
  clientLotId: number;
  paymentType: string;
};

const { clientId, propertyId, blockId, lot, clientLotId, paymentType } =
  defineProps<EditClientLotSheetProps>();

const emits = defineEmits(["refresh"]);

provide("refresh", emits);
provide("clientId", clientId);
provide("propertyId", propertyId);
provide("blockId", blockId);
provide("lot", lot);
provide("clientLotId", clientLotId);
provide("paymentType", paymentType);
</script>

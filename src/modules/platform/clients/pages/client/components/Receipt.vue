<template>
  <Dialog>
    <DialogTrigger as-child>
      <Button variant="outline"> View Receipt </Button>
    </DialogTrigger>
    <DialogContent
      allow-close-on-overlay
      class="border-0 bg-transparent shadow-none"
    >
      <VisuallyHidden>
        <DialogTitle></DialogTitle>
      </VisuallyHidden>
      <img :src="image" class="h-full w-auto" />
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useEnv } from "@/lib/env";
import { VisuallyHidden } from "reka-ui";
import { ref } from "vue";
const { receiptName } = defineProps<{ receiptName: string }>();
const { env } = useEnv();
const image = ref<string>(
  `https://res.cloudinary.com/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload/v1736597556/${receiptName}`,
);
</script>

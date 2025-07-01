<template>
  <Button
    variant="outline"
    size="icon"
    @click="router.push({ name: 'Property', params: { id } })"
    ><Pen
  /></Button>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-vue-next";
import { useRouter } from "vue-router";

type EditPropertyButtonProps = {
  id: number;
};

const { id } = defineProps<EditPropertyButtonProps>();

const router = useRouter();
</script>

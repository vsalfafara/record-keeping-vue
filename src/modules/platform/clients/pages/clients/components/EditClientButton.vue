<template>
  <Button
    variant="outline"
    size="icon"
    @click="router.push({ name: 'Client', params: { id } })"
    ><Pen
  /></Button>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Pen } from "lucide-vue-next";
import { useRouter } from "vue-router";

type EditClientButtonProps = {
  id: number;
};

const { id } = defineProps<EditClientButtonProps>();

const router = useRouter();
</script>

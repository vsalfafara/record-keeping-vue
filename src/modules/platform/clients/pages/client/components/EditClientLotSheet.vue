<template>
  <Sheet>
    <SheetTrigger as-child>
      <Button size="icon" variant="outline"><Pencil /></Button>
    </SheetTrigger>
    <SheetContent>
      <SheetHeader>
        <SheetTitle>
          <Pencil
            class="bg-info/10 text-info dark:bg-info h-8 w-8 rounded-md p-2 dark:text-white"
          />
        </SheetTitle>
        <SheetDescription>test sheet</SheetDescription>
      </SheetHeader>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Pencil } from "lucide-vue-next";
</script>

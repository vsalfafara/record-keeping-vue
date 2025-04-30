<template>
  <Sheet
    :open="dialogState"
    @update:open="
      (state) => {
        dialogState = state;
        if (state) {
          execute();
        }
      }
    "
  >
    <SheetTrigger as-child>
      <Button variant="outline" size="icon">
        <Pen />
      </Button>
    </SheetTrigger>
    <SheetContent class="sm:max-w-full">
      <SheetHeader>
        <SheetTitle>
          <Pen
            class="bg-info/10 text-info dark:bg-info h-8 w-8 rounded-md p-2 dark:text-white"
          />
        </SheetTitle>
        <SheetDescription>
          <Skeleton v-if="isLoading" class="h-9 w-32" />
          <h3 v-else class="text-info mb-2 text-lg font-semibold">
            {{ data?.name }}
          </h3>
          <p>Fill out the form</p>
        </SheetDescription>
      </SheetHeader>
      <div class="grid gap-4 p-4">
        <form @submit="handleUpdateBlock" class="flex items-end gap-2">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem class="flex-1">
              <FormLabel>Block Name *</FormLabel>
              <FormControl>
                <Skeleton v-if="isLoading" class="h-9" />
                <Input v-else type="text" v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>
          <Button type="submit" variant="info" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="animate-spin" />
            {{ isLoading ? "Saving changes..." : "Save Changes" }}
          </Button>
        </form>
        <div>
          <p class="text-info">Lots</p>
          <Lots :blockId />
        </div>
      </div>
    </SheetContent>
  </Sheet>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGuardedAxiosInstance } from "@/lib/axios";
import { toTypedSchema } from "@vee-validate/zod";
import { useTitle } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { AxiosError } from "axios";
import { Loader2, Pen } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { ref, watch } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";
import Lots from "./Lots.vue";

type EditBlockSheetProps = {
  blockId: number;
};

const emit = defineEmits(["refresh"]);
const { blockId } = defineProps<EditBlockSheetProps>();
const title = useTitle();
const dialogState = ref<boolean>(false);
const { data, execute, isLoading } = useAxios(
  `/blocks/${blockId}`,
  useGuardedAxiosInstance(),
  { immediate: false },
);

watch(data, () => {
  title.value = data.value.name;
  form.setValues(data.value);
});

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const handleUpdateBlock = form.handleSubmit(async (values) => {
  try {
    const body = {
      ...values,
    };
    await execute({ method: "PUT", data: body });
    toast.success(data.value.message);
    dialogState.value = false;
    await execute();
    emit("refresh");
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
});
</script>

<style scoped></style>

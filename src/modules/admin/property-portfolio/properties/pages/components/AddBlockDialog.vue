<template>
  <Form v-slot="{ handleSubmit }" :validation-schema="formSchema" as="">
    <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
      <DialogTrigger as-child>
        <Button variant="info"> <Plus /> Add Block </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            ><Plus
              class="bg-info/10 text-info dark:bg-info h-8 w-8 rounded-md p-2 dark:text-white"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="text-primary mb-2 text-lg font-semibold">Add Block</h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="add-block-form"
          @submit="handleSubmit($event, handleCreateBlock)"
        >
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input property name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>
        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline"> Cancel </Button>
          </DialogClose>
          <Button
            variant="info"
            type="submit"
            form="add-block-form"
            :disabled="isLoading"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? "Creating block..." : "Confirm" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>

<script setup lang="ts">
import { useAuthenticationStore } from "@/authentication/authentication.store";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGuardedAxiosInstance } from "@/lib/axios";
import { toTypedSchema } from "@vee-validate/zod";
import { now, useDateFormat } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { AxiosError } from "axios";
import { Plus, Loader2 } from "lucide-vue-next";
import { ref } from "vue";
import { useRoute } from "vue-router";
import { toast } from "vue-sonner";
import { z } from "zod";

const emit = defineEmits(["refresh"]);
const { params } = useRoute();

const { data, execute, isLoading } = useAxios("", useGuardedAxiosInstance(), {
  immediate: false,
});
const dialogState = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1),
  }),
);

async function handleCreateBlock(values: any) {
  try {
    const { user } = useAuthenticationStore();
    const body = {
      ...values,
      propertyId: Number(params.id),
      createdBy: `${user?.data.firstName} ${user?.data.lastName}`,
      createdOn: useDateFormat(now(), "YYYY-MM-DD").value,
    };
    await execute("/blocks", { method: "POST", data: body });
    toast.success(data.value.message);
    dialogState.value = false;
    emit("refresh");
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
}
</script>

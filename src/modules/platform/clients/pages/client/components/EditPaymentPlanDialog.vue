<template>
  <Form
    keep-values
    v-slot="{ handleSubmit }"
    :validation-schema="formSchema"
    as=""
  >
    <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
      <DialogTrigger as-child>
        <Button variant="info" size="icon"> <Pencil /></Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            ><Pencil
              class="bg-info/10 text-info dark:bg-info h-8 w-8 rounded-md p-2 dark:text-white"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="text-primary mb-2 text-lg font-semibold">
              Edit Payment Plan
            </h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="edit-payment-plan-form"
          class="grid grid-cols-2 gap-2"
          @submit="handleSubmit($event, handleUpdatePaymentPlan)"
        >
          <FormField v-slot="{ componentField }" name="discount">
            <FormItem>
              <FormLabel>Discount</FormLabel>
              <FormControl>
                <div class="relative flex items-center">
                  <Input
                    class="pl-6"
                    type="number"
                    step=".01"
                    placeholder="0.00"
                    v-bind="componentField"
                  />
                  <span class="absolute pl-3"> ₱ </span>
                </div>
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="penalty">
            <FormItem>
              <FormLabel>Penalty</FormLabel>
              <FormControl>
                <div class="relative flex items-center">
                  <Input
                    class="pl-6"
                    type="number"
                    step=".01"
                    placeholder="0.00"
                    v-bind="componentField"
                  />
                  <span class="absolute pl-3"> ₱ </span>
                </div>
              </FormControl>
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
            form="edit-payment-plan-form"
            :disabled="isLoading"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? "Updating payment plan record..." : "Confirm" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>

<script setup lang="ts">
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
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useGuardedAxiosInstance } from "@/lib/axios";
import { toTypedSchema } from "@vee-validate/zod";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { AxiosError } from "axios";
import { Loader2, Pencil } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";

type EditPaymentPlanDialog = {
  paymentPlanId: number;
  discount: number;
  penalty: number;
};

const {
  paymentPlanId,
  discount = 0,
  penalty = 0,
} = defineProps<EditPaymentPlanDialog>();

const emit = defineEmits(["refresh"]);

const { data, execute, isLoading } = useAxios("", useGuardedAxiosInstance(), {
  immediate: false,
});
const dialogState = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    discount: z
      .number()
      .min(0.01, { message: "Please enter a price that is more than 0" })
      .multipleOf(0.01, {
        message: "Please enter a price with a decimal point of at most 2",
      })
      .optional()
      .default(discount),
    penalty: z
      .number()
      .min(0.01, { message: "Please enter a price that is more than 0" })
      .multipleOf(0.01, {
        message: "Please enter a price with a decimal point of at most 2",
      })
      .optional()
      .default(penalty),
  }),
);

async function handleUpdatePaymentPlan(values: any) {
  try {
    const body = {
      ...values,
    };
    await execute(`/payment-plan/${paymentPlanId}`, {
      method: "PUT",
      data: body,
    });
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

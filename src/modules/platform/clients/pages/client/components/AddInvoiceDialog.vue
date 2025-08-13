<template>
  <Form
    v-slot="{ handleSubmit, values, setFieldValue }"
    :validation-schema="formSchema"
    as=""
  >
    <Dialog
      modal
      :open="dialogState"
      @update:open="(state) => (dialogState = state)"
    >
      <DialogTrigger as-child>
        <Button variant="info"> <Plus /> Add Invoice </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            ><Plus
              class="bg-info/10 text-info dark:bg-info h-8 w-8 rounded-md p-2 dark:text-white"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="text-primary mb-2 text-lg font-semibold">Add Invoice</h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="add-invoice-form"
          class="grid grid-cols-2 gap-2"
          @submit="handleSubmit($event, handleCreateUploadReceipt)"
        >
          <FormField v-slot="{ componentField }" name="purpose">
            <FormItem>
              <FormLabel>Purpose *</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a purpose" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="purpose in purposes"
                      :key="purpose"
                      :value="purpose"
                    >
                      {{ purpose }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="payment">
            <FormItem>
              <FormLabel>Payment *</FormLabel>
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
          <FormField v-slot="{ componentField }" name="modeOfPayment">
            <FormItem>
              <FormLabel>Mode Of Payment *</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a mode of payment" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="mode in modeOfPayment"
                      :key="mode"
                      :value="mode"
                    >
                      {{ mode }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          </FormField>
          <FormField name="dateOfPayment">
            <FormItem>
              <FormLabel>Date of Payment *</FormLabel>
              <FormControl>
                <AdvancedCalendar
                  @update:model-value="
                    (v: any) => {
                      if (v) {
                        setFieldValue(
                          'dateOfPayment',
                          `${v.year}-${v.month}-${v.day}`,
                        );
                      }
                    }
                  "
                >
                  <Button
                    variant="outline"
                    type="button"
                    :class="
                      cn(
                        'w-full ps-3 text-start font-normal',
                        !values.dateOfPayment && 'text-muted-foreground',
                      )
                    "
                  >
                    <span>{{
                      values.dateOfPayment
                        ? values.dateOfPayment
                        : "Pick a date"
                    }}</span>
                    <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                  </Button>
                </AdvancedCalendar>
              </FormControl>
            </FormItem>
          </FormField>
          <FormField name="receipt">
            <FormItem class="col-span-2">
              <FormLabel>Receipt *</FormLabel>
              <FormControl>
                <Card
                  class="flex h-[150px] cursor-pointer flex-col items-center justify-center gap-1 p-4"
                  @click="
                    () => {
                      open();
                      onChange((file) => {
                        if (file) {
                          setFieldValue('receipt', file[0]);
                        }
                      });
                    }
                  "
                >
                  <CloudUpload
                    class="h-8 w-8 rounded-full bg-blue-50 p-2 text-blue-500"
                  />
                  <template v-if="!values.receipt">
                    <p class="text-xs">
                      <span class="text-blue-500">Click to upload</span>
                      (5mb)
                    </p>
                    <p class="text-xs">PNG, JPG, JPEG files only</p>
                  </template>
                  <template v-else>
                    <p class="text-xs">
                      <span class="text-blue-500">To upload:</span>
                      {{ values.receipt.name }}
                    </p>
                  </template>
                </Card>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="remarks">
            <FormItem class="col-span-2">
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Textarea
                  class="resize-none"
                  placeholder="Enter a comment"
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
            form="add-invoice-form"
            :disabled="isCreateInvoiceLoading || isUploadReceiptLoading"
          >
            <Loader2
              v-if="isCreateInvoiceLoading || isUploadReceiptLoading"
              class="mr-2 h-4 w-4 animate-spin"
            />
            <template v-if="isUploadReceiptLoading"
              >Uploading receipt...</template
            >
            <template v-else-if="isCreateInvoiceLoading"
              >Creating invoice record...</template
            >
            <template v-else>Confirm</template>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>

<script setup lang="ts">
import { AdvancedCalendar } from "@/components/custom/advanced-calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useGuardedAxiosInstance } from "@/lib/axios";
import { useAuthenticationStore } from "@/authentication/authentication.store";
import { toTypedSchema } from "@vee-validate/zod";
import { now, useDateFormat, useFileDialog } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { AxiosError } from "axios";
import { Plus, Loader2, CloudUpload, CalendarIcon } from "lucide-vue-next";
import { inject, ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useEnv } from "@/lib/env";
import { Input } from "@/components/ui/input";

const clientLotId = inject("clientLotId");

const emit = defineEmits(["refresh"]);

const { open, onChange } = useFileDialog({
  accept: "image/*",
});

const {
  data,
  execute: createInvoice,
  isLoading: isCreateInvoiceLoading,
} = useAxios("", useGuardedAxiosInstance(), {
  immediate: false,
});
const {
  data: newReceipt,
  execute: uploadReceipt,
  isLoading: isUploadReceiptLoading,
} = useAxios(
  "",
  {},
  {
    immediate: false,
  },
);
const dialogState = ref<boolean>(false);

const purposes = ref<string[]>([
  "Full Payment",
  "Downpayment",
  "Payment Plan",
  "Interment",
  "Perpetual Care",
  "Reservation",
]);

const modeOfPayment = ref<string[]>([
  "Bank Transfer",
  "Cash Payment",
  "Check Payment",
]);

const formSchema = toTypedSchema(
  z.object({
    purpose: z.enum([
      "Full Payment",
      "Downpayment",
      "Payment Plan",
      "Interment",
      "Perpetual Care",
      "Reservation",
    ]),
    payment: z.number().multipleOf(0.01).optional().default(0),
    modeOfPayment: z.enum(["Bank Transfer", "Cash Payment", "Check Payment"]),
    dateOfPayment: z.string(),
    receipt: z.instanceof(File, { message: "Please upload a receipt" }),
    remarks: z.string().optional(),
  }),
);

async function handleUploadReceipt(receipt: File) {
  try {
    const { env } = useEnv();
    const formData = new FormData();
    formData.append("api_key", env.VITE_CLOUDINARY_API_KEY);
    formData.append("file", receipt);
    formData.append("upload_preset", env.VITE_CLOUDINARY_UPLOAD_PRESET);
    await uploadReceipt(
      `https://api.cloudinary.com/v1_1/${env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        data: formData,
      },
    );
  } catch (error) {
    toast.error("Something went wrong with uploading the receipt...");
    console.log(error);
  }
}

async function handleCreateUploadReceipt(values: any) {
  try {
    await handleUploadReceipt(values.receipt);

    const { user } = useAuthenticationStore();
    const createdBy = `${user?.data.firstName} ${user?.data.lastName}`;
    const createdOn = useDateFormat(now(), "YYYY-MM-DD").value;

    const body = {
      ...values,
      clientLotId,
      receipt: newReceipt.value.public_id,
      createdBy,
      createdOn,
    };
    await createInvoice(`/client-lots/${clientLotId}/invoices`, {
      method: "POST",
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

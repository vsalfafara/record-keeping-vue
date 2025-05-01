<template>
  <Form
    v-slot="{ handleSubmit, setFieldValue, values }"
    :validation-schema="formSchema"
    as=""
  >
    <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
      <DialogTrigger as-child>
        <Button variant="info"> <Plus /> Add Lot </Button>
      </DialogTrigger>
      <DialogScrollContent>
        <DialogHeader>
          <DialogTitle
            ><Plus
              class="bg-info/10 text-info dark:bg-info h-8 w-8 rounded-md p-2 dark:text-white"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="text-primary mb-2 text-lg font-semibold">Add Lot</h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="add-client-lot-form"
          class="grid grid-cols-2 gap-4"
          @submit="handleSubmit($event, handleCreateClientLot)"
        >
          <FormField v-slot="{ componentField }" name="propertyId">
            <FormItem class="col-span-2">
              <FormLabel>Property Name *</FormLabel>
              <Select
                v-bind="componentField"
                @update:model-value="
                  async (v) => {
                    blocks = null;
                    lots = null;
                    setFieldValue('blockId', null, false);
                    setFieldValue('lotId', null, false);
                    await getBlocks(`/properties/${v}/blocks/list`);
                    if (!blocks.length) {
                      toast.error('No available blocks');
                    }
                  }
                "
              >
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a property" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="property in properties"
                      :key="property.id"
                      :value="property.id.toString()"
                    >
                      {{ property.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="blockId">
            <FormItem>
              <FormLabel>Block *</FormLabel>
              <Skeleton v-if="isBlocksLoading" class="h-9 w-full" />
              <Select
                v-else
                v-bind="componentField"
                :disabled="!blocks?.length"
                @update:model-value="
                  async (v) => {
                    lots = null;
                    setFieldValue('lotId', null, false);
                    await getLots(`/blocks/${v}/lots/not-taken`);
                    if (!lots.length) {
                      toast.error('No available lots');
                    }
                  }
                "
              >
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a block" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="block in blocks"
                      :key="block.id"
                      :value="block.id.toString()"
                    >
                      {{ block.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="lotId">
            <FormItem>
              <FormLabel>Lot No. *</FormLabel>
              <Skeleton v-if="isLotsLoading" class="h-9 w-full" />
              <Select v-else v-bind="componentField" :disabled="!lots?.length">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select a lot" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem
                      v-for="lot in lots"
                      :key="lot.id"
                      :value="lot.id.toString()"
                    >
                      {{ lot.name }}
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField
            v-if="values.lotId"
            v-slot="{ componentField }"
            name="paymentType"
          >
            <FormItem class="col-span-2">
              <FormLabel>Select Payment Type *</FormLabel>
              <FormControl>
                <RadioGroup
                  v-bind="componentField"
                  :orientation="'vertical'"
                  @update:model-value="
                    () => {
                      const lot = lots.find(
                        (lot: any) => lot.id === Number(values.lotId),
                      );
                      if (lot) {
                        setFieldValue('lotPrice', lot.price);
                        setFieldValue('actualPrice', lot.price);
                      }
                      setFieldValue('downpaymentPrice', 0);
                      setFieldValue('monthly', 0);
                      setFieldValue('totalInterest', 0);
                      setFieldValue('downpayment', undefined, false);
                      setFieldValue('terms', undefined, false);
                    }
                  "
                >
                  <div
                    v-for="paymentType in paymentTypes"
                    :key="paymentType"
                    class="flex items-center space-x-2"
                  >
                    <RadioGroupItem :id="paymentType" :value="paymentType" />
                    <Label :for="paymentType">{{ paymentType }}</Label>
                  </div>
                </RadioGroup>
              </FormControl>
            </FormItem>
          </FormField>
          <template v-if="values.paymentType === 'Reservation'">
            Reservation
          </template>
          <template v-else-if="values.paymentType === 'Monthly Terms'">
            <FormField v-slot="{ componentField }" name="paymentPlan">
              <FormItem class="col-span-2">
                <FormLabel>Select Payment Plan* </FormLabel>
                <FormControl>
                  <RadioGroup
                    v-bind="componentField"
                    default-value="Reservation"
                    :orientation="'vertical'"
                  >
                    <div
                      v-for="paymentPlan in paymentPlans"
                      :key="paymentPlan"
                      class="flex items-center space-x-2"
                    >
                      <RadioGroupItem :id="paymentPlan" :value="paymentPlan" />
                      <Label :for="paymentPlan">{{ paymentPlan }}</Label>
                    </div>
                  </RadioGroup>
                </FormControl>
              </FormItem>
            </FormField>
            <template
              v-if="
                values.paymentPlan ===
                'Downpayment and Installment (with interest)'
              "
            >
              <FormField v-slot="{ componentField }" name="downpayment">
                <FormItem>
                  <FormLabel>Downpayment *</FormLabel>
                  <Select
                    v-bind="componentField"
                    @update:model-value="
                      () => {
                        computeForDownpayment(values, setFieldValue);
                        if (values.terms)
                          computeForMonthly(values, setFieldValue);
                      }
                    "
                  >
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Select a percentage" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          v-for="down in downpaymentWithInterest"
                          :key="down"
                          :value="down.toString()"
                        >
                          {{ down === 0 ? "Manual" : `${down * 100}%` }}
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="terms">
                <FormItem>
                  <FormLabel>Terms *</FormLabel>
                  <Select
                    v-bind="componentField"
                    :disabled="!values.downpayment"
                    @update:model-value="
                      () => computeForMonthly(values, setFieldValue)
                    "
                  >
                    <FormControl>
                      <SelectTrigger class="w-full">
                        <SelectValue placeholder="Select a term" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem
                          v-for="term in terms"
                          :key="term"
                          :value="term.toString()"
                        >
                          {{ term }} Months
                        </SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="downpaymentPrice">
                <FormItem>
                  <FormLabel>Downpayment Price</FormLabel>
                  <FormControl>
                    <div class="relative flex items-center">
                      <Input
                        class="pl-6"
                        type="number"
                        :placeholder="values.downpaymentPrice"
                        v-bind="componentField"
                        :disabled="values.downpayment > 0 || !values.terms"
                        @update:model-value="
                          () => computeForMonthly(values, setFieldValue)
                        "
                      />
                      <span class="absolute pl-3"> ₱ </span>
                    </div>
                  </FormControl>
                </FormItem>
              </FormField>

              <FormField v-slot="{ componentField }" name="discount">
                <FormItem>
                  <FormLabel>Discount</FormLabel>
                  <FormControl>
                    <div class="relative flex items-center">
                      <Input
                        class="pl-6"
                        type="number"
                        placeholder="0.00"
                        default-value="0"
                        v-bind="componentField"
                        @update:model-value="
                          () => {
                            computeForMonthly(values, setFieldValue);
                            computeForDownpayment(values, setFieldValue);
                          }
                        "
                      />
                      <span class="absolute pl-3"> ₱ </span>
                    </div>
                  </FormControl>
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="monthly">
                <FormItem>
                  <FormLabel>Monthly</FormLabel>
                  <FormControl>
                    <div class="relative flex items-center">
                      <Input
                        class="pl-6"
                        type="number"
                        :placeholder="values.monthly"
                        v-bind="componentField"
                        disabled
                      />
                      <span class="absolute pl-3"> ₱ </span>
                    </div>
                  </FormControl>
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="totalInterest">
                <FormItem>
                  <FormLabel> Total Interest </FormLabel>
                  <FormControl>
                    <div class="relative flex items-center">
                      <Input
                        class="pl-6"
                        type="number"
                        :placeholder="values.totalInterest"
                        v-bind="componentField"
                        disabled
                      />
                      <span class="absolute pl-3"> ₱ </span>
                    </div>
                  </FormControl>
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="lotPrice">
                <FormItem>
                  <FormLabel>Lot Price</FormLabel>
                  <FormControl>
                    <div class="relative flex items-center">
                      <Input
                        class="pl-6"
                        type="number"
                        :placeholder="values.lotPrice"
                        v-bind="componentField"
                        disabled
                      />
                      <span class="absolute pl-3"> ₱ </span>
                    </div>
                  </FormControl>
                </FormItem>
              </FormField>
              <FormField v-slot="{ componentField }" name="actualPrice">
                <FormItem>
                  <FormLabel>Actual Price</FormLabel>
                  <FormControl>
                    <div class="relative flex items-center">
                      <Input
                        class="pl-6"
                        type="number"
                        :placeholder="values.actualPrice"
                        v-bind="componentField"
                        disabled
                      />
                      <span class="absolute pl-3"> ₱ </span>
                    </div>
                  </FormControl>
                </FormItem>
              </FormField>
            </template>
          </template>
          <template v-else-if="values.paymentType === 'Full Payment'">
            Full Payment
          </template>
          <template
            v-if="
              values.paymentType === 'Reservation' ||
              (values.paymentType === 'Monthly Terms' && values.paymentPlan) ||
              (values.paymentType === 'Full Payment' && values.inNeed)
            "
          >
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
          </template>
        </form>
        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline"> Cancel </Button>
          </DialogClose>
          <Button variant="info" type="submit" form="add-client-lot-form">
            Confirm
          </Button>
        </DialogFooter>
      </DialogScrollContent>
    </Dialog>
  </Form>
</template>

<script setup lang="ts">
import { useAuthenticationStore } from "@/authentication/authentication.store";
import { AdvancedCalendar } from "@/components/custom/advanced-calendar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogScrollContent,
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
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useGuardedAxiosInstance } from "@/lib/axios";
import { toTypedSchema } from "@vee-validate/zod";
import { now, useDateFormat, useFileDialog } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { AxiosError } from "axios";
import { Plus, Loader2, CalendarIcon, CloudUpload } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";
import { cn } from "@/lib/utils";
import { useEnv } from "@/lib/env";

const emit = defineEmits(["refresh"]);

const { open, onChange } = useFileDialog({
  accept: "image/*",
});

const { data: properties } = useAxios(
  "/properties/list",
  useGuardedAxiosInstance(),
);

const {
  data: blocks,
  execute: getBlocks,
  isLoading: isBlocksLoading,
} = useAxios("", useGuardedAxiosInstance(), {
  immediate: false,
});

const {
  data: lots,
  execute: getLots,
  isLoading: isLotsLoading,
} = useAxios("", useGuardedAxiosInstance(), {
  immediate: false,
});

const dialogState = ref<boolean>(false);

const withInterestFactors = {
  12: 0.091684,
  24: 0.049934,
  36: 0.036152,
  48: 0.029375,
  60: 0.025393,
};
const withoutInterestTerms = {
  0.3: "4",
  0.4: "6",
  0.5: "8",
  0.6: "10",
  0.7: "12",
  0.8: "3",
};

const paymentTypes = ref<string[]>([
  "Reservation",
  "Monthly Terms",
  "Full Payment",
]);

const paymentPlans = ref<string[]>([
  "Downpayment and Installment (with interest)",
  "Downpayment and Installment (without interest)",
  "Installment only (with interest)",
]);

const terms = ref<number[]>([12, 24, 36, 48, 60]);

const downpaymentWithInterest = ref<number[]>([0, 0.1, 0.2, 0.3, 0.4, 0.5]);
const downpaymentWithoutInterest = ref<number[]>([
  0.3, 0.4, 0.5, 0.6, 0.7, 0.8,
]);

const modeOfPayment = ref<string[]>([
  "Bank Transfer",
  "Cash Payment",
  "Check Payment",
]);

const baseSchema = z.object({
  propertyId: z.string().min(1),
  blockId: z.string().min(1),
  lotId: z.string().min(1),
  paymentType: z.enum(["Reservation", "Monthly Terms", "Full Payment"]),
  lotPrice: z.number().multipleOf(0.01),
  modeOfPayment: z.enum(["Bank Transfer", "Cash Payment", "Check Payment"]),
  dateOfPayment: z.string(),
  receipt: z.instanceof(File, { message: "Please upload a receipt" }),
  discount: z.number().min(0).multipleOf(0.01).optional().or(z.literal(0)),
  actualPrice: z.number().multipleOf(0.01),
  remarks: z.string().optional(),
});

const reservationSchema = z.object({
  paymentType: z.literal("Reservation"),
  reservation: z.number(),
  discount: z
    .number({ message: "Please enter an amount" })
    .min(0)
    .multipleOf(0.01)
    .optional()
    .or(z.literal(0))
    .optional(),
  actualPrice: z.number().multipleOf(0.01).optional(),
});

const monthlyTermsSchema = z.object({
  paymentType: z.literal("Monthly Terms"),
  paymentPlan: z.enum([
    "Downpayment and Installment (with interest)",
    "Downpayment and Installment (without interest)",
    "Installment only (with interest)",
  ]),
  monthly: z.number().multipleOf(0.01).default(0),
});

const downpaymentAndInstallmentWithInterestSchema = z.object({
  paymentPlan: z.literal("Downpayment and Installment (with interest)"),
  downpayment: z
    .enum(["0", "0.1", "0.2", "0.3", "0.4", "0.5"])
    .pipe(z.coerce.number().min(0)),
  downpaymentPrice: z.number().min(1).multipleOf(0.01).default(0),
  terms: z.enum(["12", "24", "36", "48", "60"]).pipe(z.coerce.number()),
});

const downpaymentAndInstallmentWithoutInterestSchema = z.object({
  paymentPlan: z.literal("Downpayment and Installment (without interest)"),
  downpayment: z
    .enum(["0.3", "0.4", "0.5", "0.6", "0.7", "0.8"])
    .pipe(z.coerce.number()),
  downpaymentPrice: z.number().multipleOf(0.01).optional().default(0),
  terms: z.enum(["4", "6", "8", "10", "12", "3"]).pipe(z.coerce.number()),
});

const installmentOnlySchema = z.object({
  paymentPlan: z.literal("Installment only (with interest)"),
  downpaymentPrice: z.number().multipleOf(0.01).optional().default(0),
  terms: z.enum(["12", "24", "36", "48", "60"]).pipe(z.coerce.number()),
});

const monthlyTermsFormSchema = z
  .discriminatedUnion("paymentPlan", [
    downpaymentAndInstallmentWithInterestSchema,
    downpaymentAndInstallmentWithoutInterestSchema,
    installmentOnlySchema,
  ])
  .and(baseSchema);

const fullPaymentSchema = z.object({
  paymentType: z.literal("Full Payment"),
  inNeed: z.enum(["Yes", "No"]),
});

const inNeedSchema = z.object({
  inNeed: z.literal("Yes"),
  inNeedPrice: z.string({ message: "Please select an option" }),
});

const notInNeedSchema = z.object({
  inNeed: z.literal("No"),
  inNeedPrice: z.string({ message: "Please select an option" }).optional(),
});

const inNeedFormSchema = z
  .discriminatedUnion("inNeed", [inNeedSchema, notInNeedSchema])
  .and(baseSchema);

const paymentTypeFormSchema = z
  .discriminatedUnion("paymentType", [
    reservationSchema,
    monthlyTermsSchema,
    fullPaymentSchema,
  ])
  .and(baseSchema);

const formSchema = toTypedSchema(
  z.union([paymentTypeFormSchema, monthlyTermsFormSchema, inNeedFormSchema]),
);

function computeForDownpayment(values: any, setFieldValue: any) {
  const discount = values.discount || 0;
  if (values.downpayment !== 0.0) {
    setFieldValue(
      "downpaymentPrice",
      (values.lotPrice - discount) * values.downpayment,
    );
  }
  if (values.monthly) computeForMonthly(values, setFieldValue);
  if (values.paymentPlan === "Downpayment and Installment (without interest)")
    setFieldValue(
      "terms",
      withoutInterestTerms[
        values.downpayment as keyof typeof withoutInterestTerms
      ],
    );
}

function computeForMonthly(values: any, setFieldValue: any) {
  const discount = values.discount || 0;
  const downpaymentPrice = values.downpaymentPrice || 0;
  const monthly =
    values.paymentPlan !== "Downpayment and Installment (without interest)"
      ? Number(
          (
            (values.lotPrice - discount - downpaymentPrice) *
            withInterestFactors[
              values.terms as keyof typeof withInterestFactors
            ]
          ).toFixed(2),
        )
      : Number(
          (
            (values.lotPrice - discount - downpaymentPrice) /
            Number(
              withoutInterestTerms[
                values.downpayment as keyof typeof withoutInterestTerms
              ],
            )
          ).toFixed(2),
        );
  setFieldValue("monthly", monthly);
  if (values.paymentPlan !== "Downpayment and Installment (without interest)")
    computeForTotalInterest(values, setFieldValue);
  else computeForActualPrice(values, setFieldValue);
}

function computeForTotalInterest(values: any, setFieldValue: any) {
  const discount = values.discount || 0;
  const totalPrice = values.monthly * values.terms;
  const downpaymentPrice = values.downpaymentPrice || 0;
  const totalInterest =
    totalPrice + downpaymentPrice - (values.lotPrice - discount);
  setFieldValue("totalInterest", Number(totalInterest.toFixed(2)));
  computeForActualPrice(values, setFieldValue);
}

function computeForActualPrice(values: any, setFieldValue: any) {
  const discount = values.discount || 0;
  const totalInterest = values.totalInterest || 0;
  const actualPrice = Number(
    (values.lotPrice - discount + totalInterest).toFixed(2),
  );
  setFieldValue("actualPrice", actualPrice);
}

function getLotInfo(values: any) {
  const {
    firstName,
    lastName,
    fullAddress,
    birthDate,
    email,
    mobileNumber,
    landlineNumber,
    dateOfPayment,
    receipt,
    ...lot
  } = values;
  return lot;
}

async function handleUploadReceipt(receipt: File) {
  // try {
  //   const { env } = useEnv()
  //   const formData = new FormData();
  //   formData.append("api_key", env.VITE_CLOUDINARY_API_KEY);
  //   formData.append("file", receipt);
  //   formData.append("upload_preset", env.VITE_CLOUDINARY_UPLOAD_PRESET);
  //   const response: any = await $fetch(
  //     `https://api.cloudinary.com/v1_1/${config.public.cloudinary.cloudName}/image/upload`,
  //     {
  //       method: "POST",
  //       body: formData,
  //     }
  //   );
  //   return response.public_id;
  // } catch (error) {
  //   console.log(error);
  // }
}

async function handleCreateClientLot(values: any) {
  console.log(values);
  // try {
  //   const { user } = useAuthenticationStore();
  //   const body = {
  //     ...values,
  //     createdBy: `${user?.data.firstName} ${user?.data.lastName}`,
  //     createdOn: useDateFormat(now(), "YYYY-MM-DD").value,
  //   };
  //   await execute({ method: "POST", data: body });
  //   toast.success(data.value.message);
  //   dialogState.value = false;
  //   emit("refresh");
  // } catch (error: unknown) {
  //   if (error instanceof AxiosError) {
  //     throw new Error(error.response?.data.message);
  //   }
  // }
}
</script>

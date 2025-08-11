<template>
  <div>
    <SheetHeader class="px-0">
      <SheetTitle>
        <Pencil
          class="bg-info/10 text-info dark:bg-info h-8 w-8 rounded-md p-2 dark:text-white"
        />
      </SheetTitle>
      <SheetDescription>
        <Skeleton v-if="isLoading" class="h-4 w-40" />
        <p v-else class="text-lg font-semibold">
          {{ data.property.name }} | {{ data.block.name }} | {{ data.lot.name }}
        </p>
      </SheetDescription>
    </SheetHeader>
    <Form v-slot="{ handleSubmit }">
      <div class="grid grid-cols-6 gap-2">
        <FormField name="propertyName">
          <FormItem>
            <FormLabel>Property Name</FormLabel>
            <FormControl>
              <Input type="text" :value="data?.property.name" disabled />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="blockName">
          <FormItem>
            <FormLabel>Block Name</FormLabel>
            <FormControl>
              <Input type="text" :value="data?.block.name" disabled />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="lotName">
          <FormItem>
            <FormLabel>Lot Name</FormLabel>
            <FormControl>
              <Input type="text" :value="data?.lot.name" disabled />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="reservation">
          <FormItem>
            <FormLabel>Reservation</FormLabel>
            <FormControl>
              <div class="relative flex items-center">
                <Input
                  class="pl-6"
                  type="number"
                  :value="data?.reservation"
                  disabled
                />
                <span v-if="data?.reservation" class="absolute pl-3"> ₱ </span>
              </div>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="paymentType">
          <FormItem>
            <FormLabel>Payment Type</FormLabel>
            <FormControl>
              <Input type="text" :value="data?.paymentType" disabled />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="paymentPlan">
          <FormItem>
            <FormLabel>Payment Plan</FormLabel>
            <FormControl>
              <Input type="text" :value="data?.paymentPlan" disabled />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="inNeed">
          <FormItem>
            <FormLabel>In need</FormLabel>
            <FormControl>
              <Input type="text" :value="data?.inNeed" disabled />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="terms">
          <FormItem>
            <FormLabel>Terms</FormLabel>
            <FormControl>
              <Input type="text" :value="data?.terms" disabled />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="downpayment">
          <FormItem>
            <FormLabel>Downpayment</FormLabel>
            <FormControl>
              <div class="relative flex items-center">
                <Input
                  class="pl-6"
                  type="number"
                  :value="data?.downpaymentPrice"
                  disabled
                />
                <span v-if="data?.downpaymentPrice" class="absolute pl-3">
                  ₱
                </span>
              </div>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="discount">
          <FormItem>
            <FormLabel>Discount</FormLabel>
            <FormControl>
              <div class="relative flex items-center">
                <Input
                  class="pl-6"
                  type="number"
                  :value="data?.discount"
                  disabled
                />
                <span v-if="data?.discount" class="absolute pl-3"> ₱ </span>
              </div>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="monthsToPay">
          <FormItem>
            <FormLabel>Months To Pay</FormLabel>
            <FormControl>
              <Input type="text" :value="data?.monthsToPay" disabled />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="monthly">
          <FormItem>
            <FormLabel>Monthly</FormLabel>
            <FormControl>
              <div class="relative flex items-center">
                <Input
                  class="pl-6"
                  type="number"
                  :value="data?.monthly"
                  disabled
                />
                <span v-if="data?.monthly" class="absolute pl-3"> ₱ </span>
              </div>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="totalInterest">
          <FormItem>
            <FormLabel>Total Interest</FormLabel>
            <FormControl>
              <div class="relative flex items-center">
                <Input
                  class="pl-6"
                  type="number"
                  :value="data?.totalInterest"
                  disabled
                />
                <span v-if="data?.totalInterest" class="absolute pl-3">
                  ₱
                </span>
              </div>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="lotPrice">
          <FormItem>
            <FormLabel>Lot Price</FormLabel>
            <FormControl>
              <div class="relative flex items-center">
                <Input
                  class="pl-6"
                  type="number"
                  :value="data?.lot.price"
                  disabled
                />
                <span v-if="data?.lot.price" class="absolute pl-3"> ₱ </span>
              </div>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="actualPrice">
          <FormItem>
            <FormLabel>Actual Price</FormLabel>
            <FormControl>
              <div class="relative flex items-center">
                <Input
                  class="pl-6"
                  type="number"
                  :value="data?.actualPrice"
                  disabled
                />
                <span v-if="data?.actualPrice" class="absolute pl-3"> ₱ </span>
              </div>
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="agent">
          <FormItem>
            <FormLabel>Agent</FormLabel>
            <FormControl>
              <Input type="text" :value="data?.agent" disabled />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="createdBy">
          <FormItem>
            <FormLabel>Created By</FormLabel>
            <FormControl>
              <Input type="text" :value="data?.createdBy" disabled />
            </FormControl>
          </FormItem>
        </FormField>
        <FormField name="createdOn">
          <FormItem>
            <FormLabel>Created On</FormLabel>
            <FormControl>
              <Input type="text" :value="data?.createdOn" disabled />
            </FormControl>
          </FormItem>
        </FormField>
      </div>
    </Form>
  </div>
</template>

<script setup lang="ts">
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { useGuardedAxiosInstance } from "@/lib/axios";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { Pencil } from "lucide-vue-next";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { inject } from "vue";

const clientLotId = inject("clientLotId");

const { data, execute, isLoading } = useAxios(
  `/client-lots/${clientLotId}`,
  useGuardedAxiosInstance(),
);

const formSchema = toTypedSchema(z.object({}));

const form = useForm({});

async function handleUpdateClientLot() {}
</script>

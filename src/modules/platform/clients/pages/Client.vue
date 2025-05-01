<template>
  <div class="grid gap-4">
    <div class="grid gap-y-4">
      <h1 class="text-3xl font-semibold">
        <Skeleton v-if="!data?.firstName || !data?.lastName" class="h-9 w-52" />
        <template v-else>{{ `${data.firstName} ${data.lastName}` }}</template>
      </h1>
      <p class="text-muted-foreground text-sm">
        Below are the details of the client and their payment records
      </p>
    </div>
    <form @submit="handleUpdateClient">
      <Card>
        <CardHeader>
          <CardTitle>
            <div class="flex justify-between">
              <p class="text-info">Client Information</p>
              <Button variant="info" type="submit" :disabled="isLoading">
                <Loader2 v-if="isLoading" class="animate-spin" />
                {{ isLoading ? "Saving Changes..." : "Save Changes" }}
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div class="grid grid-cols-5 items-start gap-4">
            <FormField v-slot="{ componentField }" name="firstName">
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Skeleton v-if="isLoading" class="h-9" />
                  <Input v-else type="string" v-bind="componentField" />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="fullAddress">
              <FormItem class="row-span-2">
                <FormLabel>Full Address</FormLabel>
                <FormControl>
                  <Skeleton v-if="isLoading" class="h-[110px]" />
                  <Textarea
                    v-else
                    type="string"
                    class="h-[110px] resize-none"
                    v-bind="componentField"
                  />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField name="birthDate">
              <FormItem>
                <FormLabel>Birth Date</FormLabel>
                <FormControl>
                  <Skeleton v-if="isLoading" class="h-9" />
                  <AdvancedCalendar
                    v-else
                    @update:model-value="
                      (v: any) => {
                        if (v) {
                          form.setFieldValue(
                            'birthDate',
                            `${v.year}-${v.month}-${v.day}`,
                          );
                          console.log(form.values);
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
                          !form.values.birthDate && 'text-muted-foreground',
                        )
                      "
                    >
                      <span>{{
                        form.values.birthDate
                          ? form.values.birthDate
                          : "Pick a date"
                      }}</span>
                      <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                    </Button>
                  </AdvancedCalendar>
                </FormControl>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="mobileNumber">
              <FormItem>
                <FormLabel>Mobile Number</FormLabel>
                <FormControl>
                  <Skeleton v-if="isLoading" class="h-9" />
                  <Input v-else type="string" v-bind="componentField" />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="createdBy">
              <FormItem>
                <FormLabel>Created By</FormLabel>
                <FormControl>
                  <Skeleton v-if="isLoading" class="h-9" />
                  <Input
                    v-else
                    type="string"
                    v-bind="componentField"
                    disabled
                  />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="lastName">
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Skeleton v-if="isLoading" class="h-9" />
                  <Input v-else type="string" v-bind="componentField" />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Skeleton v-if="isLoading" class="h-9" />
                  <Input v-else type="email" v-bind="componentField" />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="landlineNumber">
              <FormItem>
                <FormLabel>Landline Number</FormLabel>
                <FormControl>
                  <Skeleton v-if="isLoading" class="h-9" />
                  <Input v-else v-bind="componentField" />
                </FormControl>
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="createdOn">
              <FormItem>
                <FormLabel>Created On</FormLabel>
                <FormControl>
                  <Skeleton v-if="isLoading" class="h-9" />
                  <Input
                    v-else
                    type="string"
                    v-bind="componentField"
                    :model-value="data?.createdOn"
                    disabled
                  />
                </FormControl>
              </FormItem>
            </FormField>
          </div>
        </CardContent>
      </Card>
    </form>
    <div>
      <p class="text-info">Property Information</p>
      <ClientLots />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useGuardedAxiosInstance } from "@/lib/axios";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useTitle } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { useRoute } from "vue-router";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "vue-sonner";
import { AxiosError } from "axios";
import { Loader2, CalendarIcon } from "lucide-vue-next";
import { watch } from "vue";
import { Textarea } from "@/components/ui/textarea";
import ClientLots from "./components/ClientLots.vue";
import { AdvancedCalendar } from "@/components/custom/advanced-calendar";

const title = useTitle();
const { params } = useRoute();
const { data, execute, isLoading } = useAxios(
  `/clients/${params.id}`,
  useGuardedAxiosInstance(),
);

watch(data, () => {
  title.value = `${data.value.firstName} ${data.value.lastName} | Client`;
  form.resetForm();
  form.setValues({
    ...data.value,
    landlineNumber: data.value?.landlineNumber || "",
  });
});

const formSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    birthDate: z.string().min(1),
    email: z.string().min(1),
    fullAddress: z.string().min(1),
    mobileNumber: z.string().min(1),
    landlineNumber: z.string().optional().default(""),
  }),
);

const form = useForm({
  validationSchema: formSchema,
  initialValues: data.value,
});

const handleUpdateClient = form.handleSubmit(async (values) => {
  try {
    await execute({ method: "PUT", data: values });
    toast.success(data.value.message);
    await execute();
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
});
</script>

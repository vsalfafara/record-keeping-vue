<template>
  <Form
    v-slot="{ handleSubmit, setFieldValue, values }"
    :validation-schema="formSchema"
    as=""
  >
    <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
      <DialogTrigger as-child>
        <Button variant="info"> <Plus /> Add Client </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            ><Plus
              class="bg-info/10 text-info dark:bg-info h-8 w-8 rounded-md p-2 dark:text-white"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="text-primary mb-2 text-lg font-semibold">Add Client</h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="add-client-form"
          class="grid grid-cols-2 gap-4"
          @submit="handleSubmit($event, handleCreateClient)"
        >
          <FormField v-slot="{ componentField }" name="firstName">
            <FormItem>
              <FormLabel>First Name *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input first name"
                  v-bind="componentField"
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="lastName">
            <FormItem>
              <FormLabel>Last Name *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input last name"
                  v-bind="componentField"
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="fullAddress">
            <FormItem class="col-span-2">
              <FormLabel>Full Address *</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Input full address (unit/lot no, street, barangay, city)"
                  v-bind="componentField"
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField name="birthDate">
            <FormItem>
              <FormLabel>Birth Date *</FormLabel>
              <FormControl>
                <AdvancedCalendar
                  @update:model-value="
                    (v: any) => {
                      if (v) {
                        setFieldValue(
                          'birthDate',
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
                        !values.birthDate && 'text-muted-foreground',
                      )
                    "
                  >
                    <span>{{
                      values.birthDate ? values.birthDate : "Pick a date"
                    }}</span>
                    <CalendarIcon class="ms-auto h-4 w-4 opacity-50" />
                  </Button>
                </AdvancedCalendar>
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="email">
            <FormItem>
              <FormLabel>Email Address *</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="sample@gmail.com"
                  v-bind="componentField"
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="mobileNumber">
            <FormItem>
              <FormLabel>Mobile Number *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="09xxxxxxxxx"
                  v-bind="componentField"
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="landlineNumber">
            <FormItem>
              <FormLabel>Landline Number</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="02xxxxxxxx"
                  v-bind="componentField"
                />
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
            form="add-client-form"
            :disabled="isLoading"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? "Creating Client..." : "Confirm" }}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  </Form>
</template>

<script setup lang="ts">
import { cn } from "@/lib/utils";
import { useAuthenticationStore } from "@/authentication/authentication.store";
import { AdvancedCalendar } from "@/components/custom/advanced-calendar";
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
import { Textarea } from "@/components/ui/textarea";
import { useGuardedAxiosInstance } from "@/lib/axios";
import { toTypedSchema } from "@vee-validate/zod";
import { now, useDateFormat } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { AxiosError } from "axios";
import { Plus, Loader2, CalendarIcon } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";

const emit = defineEmits(["refresh"]);

const { data, execute, isLoading } = useAxios(
  "/clients",
  useGuardedAxiosInstance(),
  {
    immediate: false,
  },
);
const dialogState = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    birthDate: z.string().min(1),
    email: z.string().min(1),
    fullAddress: z.string().min(1),
    mobileNumber: z.string().min(1),
    landlineNumber: z.string().optional(),
  }),
);

async function handleCreateClient(values: any) {
  try {
    const { user } = useAuthenticationStore();
    const body = {
      ...values,
      createdBy: `${user?.data.firstName} ${user?.data.lastName}`,
      createdOn: useDateFormat(now(), "YYYY-MM-DD").value,
    };
    await execute({ method: "POST", data: body });
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

<template>
  <Form v-slot="{ handleSubmit }" :validation-schema="formSchema" as="">
    <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
      <DialogTrigger as-child>
        <Button variant="info"> <Plus /> Add User </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            ><Plus class="h-8 w-8 rounded-md bg-blue-50 p-2 text-blue-600"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="mb-2 text-lg font-semibold text-slate-900">Add User</h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="add-user-form"
          class="grid grid-cols-2 gap-2"
          @submit="handleSubmit($event, handleCreateUser)"
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
              <FormMessage />
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
              <FormMessage />
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
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="password">
            <FormItem>
              <FormLabel>Password *</FormLabel>
              <FormControl>
                <div class="relative w-full items-center">
                  <Input :type="passwordFieldType" v-bind="componentField" />
                  <span
                    class="absolute inset-y-0 end-0 flex items-center justify-center px-2"
                  >
                    <EyeClosed
                      type="button"
                      class="h-6 w-6 cursor-pointer p-1"
                      :class="{ hidden: passwordFieldType === 'text' }"
                      @click="passwordFieldType = 'text'"
                    />
                    <Eye
                      type="button"
                      class="h-6 w-6 cursor-pointer p-1"
                      :class="{ hidden: passwordFieldType === 'password' }"
                      @click="passwordFieldType = 'password'"
                    />
                  </span>
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="role">
            <FormItem>
              <FormLabel>Role *</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem class="cursor-pointer" value="ADMIN">
                      Admin
                    </SelectItem>
                    <SelectItem class="cursor-pointer" value="ACCOUNTS_CLERK">
                      Account Clerk
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
        </form>
        <DialogFooter>
          <DialogClose as-child>
            <Button type="button" variant="outline"> Cancel </Button>
          </DialogClose>
          <Button type="submit" form="add-user-form" :disabled="isLoading">
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? "Creating user..." : "Confirm" }}
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGuardedAxiosInstance } from "@/lib/axios";
import { toTypedSchema } from "@vee-validate/zod";
import { now, useDateFormat } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { AxiosError, HttpStatusCode } from "axios";
import { Plus, Loader2, EyeClosed, Eye } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";

const emit = defineEmits(["refresh"]);

const { data, execute, isLoading } = useAxios("", useGuardedAxiosInstance(), {
  immediate: false,
});
const dialogState = ref<boolean>(false);
const passwordFieldType = ref<string>("password");

const formSchema = toTypedSchema(
  z.object({
    firstName: z.string().min(1),
    lastName: z.string().min(1),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be minimum 8 characters" })
      .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, {
        message:
          "Password must have at least 1 letter, at least 1 number, and at least 1 special character",
      }),
    role: z.enum(["ADMIN", "ACCOUNTS_CLERK"]),
  }),
);

async function handleCreateUser(values: any) {
  try {
    const { user } = useAuthenticationStore();
    const body = {
      ...values,
      createdBy: user?.data.firstName,
      createdOn: useDateFormat(now(), "YYYY-MM-DD").value,
    };
    await execute("/users", { method: "POST", data: body });
    toast.success(data.value.message);
    dialogState.value = false;
    emit("refresh");
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      if (error.status === HttpStatusCode.UnprocessableEntity) {
        toast.error(error.response?.data.message);
      }
    }
  }
}
</script>

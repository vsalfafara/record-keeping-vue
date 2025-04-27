<template>
  <Form
    keep-values
    v-slot="{ handleSubmit }"
    :initial-values="user"
    :validation-schema="formSchema"
    as=""
  >
    <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
      <DialogTrigger as-child>
        <Button variant="outline" size="icon"> <Pen /> </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle
            ><Pen
              class="bg-info/10 text-info dark:bg-info h-8 w-8 rounded-md p-2 dark:text-white"
          /></DialogTitle>
          <DialogDescription>
            <h3 class="mb-2 text-lg font-semibold text-slate-900">Edit User</h3>
            <p>Modify the details</p>
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
          <Button
            variant="info"
            type="submit"
            form="add-user-form"
            :disabled="isLoading"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? "Saving changes..." : "Save Changes" }}
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
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { AxiosError } from "axios";
import { Loader2, EyeClosed, Eye, Pen } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";
import type { User } from "../access-management.types";

type EditUserDialogProps = {
  user: User;
};

const { user } = defineProps<EditUserDialogProps>();

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
    email: z.string().min(1).email(),
    password: z
      .string()
      .optional()
      .or(
        z
          .string()
          .min(8, { message: "Password must be minimum 8 characters" })
          .regex(/^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{6,16}$/, {
            message:
              "Password must have at least 1 letter, at least 1 number, and at least 1 special character",
          }),
      ),
    role: z.enum(["ADMIN", "ACCOUNTS_CLERK"]),
  }),
);

async function handleCreateUser(values: any) {
  try {
    const body = {
      ...values,
    };
    await execute(`/users/${user.id}`, { method: "PUT", data: body });
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

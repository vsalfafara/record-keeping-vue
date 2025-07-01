<template>
  <Form v-slot="{ handleSubmit }" :validation-schema="formSchema" as="">
    <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
      <DialogTrigger as-child>
        <Button variant="info"> <Plus />Add Lot</Button>
      </DialogTrigger>
      <DialogContent>
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
          id="add-lot-form"
          class="grid grid-cols-2 gap-2"
          @submit="handleSubmit($event, handleCreateLot)"
        >
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Lot Name *</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input lot name"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem> </FormField
          ><FormField v-slot="{ componentField }" name="lotType">
            <FormItem>
              <FormLabel>Lot Type *</FormLabel>
              <Select v-bind="componentField">
                <FormControl>
                  <SelectTrigger class="w-full">
                    <SelectValue placeholder="Select lot type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem class="cursor-pointer" value="Corner">
                      Corner
                    </SelectItem>
                    <SelectItem class="cursor-pointer" value="Family Estate">
                      Family Estate
                    </SelectItem>
                    <SelectItem class="cursor-pointer" value="Inner">
                      Inner
                    </SelectItem>
                    <SelectItem class="cursor-pointer" value="Pathway">
                      Pathway
                    </SelectItem>
                    <SelectItem class="cursor-pointer" value="Roadside">
                      Roadside
                    </SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="price">
            <FormItem>
              <FormLabel>Price *</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  step=".01"
                  placeholder="Input price"
                  v-bind="componentField"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="remarks">
            <FormItem>
              <FormLabel>Remarks</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Input remark"
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
            form="add-lot-form"
            :disabled="isLoading"
          >
            <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
            {{ isLoading ? "Creating lot..." : "Confirm" }}
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
import { AxiosError } from "axios";
import { Plus, Loader2 } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";

type AddLotDialogProps = {
  blockId: number;
};

const { blockId } = defineProps<AddLotDialogProps>();

const emit = defineEmits(["refresh"]);

const { data, execute, isLoading } = useAxios(
  `/lots`,
  useGuardedAxiosInstance(),
  {
    immediate: false,
  },
);
const dialogState = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1),
    lotType: z.enum([
      "Corner",
      "Family Estate",
      "Inner",
      "Pathway",
      "Roadside",
    ]),
    price: z
      .number()
      .min(0.01, { message: "Please enter a price that is more than 0" })
      .multipleOf(0.01, {
        message: "Please enter a price with a decimal point of at most 2",
      }),
    remarks: z.string().optional(),
  }),
);

async function handleCreateLot(values: any) {
  console.log(values);
  try {
    const { user } = useAuthenticationStore();
    const body = {
      ...values,
      blockId,
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

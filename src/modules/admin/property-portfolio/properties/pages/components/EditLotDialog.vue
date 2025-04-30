<template>
  <Form
    keep-values
    v-slot="{ handleSubmit }"
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
            <h3 class="text-primary mb-2 text-lg font-semibold">Edit Lot</h3>
            <p>Fill out the form</p>
          </DialogDescription>
        </DialogHeader>
        <form
          id="edit-lot-form"
          class="grid grid-cols-2 gap-2"
          @submit="handleSubmit($event, handleUpdateLot)"
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
              <Select v-bind="componentField" :disabled="lot.taken">
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
                  :disabled="lot.taken"
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
            form="edit-lot-form"
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
import { Pen, Loader2 } from "lucide-vue-next";
import { ref } from "vue";
import { toast } from "vue-sonner";
import { z } from "zod";

type EditLotDialogProps = {
  lot: {
    id: number;
    name: string;
    lotType: "Corner" | "Family Estate" | "Inner" | "Pathway" | "Roadside";
    price: number;
    remarks: string;
    taken: boolean;
  };
};

const { lot } = defineProps<EditLotDialogProps>();

const emit = defineEmits(["refresh"]);

const { data, execute, isLoading } = useAxios(
  `/lots/${lot.id}`,
  useGuardedAxiosInstance(),
  {
    immediate: false,
  },
);
const dialogState = ref<boolean>(false);

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1).default(lot.name),
    lotType: z
      .enum(["Corner", "Family Estate", "Inner", "Pathway", "Roadside"])
      .default(lot.lotType),
    price: z
      .number()
      .min(0.01, { message: "Please enter a price that is more than 0" })
      .multipleOf(0.01, {
        message: "Please enter a price with a decimal point of at most 2",
      })
      .default(lot.price),
    remarks: z
      .string()
      .optional()
      .default(lot.remarks || ""),
  }),
);

async function handleUpdateLot(values: any) {
  try {
    const body = {
      ...values,
    };
    await execute({ method: "PUT", data: body });
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

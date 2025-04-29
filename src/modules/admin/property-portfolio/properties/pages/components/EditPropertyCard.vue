<template>
  <form @submit="handleUpdateProperty">
    <Card>
      <CardHeader>
        <CardTitle>
          <div class="flex justify-between">
            <p class="text-info">Property Information</p>
            <Button variant="info" type="submit" :disabled="isLoading">
              <Loader2 v-if="isLoading" class="animate-spin" />
              {{ isLoading ? "Saving Changes..." : "Save Changes" }}
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div class="grid grid-cols-4 gap-4">
          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Skeleton v-if="isLoading" class="h-9" />
                <Input v-else type="string" v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="numberOfBlocks">
            <FormItem>
              <FormLabel>Total # of Blocks</FormLabel>
              <FormControl>
                <Skeleton v-if="isLoading" class="h-9" />
                <Input
                  v-else
                  type="string"
                  v-bind="componentField"
                  :model-value="data?.numberOfBlocks"
                  disabled
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="takenLots">
            <FormItem>
              <FormLabel>Total Taken Lots</FormLabel>
              <FormControl>
                <Skeleton v-if="isLoading" class="h-9" />
                <Input
                  v-else
                  type="string"
                  v-bind="componentField"
                  :model-value="data?.takenLots"
                  disabled
                />
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
                  :model-value="data?.createdBy"
                  disabled
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="fullAddress">
            <FormItem>
              <FormLabel>Full Address</FormLabel>
              <FormControl>
                <Skeleton v-if="isLoading" class="h-9" />
                <Input v-else type="string" v-bind="componentField" />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="numberOfLots">
            <FormItem>
              <FormLabel>Total # of Lots</FormLabel>
              <FormControl>
                <Skeleton v-if="isLoading" class="h-9" />
                <Input
                  v-else
                  type="string"
                  v-bind="componentField"
                  :model-value="data?.numberOfLots"
                  disabled
                />
              </FormControl>
            </FormItem>
          </FormField>
          <FormField v-slot="{ componentField }" name="availableLots">
            <FormItem>
              <FormLabel>Total Available Lots</FormLabel>
              <FormControl>
                <Skeleton v-if="isLoading" class="h-9" />
                <Input
                  v-else
                  type="string"
                  v-bind="componentField"
                  :model-value="data?.availableLots"
                  disabled
                />
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
import { useGuardedAxiosInstance } from "@/lib/axios";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useTitle } from "@vueuse/core";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { computed, watch } from "vue";
import { useRoute } from "vue-router";
import { z } from "zod";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "vue-sonner";
import { AxiosError, HttpStatusCode } from "axios";
import { Loader2 } from "lucide-vue-next";
import { usePropertyStore } from "../property.store";

const emit = defineEmits(["refresh"]);

const title = useTitle();
const { params } = useRoute();
const { getPropertyName, setPropertyName } = usePropertyStore();
const propertyName = computed(() => getPropertyName.value);
const { data, response, execute, isLoading } = useAxios(
  `/properties/${params.id}`,
  useGuardedAxiosInstance(),
);

watch(data, () => {
  if (response.value?.status === HttpStatusCode.Ok) {
    title.value = data.value.name;
    form.setValues(data.value);

    if (!propertyName.value) {
      setPropertyName(data.value.name);
    }
  }
});

const formSchema = toTypedSchema(
  z.object({
    name: z.string().min(1),
    fullAddress: z.string().min(1),
  }),
);

const form = useForm({
  validationSchema: formSchema,
});

const handleUpdateProperty = form.handleSubmit(async (values) => {
  try {
    setPropertyName();
    await execute({ method: "PUT", data: values });
    setPropertyName(values.name);
    toast.success(data.value.message);
    emit("refresh");
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
});
</script>

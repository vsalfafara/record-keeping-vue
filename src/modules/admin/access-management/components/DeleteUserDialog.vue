<template>
  <Dialog :open="dialogState" @update:open="(state) => (dialogState = state)">
    <DialogTrigger as-child>
      <Button variant="outline" size="icon"> <Trash /> </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle
          ><Trash
            class="bg-destructive/10 text-destructive dark:bg-destructive/60 h-8 w-8 rounded-md p-2 dark:text-white"
        /></DialogTitle>
        <DialogDescription>
          <h3 class="text-primary mb-2 text-lg font-semibold">
            Are you sure you want to remove
          </h3>
          <p>
            Once removed, the user will no longer have the credentials to access
            the application.
          </p>
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        <DialogClose as-child>
          <Button type="button" variant="outline"> Cancel </Button>
        </DialogClose>
        <Button
          variant="destructive"
          @click="handleDeleteUser"
          :disabled="isLoading"
        >
          <Loader2 v-if="isLoading" class="mr-2 h-4 w-4 animate-spin" />
          {{ isLoading ? "Deleting user..." : "Confirm" }}
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
</template>

<script setup lang="ts">
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
import { Button } from "@/components/ui/button";
import { Loader2, Trash } from "lucide-vue-next";
import { useAxios } from "@vueuse/integrations/useAxios.mjs";
import { useGuardedAxiosInstance } from "@/lib/axios";
import { toast } from "vue-sonner";
import { AxiosError } from "axios";
import { ref } from "vue";

type DeleteUserDialogProps = {
  id: number;
};

const { id } = defineProps<DeleteUserDialogProps>();
const emit = defineEmits(["refresh"]);

const { data, execute, isLoading } = useAxios("", useGuardedAxiosInstance(), {
  immediate: false,
});
const dialogState = ref<boolean>(false);

async function handleDeleteUser() {
  try {
    await execute(`/users/${id}`, { method: "DELETE" });
    toast.success(data.value?.message);
    emit("refresh");
    dialogState.value = false;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message);
    }
  }
}
</script>

<template>
  <div class="h-screen grid justify-center lg:grid-cols-2">
    <div class="relative hidden bg-muted lg:block">
      <img
        src="./assets/placeholder.svg"
        alt="Image"
        class="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
      />
    </div>
    <div
      class="p-4 w-screen lg:w-full flex flex-col gap-6 justify-center items-center relative"
    >
      <DarkMode class="absolute top-4 right-4" />
      <div class="grid items-center gap-2 text-center">
        <h1 class="text-2xl font-bold">Login to your account</h1>
        <p class="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div class="w-full max-w-xs">
        <Form :validation-schema="formSchema" @submit="handleLogin">
          <div class="grid space-y-4">
            <FormField v-slot="{ componentField }" name="emailAddress">
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input type="email" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" v-bind="componentField" />
                </FormControl>
              </FormItem>
            </FormField>
            <Button>Login</Button>
          </div>
        </Form>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toTypedSchema } from "@vee-validate/zod";
import { z } from "zod";
import { useAuthenticationStore } from "./authentication.store";
import { DarkMode } from "@/components/custom/dark-mode";
import { useRouter } from "vue-router";

const { login } = useAuthenticationStore();
const router = useRouter();

const formSchema = toTypedSchema(
  z.object({
    emailAddress: z
      .string()
      .min(1, { message: "Email address is required" })
      .email(),
    password: z.string(),
  })
);

function handleLogin(values: any) {
  login(values);
  router.replace("/");
}
</script>

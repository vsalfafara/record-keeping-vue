import { useStorage } from "@vueuse/core";
import { defineStore } from "pinia";
import { computed } from "vue";
import type { Credentials } from "./authentication.types";

const serialization = {
  serializer: {
    read: (v: any) => {
      if (v) {
        const decoded = atob(v);
        return JSON.parse(decoded);
      } else return v;
    },
    write: (v: any) => btoa(JSON.stringify(v)),
  },
};

export const useAuthenticationStore = defineStore("authentication", () => {
  const user = useStorage<Credentials | null>(
    "user",
    null,
    localStorage,
    serialization,
  );

  const getUser = computed(() => user);

  const isAuthenticated = computed(() => !!user.value);

  function login(credentials: Credentials) {
    user.value = credentials;
  }

  function logout() {
    user.value = null;
  }

  return { user, getUser, isAuthenticated, login, logout };
});

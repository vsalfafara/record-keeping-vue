import { useAuthenticationStore } from "@/authentication/authentication.store";
import { useEnv } from "@/lib/env";
import axios from "axios";
import { computed } from "vue";

const { env } = useEnv();

export function useAxiosInstance() {
  const axiosInstance = axios.create({
    baseURL: env.VITE_API,
  });
  return axiosInstance;
}

export function useGuardedAxiosInstance() {
  const { getUser } = useAuthenticationStore();
  const user = computed(() => getUser.value);

  const axiosInstance = axios.create({
    baseURL: env.VITE_API,
    headers: {
      Authorization: `Bearer ${user.value?.token}`,
    },
  });

  return axiosInstance;
}

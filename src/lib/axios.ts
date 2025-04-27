import { useAuthenticationStore } from "@/authentication/authentication.store";
import { useEnv } from "@/lib/env";
import axios, { AxiosError } from "axios";
import { computed } from "vue";
import { toast } from "vue-sonner";

const { env } = useEnv();

const axiosInstance = axios.create({
  baseURL: env.VITE_API,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error instanceof AxiosError) {
      toast.error(error.response?.data.message);
      throw new Error(error.response?.data.message);
    }
  },
);

export function useAxiosInstance() {
  return axiosInstance;
}

export function useGuardedAxiosInstance() {
  const { getUser } = useAuthenticationStore();
  const user = computed(() => getUser.value);

  axiosInstance.defaults.headers.Authorization = `Bearer ${user.value?.token}`;

  return axiosInstance;
}

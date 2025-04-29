import { defineStore } from "pinia";
import { computed, ref } from "vue";

export const usePropertyStore = defineStore("property", () => {
  const propertyName = ref<string | undefined>();

  const getPropertyName = computed(() => propertyName);

  function setPropertyName(name: string | undefined = undefined) {
    propertyName.value = name;
  }

  return { propertyName, getPropertyName, setPropertyName };
});

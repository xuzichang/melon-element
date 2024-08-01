import { getCurrentInstance, type ComputedRef, computed } from "vue";

export default function useProp<T>(propName: string): ComputedRef<T | void> {
  const instance = getCurrentInstance();
  if (!instance) {
    throw new Error("useProp must be within a components");
  }
  return computed(() => (instance?.proxy?.$props as any)?.[propName] as T);
}

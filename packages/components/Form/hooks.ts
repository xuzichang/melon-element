import {
  inject,
  type MaybeRef,
  computed,
  unref,
  onMounted,
  watch,
  type WatchStopHandle,
  ref,
  toRef,
  onUnmounted,
} from "vue";
import { useProp, useId } from "@melon-element/hooks";
import { FORM_CTX_KEY, FORM_ITEM_CTX_KEY } from "./constans";
import type { FormItemContext } from "./types";

interface UseFormItemInputCommonProps extends Record<string, any> {
  id?: string;
}
export function useFormItem() {
  const form = inject(FORM_CTX_KEY, void 0);
  const formItem = inject(FORM_ITEM_CTX_KEY, void 0);
  return { form, formItem };
}
export function useFormDisabled(fallback?: MaybeRef<boolean | void>) {
  const disabled = useProp<boolean>("disabled");
  const form = inject(FORM_CTX_KEY, void 0);
  const formItem = inject(FORM_ITEM_CTX_KEY, void 0);
  return computed(
    () =>
      disabled.value ||
      unref(fallback) ||
      form?.disabled ||
      formItem?.disabled ||
      false
  );
}

export function useFormItemInputId(
  props: UseFormItemInputCommonProps,
  formItemContext?: FormItemContext
) {
  let unwatch: WatchStopHandle | void;
  const inputId = ref<string>("");
  onMounted(() => {
    unwatch = watch(
      toRef(() => props.id),
      (id) => {
        const newId = id ?? useId().value;
        if (newId !== inputId.value) {
          inputId.value && formItemContext?.removeInputId(inputId.value);
          formItemContext?.addInputId(newId);
          inputId.value = newId;
        }
      },
      {
        immediate: true,
      }
    );
  });

  onUnmounted(() => {
    unwatch && unwatch();
    inputId.value && formItemContext?.removeInputId(inputId.value);
  });

  return {
    inputId,
  };
}

import {
  type ComponentInternalInstance,
  getCurrentInstance,
  type Ref,
  ref,
} from "vue";
import { isFunction } from "lodash-es";
import useEventListener from "./useEventListener";
interface UseFocusControllerOptions {
  afterFocus?(): void;
  beforeBlur?(event: FocusEvent): boolean | void;
  afterBlur?(): void;
}
export function useFocusController<T extends HTMLElement | { focus(): void }>(
  target: Ref<T | void>,
  { afterFocus, beforeBlur, afterBlur }: UseFocusControllerOptions = {}
) {
  const isFocused = ref(false);
  const instance = getCurrentInstance();
  const { emit } = instance as ComponentInternalInstance;
  const wrapperRef = ref<HTMLElement>();
  const handleFocus = (event: FocusEvent) => {
    if (isFocused.value) return;
    isFocused.value = true;
    emit("focus", event);
    afterFocus?.();
  };
  const handleBlur = (event: FocusEvent) => {
    const cancelBlur = isFunction(beforeBlur) ? beforeBlur(event) : false;
    if (
      cancelBlur ||
      (event.relatedTarget &&
        wrapperRef.value?.contains(event.relatedTarget as Node))
    )
      return;
    isFocused.value = false;
    emit("blur", event);
    afterBlur?.();
  };
  const handleClick = () => {
    target.value?.focus();
  };

  useEventListener(wrapperRef, "click", handleClick);
  return {
    wrapperRef,
    isFocused,
    handleFocus,
    handleBlur,
  };
}
export default useFocusController;

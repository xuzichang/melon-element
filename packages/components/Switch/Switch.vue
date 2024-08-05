<script setup lang="ts">
import { computed, ref, onMounted, watch } from "vue";
import type { SwitchProps, SwitchEmits, SwitchInstance } from "./types";
import { useFormDisabled, useFormItemInputId, useFormItem } from "../Form";
import { debugWarn } from "@melon-element/utils";
defineOptions({ name: "MelonSwitch", inheritAttrs: false });
const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false,
});
const isDisabled = useFormDisabled();
const innerValue = ref(props.modelValue);
const checked = computed(() => innerValue.value === props.activeValue);

const emits = defineEmits<SwitchEmits>();
const inputRef = ref<HTMLInputElement | null>(null);
const { formItem } = useFormItem();
const { inputId } = useFormItemInputId(props, formItem);

const focus: SwitchInstance["focus"] = function () {
  inputRef.value?.focus();
};

function handleChange() {
  if (isDisabled.value) return;
  const newVal = checked.value ? props.inactiveValue : props.activeValue;
  innerValue.value = newVal;
  emits("update:modelValue", newVal);
  emits("change", newVal);
}
onMounted(() => {
  inputRef.value!.checked = checked.value;
});
watch(
  () => props.modelValue,
  (val) => (innerValue.value = val)
);
watch(checked, (val) => {
  inputRef.value!.checked = val;
  formItem?.validate("change").catch((err) => debugWarn(err));
});
defineExpose<SwitchInstance>({
  focus,
  checked,
});
</script>
<template>
  <div
    class="melon-switch"
    :class="{
      [`melon-switch--${size}`]: size,
      'is-disabled': isDisabled,
      'is-checked': checked,
    }"
    @click="handleChange"
  >
    <input
      class="melon-switch__input"
      type="checkbox"
      role="switch"
      ref="inputRef"
      :id="inputId"
      :name="name"
      :disabled="isDisabled"
      :checked="checked"
      @keydown.enter="handleChange"
      @blur="formItem?.validate('blur').catch((err) => debugWarn(err))"
    />
    <div class="melon-switch__core">
      <div class="melon-switch__core-inner">
        <span
          v-if="activeText || inactiveText"
          class="melon-switch__core-inner-text"
        >
          {{ checked ? activeText : inactiveText }}
        </span>
      </div>
      <div class="melon-switch__core-action"></div>
    </div>
  </div>
</template>
<style scoped>
@import "./style.css";
</style>

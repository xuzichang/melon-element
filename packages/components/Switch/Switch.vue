<script setup lang="ts">
// 引入Vue相关函数
import { computed, ref, onMounted, watch } from "vue";
// 引入SwitchProps, SwitchEmits, SwitchInstance类型
import type { SwitchProps, SwitchEmits, SwitchInstance } from "./types";
// 引入useFormDisabled, useFormItemInputId, useFormItem函数
import { useFormDisabled, useFormItemInputId, useFormItem } from "../Form";
// 引入debugWarn函数
import { debugWarn } from "@melon-element/utils";
// 定义组件名称和属性继承
defineOptions({ name: "MelonSwitch", inheritAttrs: false });
// 定义props，并设置默认值
const props = withDefaults(defineProps<SwitchProps>(), {
  activeValue: true,
  inactiveValue: false,
});
// 获取表单禁用状态
const isDisabled = useFormDisabled();
// 定义内部值
const innerValue = ref(props.modelValue);
// 计算是否选中
const checked = computed(() => innerValue.value === props.activeValue);

// 定义emits
const emits = defineEmits<SwitchEmits>();
// 定义inputRef
const inputRef = ref<HTMLInputElement | null>(null);
// 获取表单相关属性
const { formItem } = useFormItem();
// 获取表单输入id
const { inputId } = useFormItemInputId(props, formItem);

// 定义focus函数
const focus: SwitchInstance["focus"] = function () {
  inputRef.value?.focus();
};

// 定义handleChange函数
function handleChange() {
  // 如果禁用，则返回
  if (isDisabled.value) return;
  // 计算新值
  const newVal = checked.value ? props.inactiveValue : props.activeValue;
  // 更新内部值
  innerValue.value = newVal;
  // 触发update:modelValue事件
  emits("update:modelValue", newVal);
  // 触发change事件
  emits("change", newVal);
}
// 组件挂载时，设置inputRef的checked属性
onMounted(() => {
  inputRef.value!.checked = checked.value;
});
// 监听props.modelValue的变化，更新内部值
watch(
  () => props.modelValue,
  (val) => (innerValue.value = val)
);
// 监听checked的变化，更新inputRef的checked属性，并触发表单验证
watch(checked, (val) => {
  inputRef.value!.checked = val;
  formItem?.validate("change").catch((err) => debugWarn(err));
});
// 暴露组件实例
defineExpose<SwitchInstance>({
  focus,
  checked,
});
</script>
<template>
  <!-- 定义组件模板 -->
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

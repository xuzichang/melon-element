<script setup lang="ts">
import type {
  FormInstance,
  FormValidateCallback,
  FormItemContext,
  FormContext,
  FormProps,
  FormEmits,
} from "./types";
import { size, filter, includes, each } from "lodash-es";
import type { ValidateFieldsError } from "async-validator";
import { FORM_CTX_KEY } from "./constans";
import { provide, reactive, toRefs } from "vue";

defineOptions({ name: "MelonForm" });
const props = withDefaults(defineProps<FormProps>(), {
  showMessage: true,
  hideRequiredAsterisk: false,
  requiredAsteriskPosition: "left",
  labelPosition: "right",
});
const emits = defineEmits<FormEmits>();
// 添加表单字段
const addField: FormContext["addField"] = function (field) {
  if (!field.prop) return;
  fields.push(field);
};
// 移除表单字段
const removeField: FormContext["removeField"] = function (field) {
  if (!field.prop) return;
  fields.splice(fields.indexOf(field), 1);
};
// 存储表单字段
const fields: FormItemContext[] = [];
// 验证表单：接受一个可选的回调函数->验证完成会调用callback，callback参数一般是一个错误对象；没有错误为null或undefined
const validate: FormInstance["validate"] = async function (
  callback?: FormValidateCallback
) {
  // 调用validateField方法，传递两个参数，空数组和回调函数。空数组表示验证所有字段
  // 返回validateField方法的结果
  return validateField([], callback);
};
// 执行验证逻辑：接受一个FormItemContext类型数组，返回一个布尔或包含验证错误的Promise
async function doValidateField(fields: FormItemContext[] = []) {
  // 1.初始化验证错误对象：存储所有字段的验证错误信息
  let validationErrors: ValidateFieldsError = {};
  // 2.遍历字段数组
  for (const field of fields) {
    try {
      // 3.异步验证字段：对每个字段调用它的validate方法验证（异步所以会等待验证完成）
      await field.validate("");
    } catch (e) {
      // 4.捕获验证错误
      validationErrors = {
        ...validationErrors,
        ...(e as ValidateFieldsError),
      };
    }
  }
  // 5.检查是否有验证错误，判断validationErrors数组是否为空，空表示所有字段验证通过，返回true
  if (!size(Object.keys(validationErrors))) return true;
  // 6.否则，返回验证结果
  return Promise.reject(validationErrors);
}
// 验证指定字段：接受一个字符串数组和一个可选的回调函数
const validateField: FormInstance["validateField"] = async function (
  keys: string[] = [],
  callback?: FormValidateCallback
) {
  // 1.字段过滤：判断参数数组是否为空，空直接用fields，否则筛选出与keys数组中键匹配的字段
  const filterArr = size(keys)
    ? filter(fields, (field) => includes(keys, field.prop))
    : fields;
  // 2.验证字段：调用doValidateField方法，传递过滤后的字段数组，返回Promise，异步验证字段
  try {
    const result = await doValidateField(filterArr);
    // 验证通过，调用回调函数，并返回验证结果
    if (result === true) {
      callback?.(result);
    }
    return result;
  } catch (e) {
    // 3.错误处理：捕获验证错误，判断e是否为Error实例，如果是抛出错误；
    // 不是则将其视为ValidateFieldsError，调用回调函数并传递验证失败的字段信息，同时返回一个被拒绝的Promise
    if (e instanceof Error) throw e;
    const invalidFields = e as ValidateFieldsError;
    callback?.(false, invalidFields);
    return Promise.reject(invalidFields);
  }
};
// 过滤指定字段
function filterFields(fields: FormItemContext[], props: string[]) {
  return size(props)
    ? filter(fields, (field) => includes(props, field.prop))
    : fields;
}
// 重置表单字段
const resetFields: FormInstance["resetFields"] = function (
  keys: string[] = []
) {
  each(filterFields(fields, keys), (field) => field.resetField());
};
// 清除表单字段的验证状态
const clearValidate: FormInstance["clearValidate"] = function (
  keys: string[] = []
) {
  each(filterFields(fields, keys), (field) => field.clearValidate());
};
// 创建一个响应式的表单上下文对象
const formCtx: FormContext = reactive({
  // toRefs将响应式对象的属性转换为单独的响应式引用（可以单独处理对象的每个属性，不要直接操作整个对象）
  ...toRefs(props),
  // emits包含组件可以触发的事件的数组
  emits,
  addField,
  removeField,
});
// provide提供上下文，使得子组件可以访问
provide<FormContext>(FORM_CTX_KEY, formCtx);
// 暴露组件实例方法供父组件调用
defineExpose<FormInstance>({
  validate,
  validateField,
  resetFields,
  clearValidate,
});
</script>
<template>
  <form class="melon-form">
    <slot></slot>
  </form>
</template>

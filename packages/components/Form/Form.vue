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
const addField: FormContext["addField"] = function (field) {
  if (!field.prop) return;
  fields.push(field);
};
const removeField: FormContext["removeField"] = function (field) {
  if (!field.prop) return;
  fields.splice(fields.indexOf(field), 1);
};

const fields: FormItemContext[] = [];
const validate: FormInstance["validate"] = async function (
  callback?: FormValidateCallback
) {
  return validateField([], callback);
};

async function doValidateField(fields: FormItemContext[] = []) {
  let validationErrors: ValidateFieldsError = {};
  for (const field of fields) {
    try {
      await field.validate("");
    } catch (e) {
      validationErrors = {
        ...validationErrors,
        ...(e as ValidateFieldsError),
      };
    }
  }
  if (!size(Object.keys(validationErrors))) return true;
  return Promise.reject(validationErrors);
}

const validateField: FormInstance["validateField"] = async function (
  keys: string[] = [],
  callback?: FormValidateCallback
) {
  const filterArr = size(keys)
    ? filter(fields, (field) => includes(keys, field.prop))
    : fields;
  try {
    const result = await doValidateField(filterArr);
    if (result === true) {
      callback?.(result);
    }
    return result;
  } catch (e) {
    if (e instanceof Error) throw e;
    const invalidFields = e as ValidateFieldsError;
    callback?.(false, invalidFields);
    return Promise.reject(invalidFields);
  }
};
function filterFields(fields: FormItemContext[], props: string[]) {
  return size(props)
    ? filter(fields, (field) => includes(props, field.prop))
    : fields;
}
const resetFields: FormInstance["resetFields"] = function (
  keys: string[] = []
) {
  each(filterFields(fields, keys), (field) => field.resetField());
};

const clearValidate: FormInstance["clearValidate"] = function (
  keys: string[] = []
) {
  each(filterFields(fields, keys), (field) => field.clearValidate());
};
const formCtx: FormContext = reactive({
  ...toRefs(props),
  emits,
  addField,
  removeField,
});
provide<FormContext>(FORM_CTX_KEY, formCtx);
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

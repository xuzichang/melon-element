<script setup lang="ts">
import {
  computed,
  inject,
  type Ref,
  ref,
  useSlots,
  nextTick,
  reactive,
  toRefs,
  onMounted,
  onUnmounted,
  watch,
  watchEffect,
  provide,
} from "vue";
import {
  isNumber,
  endsWith,
  size,
  isNil,
  get,
  filter,
  map,
  includes,
  keys,
  isArray,
  isString,
  cloneDeep,
  some,
} from "lodash-es";
import type {
  FormItemProps,
  ValidateStatus,
  FormItemInstance,
  FormValidateCallback,
  FormItemRule,
  FormValidateFailure,
  FormItemContext,
} from "./types";
import { FORM_CTX_KEY, FORM_ITEM_CTX_KEY } from "./constans";
import Schema, { type RuleItem } from "async-validator";
import { useId } from "@melon-element/hooks";
defineOptions({ name: "MelonFormItem" });
const props = withDefaults(defineProps<FormItemProps>(), {
  showMessage: true,
  required: void 0,
});
// inject获取表单上下文
const ctx = inject(FORM_CTX_KEY);
// useSlots获取插槽
const slots = useSlots();
const validateStatus: Ref<ValidateStatus> = ref("init");
const isRequired = computed(
  () =>
    !ctx?.hideRequiredAsterisk &&
    (some(itemRules.value, "required") || props?.required)
);
const isDisabled = computed(() => ctx?.disabled || props?.disabled);
const errMsg = ref("");

const inputIds = ref<string[]>([]);
const hasLabel = computed(() => !!(props.label || slots.label));
const labelFor = computed(
  () => props.for || (inputIds.value.length ? inputIds.value[0] : "")
);
// 生成唯一的标签Id
const labelId = useId().value;
const currentLabel = computed(
  () => `${props.label ?? ""}${ctx?.labelSuffix ?? ""}`
);
// 计算标签宽度
const normalizeLabelWidth = computed(() => {
  const _normalizeStyle = (val: number | string) => {
    if (isNumber(val)) return `${val}px`;
    return endsWith(val, "px") ? val : `${val}px`;
  };
  if (props.labelWidth) return _normalizeStyle(props.labelWidth);
  if (ctx?.labelWidth) return _normalizeStyle(ctx.labelWidth);
  return "150px";
});
// 获取对象属性值：接受参数target，类型是对象或void（null或undefined）
// get：根据 对象路径 获取值
const getValByProp = (target: Record<string, any> | void) => {
  // target、props.prop是否存在，不是null或undefined
  // get(target,props.prop)结果不是null或undefined
  if (target && props.prop && !isNil(get(target, props.prop))) {
    return get(target, props.prop);
  }
  // 任一条件不满足返回null
  return null;
};

// 根据props和context（required、rules）动态生成表单验证规则
const itemRules = computed(() => {
  const { required } = props;
  // 1.初始化规则数组：存储最终验证规则
  const rules: FormItemRule[] = [];
  // 2.判断props.rules是否存在，存在则push到rules数组
  if (props.rules) {
    rules.push(...props.rules);
  }
  // 3.处理上下文中的rules：如果上下文存在rules且组件props.prop存在，通过getValByProp获取与prop对应的规则，并添加到rules
  const formRules = ctx?.rules;
  if (formRules && props.prop) {
    const _rules = getValByProp(formRules);
    if (_rules) {
      rules.push(..._rules);
    }
  }
  // 4.处理required
  if (!isNil(required)) {
    // 筛选rules数组中是否已经存在required规则
    const requiredRules = filter(
      map(rules, (rule, i) => [rule, i]),
      (item: [FormItemRule, number]) => includes(keys(item[0]), "required")
    );
    // a.如果存在，遍历。如果规则的required与传入的required属性不同，更新
    if (size(requiredRules)) {
      for (const item of requiredRules) {
        const [rule, i] = item as [FormItemRule, number];
        if (rule.required === required) continue;
        rules[i] = { ...rule, required };
      }
    } else {
      // b.如果不存在，添加
      rules.push({ required });
    }
  }
  return rules;
});

let isResetting = false;
const validateEnabled = computed(() => size(itemRules.value) > 0);

function getTriggeredRules(trigger?: string) {
  const rules = itemRules.value;
  if (rules) {
    return filter(rules, (r) => {
      if (!r.trigger || !trigger) return true;
      if (isArray(r.trigger)) {
        return r.trigger.includes(trigger);
      }
      return r.trigger === trigger;
    }).map(({ trigger, ...rule }) => rule as RuleItem);
  }
  return [];
}
const propString = computed(() => {
  if (!props.prop) return "";
  return isString(props.prop) ? props.prop : props.prop.join(".");
});
const innerVal = computed(() => {
  const model = ctx?.model;
  return getValByProp(model);
});
async function doValidate(rules: any[]) {
  const modelName = propString.value;
  const validator = new Schema({ [modelName]: rules });
  return validator
    .validate({ [modelName]: innerVal.value }, { firstFields: true })
    .then(() => {
      validateStatus.value = "success";
      ctx?.emits("validate", props, true, "");
      return true;
    })
    .catch((err: FormValidateFailure) => {
      const { errors } = err;
      validateStatus.value = "error";
      errMsg.value = errors && size(errors) > 0 ? errors[0].message ?? "" : "";
      ctx?.emits("validate", props, false, errMsg.value);
      return Promise.reject(err);
    });
}

const validate: FormItemInstance["validate"] = async function (
  trigger: string,
  callback?: FormValidateCallback
) {
  if (isResetting || !props.prop || isDisabled.value) return false;
  if (!validateEnabled.value) {
    callback?.(false);
    return false;
  }
  const rules = getTriggeredRules(trigger);
  if (!size(rules)) {
    callback?.(true);
    return true;
  }

  validateStatus.value = "validating";

  return doValidate(rules)
    .then(() => {
      callback?.(true);
      return true;
    })
    .catch((err: FormValidateFailure) => {
      const { fields } = err;
      callback?.(false, fields);
      return Promise.reject(fields);
    });
};

let initialVal: any = null;
const clearValidate: FormItemInstance["clearValidate"] = function () {
  validateStatus.value = "init";
  errMsg.value = "";
  isResetting = false;
};
const resetField: FormItemInstance["resetField"] = function () {
  const model = ctx?.model;
  if (model && propString.value && !isNil(get(model, propString.value))) {
    isResetting = true;
    model[propString.value] = cloneDeep(initialVal);
  }
  nextTick(() => clearValidate());
};

const addInputId: FormItemContext["addInputId"] = function (id) {
  if (!includes(inputIds.value, id)) inputIds.value.push(id);
};
const removeInputId: FormItemContext["removeInputId"] = function (id) {
  inputIds.value = filter(inputIds.value, (i) => i != id);
};
const formItemCtx: FormItemContext = reactive({
  ...toRefs(props),
  disabled: isDisabled.value,
  validate,
  resetField,
  clearValidate,
  addInputId,
  removeInputId,
});

onMounted(() => {
  if (props.prop) {
    ctx?.addField(formItemCtx);
    initialVal = innerVal.value;
  }
});
onUnmounted(() => {
  if (props.prop) {
    ctx?.removeField(formItemCtx);
  }
});
watchEffect(() => (formItemCtx.disabled = isDisabled.value));

watch(
  () => props.error,
  (val) => {
    errMsg.value = val || "";
    validateStatus.value = val ? "error" : "init";
  },
  { immediate: true }
);
provide<FormItemContext>(FORM_ITEM_CTX_KEY, formItemCtx);
defineExpose<FormItemInstance>({
  validateMessage: errMsg,
  validateStatus,
  validate,
  resetField,
  clearValidate,
});
</script>

<template>
  <div
    class="melon-form-item"
    :class="{
      'is-error': validateStatus === 'error',
      'is-disabled': isDisabled,
      'is-required': isRequired,
      'asterisk-left': ctx?.requiredAsteriskPosition === 'left',
      'asterisk-right': ctx?.requiredAsteriskPosition === 'right',
    }"
  >
    <component
      v-if="hasLabel"
      class="melon-form-item__label"
      :class="`position-${ctx?.labelPosition ?? 'right'} ${labelId}`"
      :is="labelFor ? 'lable' : 'div'"
      :id="labelId"
      :for="labelFor"
    >
      <slot name="label" :label="currentLabel">{{ currentLabel }}</slot>
    </component>
    <div class="melon-form-item__content">
      <slot :validate="validate"></slot>
      <div class="melon-form-item__error-msg" v-if="validateStatus === 'error'">
        <template v-if="ctx?.showMessage && showMessage">
          <slot name="error" :error="errMsg">{{ errMsg }}</slot>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import "./style.css";
.melon-from-item {
  --melon-form-lable-width: v-bind(normalizeLabelWidth) !important;
}
</style>

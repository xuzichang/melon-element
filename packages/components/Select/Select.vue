<script setup lang="ts">
import type {
  SelectProps,
  SelectEmits,
  SelectStates,
  SelectOptionProps,
  SelectContext,
  SelectInstance,
} from "./types";
import { useFormDisabled, useFormItemInputId, useFormItem } from "../Form";
import {
  ref,
  reactive,
  computed,
  useSlots,
  h,
  provide,
  onMounted,
  nextTick,
  watch,
} from "vue";
import type { Ref, VNode } from "vue";
import {
  get,
  find,
  debounce,
  size,
  filter,
  eq,
  isFunction,
  includes,
  map,
  assign,
  isNil,
  isBoolean,
  each,
  noop,
} from "lodash-es";
import { POPPER_OPTIONS, SELECT_CTX_KEY } from "./constants";
import { useFocusController, useClickOutside } from "@melon-element/hooks";
import type { InputInstance } from "../Input";
import MelonOption from "./Option.vue";
import MelonTooltip from "../Tooltip/Tooltip.vue";
import MelonIcon from "../Icon/Icon.vue";
import MelonInput from "../Input/Input.vue";
import type { TooltipInstance } from "../Tooltip/types";
import { debugWarn, RenderVnode } from "@melon-element/utils";
import useKeyMap from "./useKeyMap";
const COMPONENT_NAME = "MelonSelect" as const;
defineOptions({
  name: COMPONENT_NAME,
});
const props = withDefaults(defineProps<SelectProps>(), {
  options: () => [],
});

const tooltipRef = ref<TooltipInstance>();
const emits = defineEmits<SelectEmits>();
const isDropdownVisible = ref(false);

const { formItem } = useFormItem();
const { inputId } = useFormItemInputId(props, formItem);

const initialOption = findOption(props.modelValue);
const selectStates = reactive<SelectStates>({
  inputValue: initialOption?.label ?? "",
  selectedOption: initialOption,
  mouseHover: false,
  loading: false,
  highlightedIndex: -1,
});

function findOption(value: string) {
  return find(props.options, (option) => option.value === value);
}
function controlInputVal(visible: boolean) {
  if (!props.filterable) return;
  if (visible) {
    if (selectStates.selectedOption) selectStates.inputValue = "";
    handleFilterDebounce();
  } else {
    selectStates.inputValue = selectStates.selectedOption?.label || "";
  }
}
function controlVisible(visible: boolean) {
  if (!tooltipRef.value) return;
  get(tooltipRef, ["value", visible ? "show" : "hide"])?.();
  props.filterable && controlInputVal(visible);
  isDropdownVisible.value = visible;
  emits("visible-change", visible);

  selectStates.highlightedIndex = -1;
}
function toggleVisible() {
  if (isDisabled.value) return;
  controlVisible(!isDropdownVisible.value);
}
const isDisabled = useFormDisabled();

const filterPlaceholder = computed(() => {
  return props.filterable &&
    selectStates.selectedOption &&
    isDropdownVisible.value
    ? selectStates.selectedOption.label
    : props.placeholder;
});

const inputRef = ref<InputInstance>();
const {
  wrapperRef: inputWrapperRef,
  isFocused,
  handleBlur,
  handleFocus,
} = useFocusController(inputRef);

const selectRef = ref<HTMLElement>();
useClickOutside(selectRef, (e) => handleClickOutside(e));
const timeout = computed(() => (props.remote ? 300 : 0));
const handleFilterDebounce = debounce(handleFilter, timeout.value);
const slots = useSlots();
const children = computed(() =>
  filter(slots?.default?.(), (child) => eq(child.type, MelonOption))
);
const hasChildren = computed(() => size(children.value) > 0);
const childrenOptions = computed(() => {
  if (!hasChildren.value) return [];
  return map(children.value, (item) => ({
    vNode: h(item),
    props: assign(item.props, {
      disabled:
        item.props?.disabled === true ||
        (!isNil(item.props?.disabled) && !isBoolean(item.props?.disabled)),
    }),
  }));
});
const filteredChilds: Ref<Map<VNode, SelectOptionProps>> = ref(new Map());
const filteredOptions = ref(props.options ?? []);
async function callRemoteMethod(method: Function, search: string) {
  if (!method || !isFunction(method)) return;
  selectStates.loading = true;
  let result;
  try {
    result = await method(search);
  } catch (error) {
    debugWarn(error as Error);
    debugWarn(COMPONENT_NAME, "callRemoteMethod error");
    result = [];
    return Promise.reject(error);
  } finally {
    selectStates.loading = false;
  }
  return result;
}
function setFilteredChilds(opts: typeof childrenOptions.value) {
  filteredChilds.value.clear();
  each(opts, (item) => {
    filteredChilds.value.set(item.vNode, item.props as SelectOptionProps);
  });
}
async function genFilterChilds(search: string) {
  if (!props.filterable) return;
  if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    await callRemoteMethod(props.remoteMethod, search);
    setFilteredChilds(childrenOptions.value);
    return;
  }
  if (props.filterMethod && isFunction(props.filterMethod)) {
    const options = map(props.filterMethod(search), "value");
    setFilteredChilds(
      filter(childrenOptions.value, (item) =>
        includes(options, get(item, ["props", "value"]))
      )
    );
    return;
  }
  setFilteredChilds(
    filter(childrenOptions.value, (item) =>
      includes(get(item, ["props", "label"]), search)
    )
  );
}
async function genFilterOptions(search: string) {
  if (!props.filterable) return;
  if (props.remote && props.remoteMethod && isFunction(props.remoteMethod)) {
    filteredOptions.value = await callRemoteMethod(props.remoteMethod, search);
    return;
  }
  if (props.filterMethod && isFunction(props.filterMethod)) {
    filteredOptions.value = props.filterMethod(search);
    return;
  }
  filteredOptions.value = filter(props.options, (opt) =>
    includes(opt.label, search)
  );
}
function handleFilter() {
  const searchKey = selectStates.inputValue;
  selectStates.highlightedIndex = -1;
  if (hasChildren.value) {
    genFilterChilds(searchKey);
    return;
  }
  genFilterOptions(searchKey);
}

const highlightedLine = computed(() => {
  let result: SelectOptionProps | void;
  if (hasChildren.value) {
    const node = [...filteredChilds.value][selectStates.highlightedIndex]?.[0];
    result = filteredChilds.value.get(node);
  } else {
    result = filteredOptions.value[selectStates.highlightedIndex];
  }
  return result;
});
const hasData = computed(
  () =>
    (hasChildren.value && filteredChilds.value.size > 0) ||
    (!hasChildren.value && size(filteredOptions.value) > 0)
);
const lastIndex = computed(() =>
  hasChildren.value
    ? filteredChilds.value.size - 1
    : size(filteredOptions.value) - 1
);
function handleSelect(o: SelectOptionProps) {
  if (o.disabled) return;
  selectStates.inputValue = o.label;
  selectStates.selectedOption = o;
  each(["change", "update:modelValue"], (k) => emits(k as any, o.value));
  controlVisible(false);
  inputRef.value?.focus();
}

const keyMap = useKeyMap({
  isDropdownVisible,
  controlVisible,
  selectStates,
  highlightedLine,
  handleSelect,
  hasData,
  lastIndex,
});
function handleKeyDown(e: KeyboardEvent) {
  keyMap.has(e.key) && keyMap.get(e.key)?.(e);
}

const showClear = computed(
  () =>
    props.clearable && selectStates.mouseHover && selectStates.inputValue !== ""
);
function handleClear() {
  inputRef.value?.clear();
  selectStates.inputValue = "";
  selectStates.selectedOption = null;
  emits("clear");
  each(["change", "update:modelValue"], (k) => emits(k as any, ""));
  formItem?.clearValidate();
}
const isNoData = computed(() => {
  if (!props.filterable) return false;
  if (!hasData.value) return true;
  return false;
});

function renderLabel(opt: SelectOptionProps): VNode | string {
  if (isFunction(props.renderLabel)) {
    return props.renderLabel(opt);
  }
  return opt.label;
}
function setSelected() {
  const option = findOption(props.modelValue);
  if (!option) return;
  selectStates.inputValue = option.label;
  selectStates.selectedOption = option;
}
const focus: SelectInstance["focus"] = function () {
  inputRef.value?.focus();
};
const blur: SelectInstance["blur"] = function () {
  handleClickOutside();
};
function handleClickOutside(e?: Event) {
  if (isFocused.value) {
    nextTick(() => handleBlur(new FocusEvent("focus", e)));
  }
}
watch(
  () => childrenOptions.value,
  (newOpts) => setFilteredChilds(newOpts),
  { immediate: true }
);
watch(
  () => props.options,
  (newOpts) => {
    filteredOptions.value = newOpts ?? [];
  }
);
watch(
  () => props.modelValue,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      formItem?.validate("change").catch((err) => debugWarn(err));
    }
    setSelected();
  }
);
onMounted(() => {
  setSelected();
});
provide<SelectContext>(SELECT_CTX_KEY, {
  handleSelect,
  selectStates,
  renderLabel,
  highlightedLine,
});
defineExpose<SelectInstance>({
  focus,
  blur,
});
</script>
<template>
  <div
    ref="selectRef"
    class="melon-select"
    :class="{
      'is-disabled': isDisabled,
    }"
    @click.stop="toggleVisible"
    @mouseenter="selectStates.mouseHover = true"
    @mouseleave="selectStates.mouseHover = false"
  >
    <melon-tooltip
      ref="tooltipRef"
      palcement="bottom-start"
      :popper-options="POPPER_OPTIONS"
      @click-outside="controlVisible(false)"
      manual
    >
      <template #default>
        <div ref="inputWrapperRef">
          <melon-input
            ref="inputRef"
            v-model="selectStates.inputValue"
            :id="inputId"
            :disabled="isDisabled"
            :placeholder="filterable ? filterPlaceholder : placeholder"
            :readonly="!filterable || !isDropdownVisible"
            @focus="handleFocus"
            @blur="handleBlur"
            @input="handleFilterDebounce"
            @keydown="handleKeyDown"
          >
            <template #suffix>
              <melon-icon
                v-if="showClear"
                icon="circle-xmark"
                class="melon-input__clear"
                @click.stop="handleClear"
                @mousedown.prevent="noop"
              />
              <melon-icon
                v-else
                class="header-angle"
                icon="angle-down"
                :class="{
                  'is-active': isDropdownVisible,
                }"
              />
            </template>
          </melon-input>
        </div>
      </template>
      <template #content>
        <div class="melon-select__loading" v-if="selectStates.loading">
          <melon-icon icon="spinner" spin />
        </div>
        <div class="melon-select__nodata" v-else-if="filterable && isNoData">
          No Data
        </div>
        <ul class="melon-select__menu" v-else>
          <template v-if="!hasChildren">
            <melon-option
              v-for="item in filteredOptions"
              :key="item.value"
              v-bind="item"
            />
          </template>
          <template v-else>
            <template
              v-for="[vNode, _props] in filteredChilds"
              :key="_props.value"
            >
              <render-vnode :vNode="vNode" />
            </template>
          </template>
        </ul>
      </template>
    </melon-tooltip>
  </div>
</template>
<style scoped>
@import "./style.css";
</style>

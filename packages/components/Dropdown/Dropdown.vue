<script setup lang="ts">
import { computed, ref, provide } from "vue";
import { omit, isNil } from "lodash-es";
import { useId, useDisabledStyle } from "@melon-element/hooks";
import type {
  DropdownProps,
  DropdownItemProps,
  DropdownContext,
  DropdownEmits,
  DropdownInstance,
} from "./types";
import { type TooltipInstance } from "../Tooltip";
import { type ButtonInstance, MelonButton, MelonButtonGroup } from "../Button";
import { DROPDOWN_CTX_KEY } from "./constants";
import Tooltip from "../Tooltip/Tooltip.vue";
import DropdownItem from "./DropdownItem.vue";

defineOptions({
  name: "MelonDropdown",
  inheritAttrs: false,
});
const props = withDefaults(defineProps<DropdownProps>(), {
  hideOnClick: true,
  items: () => [] as DropdownItemProps[],
});
const tooltipProps = computed(() =>
  omit(props, ["items", "hideAfterClick", "size", "type", "splitButton"])
);
const triggerRef = ref<ButtonInstance>();
const tooltipRef = ref<TooltipInstance>();

const emits = defineEmits<DropdownEmits>();
const slots = defineSlots();

function handleItemClick(e: DropdownItemProps) {
  props.hideOnClick && tooltipRef.value?.hide();
  !isNil(e.command) && emits("command", e.command);
}
!TEST && useDisabledStyle();

defineExpose<DropdownInstance>({
  open: () => tooltipRef.value?.show(),
  close: () => tooltipRef.value?.hide(),
});
provide<DropdownContext>(DROPDOWN_CTX_KEY, {
  handleItemClick,
  size: computed(() => props.size),
});
</script>

<template>
  <div
    class="melon-dropdown"
    :id="`dropdown-${useId().value}`"
    :class="{ 'is-disabled': props.disabled }"
  >
    <tooltip
      ref="tooltipRef"
      v-bind="tooltipProps"
      :virtual-triggering="splitButton"
      :virtual-ref="triggerRef"
      @visible-change="$emit('visible-change', $event)"
    >
      <melon-button-group
        :type="type"
        :size="size"
        :disabled="disabled"
        v-if="splitButton"
      >
        <melon-button @click="$emit('click', $event)">
          <slot name="default"></slot>
        </melon-button>
        <melon-button ref="triggerRef" icon="angle-down" />
      </melon-button-group>
      <slot v-else name="default"></slot>
      <template #content>
        <ul class="melon-dropdown__menu">
          <slot name="dropdown">
            <template
              v-for="item in items"
              :key="item.command ?? useId().value"
            >
              <dropdown-item v-bind="item" />
            </template>
          </slot>
        </ul>
      </template>
    </tooltip>
  </div>
</template>
<style scoped>
@import "./style.css";
:deep(.melon-button-group) {
  & > :last-child {
    padding: 5px 7px;
  }
}
</style>

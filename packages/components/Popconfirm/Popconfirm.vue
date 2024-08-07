<script setup lang="ts">
import { computed, ref } from "vue";
import type { PopconfirmProps, PopconfirmEmits } from "./types";
import type { TooltipInstance } from "../Tooltip";
import { addUnit } from "@melon-element/utils";
import { useLocale } from "@melon-element/hooks";

import MelonButton from "../Button/Button.vue";
import MelonIcon from "../Icon/Icon.vue";
import MelonTooltip from "../Tooltip/Tooltip.vue";

defineOptions({ name: "MelonPopconfirm" });
const props = withDefaults(defineProps<PopconfirmProps>(), {
  title: "",
  confirmButtonType: "primary",
  icon: "question-circle",
  iconColor: "#f90",
  hideAfter: 200,
  width: 200,
});
const style = computed(() => ({ width: addUnit(props.width) }));
const emits = defineEmits<PopconfirmEmits>();
const tooltipRef = ref<TooltipInstance>();
const { t } = useLocale();
function hidePopper() {
  tooltipRef.value?.hide();
}
function confirm(e: MouseEvent) {
  emits("confirm", e);
  hidePopper();
}
function cancel(e: MouseEvent) {
  emits("cancel", e);
  hidePopper();
}
</script>
<template>
  <melon-tooltip ref="tooltipRef" trigger="click" :hide-timeout="hideAfter">
    <template #content>
      <div class="melon-popconfirm" :style="style">
        <div class="melon-popconfirm__main">
          <melon-icon
            v-if="!hideIcon && icon"
            :icon="icon"
            :color="iconColor"
          />
          {{ title }}
        </div>
        <div class="melon-popconfirm__action">
          <melon-button
            size="small"
            class="melon-popconfirm__cancel"
            :type="cancelButtonType"
            @click="cancel"
          >
            {{ cancelButtonText || t("popconfirm.cancelButtonText") }}
          </melon-button>
          <melon-button
            size="small"
            class="melon-popconfirm__confirm"
            :type="confirmButtonType"
            @click="confirm"
          >
            {{ confirmButtonText || t("popconfirm.confirmButtonText") }}
          </melon-button>
        </div>
      </div>
    </template>
    <template v-if="$slots.default" #default>
      <slot name="default"></slot>
    </template>
    <template v-if="$slots.reference" #default>
      <slot name="reference"></slot>
    </template>
  </melon-tooltip>
</template>
<style scoped>
@import "./style.css";
</style>

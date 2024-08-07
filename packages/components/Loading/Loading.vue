<script setup lang="ts">
import type { LoadingOptions } from "./types";
import { computed, type Ref } from "vue";
import { isString } from "lodash-es";
import MelonIcon from '../Icon/Icon.vue'
defineOptions({ name: "MelonLoading", inheritAttrs: false });
const props = defineProps<LoadingOptions>();
const iconName = computed(() => {
  if (isString(props.spinner)) {
    return props.spinner;
  }
  return "spinner"; // 'circle-notch' 也很好看0.<
});
</script>
<template>
  <transition name="fade-in-linear" @after-leave="onAfterLeave">
    <div
      v-show="($props.visible as Ref).value"
      class="melon-loading melon-loading__mask"
      :class="{ 'is-fullscreen': fullscreen }"
    >
      <div class="melon-loading__spinner">
        <melon-icon v-if="$props.spinner !== false" :icon="iconName" spin />
        <p v-if="text" class="melon-loading-text">{{ text }}</p>
      </div>
    </div>
  </transition>
</template>
<style>
@import "./style.css";
.melon-loading {
  --melon-loading-bg-color: v-bind(background) !important;
  --melon-loading-z-index: v-bind(zIndex) !important;
}
</style>

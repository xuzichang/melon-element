<script setup lang="ts">
import { ref, computed, useSlots, defineEmits } from "vue";
import type { AlertProps, AlertEmits, AlertInstance } from "./types";
import MelonIcon from "../Icon/Icon.vue";
import { typeIconMap } from "@melon-element/utils";
defineOptions({
  name: "MelonAlert",
});
const props = withDefaults(defineProps<AlertProps>(), {
  effect: "light",
  type: "info",
  closable: true,
});
const visible = ref(true);
const slots = useSlots();
const emits = defineEmits<AlertEmits>()
const withDescription = computed(() => props.description || slots.default);
const iconName = computed(() => typeIconMap.get(props.type) ?? "circle-info");
function close() {
  visible.value = false
  emits('close')
}
function open() {
  visible.value = true
  emits('close')
}
defineExpose<AlertInstance>({
  open, close
})
</script>
<template>
  <transition name="melon-alert-fade">
    <div v-show="visible" class="melon-alert" role="alert" :class="{
      [`melon-alert__${type}`]: type,
      [`melon-alert__${effect}`]: effect,
      'text-center': center,
    }">
      <melon-icon v-if="showIcon" class="melon-alert__icon" :class="{ 'big-icon': withDescription }" :icon="iconName" />
      <div class="melon-alert__content">
        <span class="melon-alert__title" :class="{ 'with-desc': withDescription }"
          :style="{ display: center && !showIcon ? 'flow' : 'inline' }">
          <slot name="title">{{ title }}</slot>
        </span>
        <p class="melon-alert__description">
          <slot>{{ description }}</slot>
        </p>
        <div class="melon-alert__close" v-if="closable">
          <melon-icon @click.stop="close" icon="xmark" />
        </div>
      </div>
    </div>
  </transition>
</template>

<style scoped>
@import './style.css';
</style>

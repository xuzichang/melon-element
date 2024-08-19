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
// 获取插槽内容
const slots = useSlots();
// 定义组件可以发出的事件
const emits = defineEmits<AlertEmits>()
// 计算属性：是否显示描述信息
const withDescription = computed(() => props.description || slots.default);
// 计算属性：根据警告类型获取相应图标名称
const iconName = computed(() => typeIconMap.get(props.type) ?? "circle-info");
function close() {
  visible.value = false
  emits('close')
}
function open() {
  visible.value = true
  emits('close')
}
// 暴露open、close方法供父组件调用
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

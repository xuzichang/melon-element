<script setup lang="ts">
import { type CollapseItemProps } from "./types";
import { inject, computed } from "vue";
import { COLLAPSE_CTX_KEY } from "./constants";
import transitionEvents from "./transitionEvents";
import MelonIcon from "../Icon/Icon.vue";
// 组件选项
defineOptions({
  name: "MelonCollapseItem",
});
// 组件属性
const props = defineProps<CollapseItemProps>();
// 通过inject获取父组件传递的上下文
const ctx = inject(COLLAPSE_CTX_KEY);
// 计算属性：判断当前项是否处于激活状态，即是否在activeNames数组中
const isActive = computed(() => ctx?.activeNames.value?.includes(props.name));
// 点击事件：如果禁用直接返回；否则调用父组件传递的handleItemClick方法
function handleClick() {
  if (props.disabled) return;
  ctx?.handleItemClick(props.name);
}
</script>
<template>
  <div
    class="melon-collapse-item"
    :class="{
      'is-disabled': disabled,
    }"
  >
    <div
      class="melon-collapse-item__header"
      :id="`item-header-${name}`"
      :class="{
        'is-disabled': disabled,
        'is-active': isActive,
      }"
      @click="handleClick"
    >
      <span class="melon-collapse-item__title">
        <slot name="title">
          {{ title }}
        </slot>
      </span>
      <melon-icon icon="angle-right" class="header-angle" />
    </div>
    <transition name="slide" v-on="transitionEvents">
      <div class="melon-collapse-item__wapper" v-show="isActive">
        <div class="melon-collapse-item__content" :id="`item-content-${name}`">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>
<style scoped>
@import "./style.css";
</style>

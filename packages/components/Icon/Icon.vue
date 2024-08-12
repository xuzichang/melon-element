<script setup lang="ts">
import type { IconProps } from "./types";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import { omit } from "lodash-es";
import { computed } from "vue";
// defineOptions定义组件选项：设置组件名称为MelonIcon，并关闭继承父组件的属性
defineOptions({
  name: "MelonIcon",
  inheritAttrs: false,
});
const props = defineProps<IconProps>();
// 计算属性：
// 1. filterProps：过滤掉type和color属性，返回剩余的属性
const filterProps = computed(() => omit(props, ["type", "color"]));
// 2. customStyles：生成一个包含color属性的样式对象，如果props.color不存在，则设置为void 0
const customStyles = computed(() => ({
  color: props.color ?? void 0,
}));
</script>
<!-- 
  1. 使用<i>标签作为图标容器，并添加melon-icon类。
  2. :class：动态绑定类名，根据type属性添加melon-icon--${type}类。
    （type?: "primary" | "success" | "warning" | "danger" | "info"）
  3. :style：动态绑定样式，使用customStyles计算属性。（color）
  4. v-bind="$attrs"：绑定所有未声明的属性。
  5. <font-awesome-icon>：使用FontAwesomeIcon组件，并绑定filterProps计算属性。
-->
<template>
  <i
    class="melon-icon"
    :class="{ [`melon-icon--${type}`]: type }"
    :style="customStyles"
    v-bind="$attrs"
  >
    <font-awesome-icon v-bind="filterProps" />
  </i>
</template>
<style scoped>
.melon-icon {
  --melon-icon-color: inherit;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  position: relative;
  fill: currentColor;
  color: var(--melon-icon-color);
  font-size: inherit;
}

@each $val in primary, info, success, warning, danger {
  .melon-icon--$(val) {
    --melon-icon-color: var(--melon-color-$(val));
  }
}
</style>

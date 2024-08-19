<script setup lang="ts">
import { ref, provide, watch } from "vue";
import { each } from "lodash-es";
import type { CollapseItemName, CollapseProps, CollapseEmits } from "./types";
import { debugWarn } from "@melon-element/utils";
import { COLLAPSE_CTX_KEY } from "./constants";
const COMPONENT_NAME = "MelonCollapse" as const;
defineOptions({
  name: COMPONENT_NAME,
});
// 组件属性
const props = defineProps<CollapseProps>();
// 组件事件
const emits = defineEmits<CollapseEmits>();
// 定义响应式数据，存储当前激活面板项的名称
const activeNames = ref<CollapseItemName[]>(props.modelValue);
// 检查手风琴模式：（处于手风琴模式且激活的面板数量＞1，则输出警告信息）according为true表明组件处于手风琴模式
if (props.accordion && activeNames.value.length > 1) {
  debugWarn(COMPONENT_NAME, "according mode should only have one active item");
}
// 处理面板点击事件
function handleItemClick(item: CollapseItemName) {
  let _activeNames = [...activeNames.value];

  // 手风琴模式：直接替换
  if (props.accordion) {
    _activeNames = [_activeNames[0] === item ? "" : item];
    updateActiveNames(_activeNames);
    return;
  }
  // 其他模式：当前点击面板是否激活，是删除，否插入（indexOf可数组可字符串）
  const index = _activeNames.indexOf(item);
  if (index > -1) {
    // 存在，删除数组中的一项
    _activeNames.splice(index, 1);
  } else {
    // 不存在，插入对应name
    _activeNames.push(item);
  }
  updateActiveNames(_activeNames);
}
// 更新激活的面板项
function updateActiveNames(val: CollapseItemName[]) {
  activeNames.value = val;
  each(["update:modelValue", "change"], (e) =>
    emits(e as "update:modelValue" & "change", val)
  );
}
// 监听modelValue变化，变化时更新激活的面板
watch(
  () => props.modelValue,
  (val) => updateActiveNames(val)
);
// provide提供上下文，使得子组件可以访问
provide(COLLAPSE_CTX_KEY, {
  activeNames,
  handleItemClick,
});
</script>
<template>
  <div class="melon-collapse">
    <slot></slot>
  </div>
</template>
<style scoped>
@import "./style.css";
</style>

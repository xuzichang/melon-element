<script setup lang="ts">
// popperjs（计算元素位置方向）创建和管理Tooltip弹出位置
import { createPopper, type Instance } from "@popperjs/core";
import { type DebouncedFunc, debounce, bind } from 'lodash-es'
import { ref, watch, type Ref, computed, watchEffect, onUnmounted } from "vue";
import type { TooltipProps, TooltipEmits, TooltipInstance } from "./types";
import type { ButtonInstance } from "../Button";
import { useClickOutside } from '@melon-element/hooks'
import useEvenstToTiggerNode from './useEventsToTriggerNode'
// 组件选项
defineOptions({
  name: "MelonTooltip",
});
// 扩展属性，增加virtualRef和virtualTriggering
interface _TooltipProps extends TooltipProps {
  virtualRef?: HTMLElement | ButtonInstance | void;
  virtualTriggering?: boolean;
}
// 组件属性
const props = withDefaults(defineProps<_TooltipProps>(), {
  placement: "bottom",
  trigger: "hover",
  transition: "fade",
  showTimeout: 0,
  hideTimeout: 200,
});
// 组件事件
const emits = defineEmits<TooltipEmits>();
// tooltip显示状态
const visible = ref(false);
// 1.存储外部事件
const outerEvents: Ref<Record<string, EventListener>> = ref({});
// 2.触发节点事件
const events: Ref<Record<string, EventListener>> = ref({});
// 3.下拉事件
const dropdownEvents: Ref<Record<string, EventListener>> = ref({});

// 1.存储容器节点
const containerNode = ref<HTMLElement>();
// 2.Tooltip节点
const popperNode = ref<HTMLElement>();
// 3.触发节点
const _triggerNode = ref<HTMLElement>();
// 计算属性：触发节点
const triggerNode = computed(() => {
  if (props.virtualTriggering) {
    return (
      ((props.virtualRef as ButtonInstance)?.ref as any) ??
      (props.virtualRef as HTMLElement) ??
      _triggerNode.value
    );
  }
  return _triggerNode.value as HTMLElement
});
// 计算属性：popper配置
const popperOptions = computed(() => ({
  placement: props.placement,
  modifiers: [
    {
      name: 'offset',
      options: {
        offset: [0, 9]
      }

    }
  ],
  ...props.popperOptions
}))
// 打开/关闭延迟时间
const openDelay = computed(() => props.trigger === 'hover' ? props.showTimeout : 0)
const closeDelay = computed(() => props.trigger === 'hover' ? props.hideTimeout : 0)

let openDebounce: DebouncedFunc<() => void> | void
let closeDebounce: DebouncedFunc<() => void> | void

// 打开
function openFinal() {
  closeDebounce?.cancel()
  openDebounce?.()
}
// 关闭
function closeFinal() {
  openDebounce?.cancel()
  closeDebounce?.()
}
// 切换
function togglePopper() {
  visible.value ? closeFinal() : openFinal()
}
// 设置显示状态并触发事件visible-change
function setVisible(val: boolean) {
  if (props.disabled) return
  visible.value = val
  emits('visible-change', val)
}
// 根据触发方式绑定相应的事件
function attachEvents() {
  if (props.disabled || props.manual) return
  if (props.trigger === 'hover') {
    events.value["mouseenter"] = openFinal
    outerEvents.value["mouseleave"] = closeFinal
    dropdownEvents.value['mouseenter'] = openFinal
    return
  }
  if (props.trigger === 'click') {
    events.value['click'] = togglePopper
  }
  if (props.trigger === 'contextmenu') {
    events.value['contextmenu'] = (e) => {
      e.preventDefault()
      openFinal()
    }
  }
}

// popper实例
let popperInstance: null | Instance;
// 销毁popper实例
function destroyPopperInstance() {
  popperInstance?.destroy();
  popperInstance = null;
}
// 重置事件绑定
function resetEvents() {
  events.value = {}
  outerEvents.value = {}
  dropdownEvents.value = {}
  attachEvents()
}
if (!props.manual) {
  attachEvents()
}
const show: TooltipInstance['show'] = openFinal
const hide: TooltipInstance['hide'] = function () {
  openDebounce?.cancel()
  setVisible(false)
}
// 使用自定义的点击外部关闭功能
useClickOutside(containerNode, () => {
  emits("click-outside")
  if (props.trigger === 'hover' || props.manual) return
  visible.value && closeFinal()
})
// 1.监听：visible
watch(visible, (val) => {
  if (!val) return
  if (triggerNode.value && popperNode.value) {
    popperInstance = createPopper(
      triggerNode.value,
      popperNode.value,
      popperOptions.value
    )
  }
},
  { flush: "post" })

// 2.监听：manual
watch(() => props.manual, (isManual) => {
  if (isManual) {
    events.value = {}
    outerEvents.value = {}
    dropdownEvents.value = {}
    return
  }
  attachEvents()
})
// 3.监听：trigger
watch(() => props.trigger, (newTrigger, oldTrigger) => {
  if (newTrigger === oldTrigger) return
  resetEvents()
})
// 4.监听：disabled
watch(() => props.disabled, (val, oldVal) => {
  if (val === oldVal) return
  openDebounce?.cancel()
  visible.value = false
  emits('visible-change', false)
  resetEvents()
})
// 5.监听openDelay和closeDelay，更新防抖函数
watchEffect(() => {
  openDebounce = debounce(bind(setVisible, null, true), openDelay.value)
  closeDebounce = debounce(bind(setVisible, null, false), closeDelay.value)
})
// 自定义触发节点事件处理函数
useEvenstToTiggerNode(props, triggerNode, events, () => {
  openDebounce?.cancel()
  setVisible(false)
})
// 组件卸载时销毁popper实例
onUnmounted(() => {
  destroyPopperInstance()
})
// 暴露show、hide方法供外部调用
defineExpose<TooltipInstance>({
  show, hide
})
</script>
<template>
  <div class="melon-tooltip" ref="containerNode" v-on="outerEvents">
    <div class="melon-tooltip__trigger" :class="`${JSON.stringify(props)}`" ref="_triggerNode" v-on="events" v-if="!virtualTriggering">
      <slot></slot>
    </div>
    <slot name="default" v-else></slot>
    <transition :name="transition" @after-leave="destroyPopperInstance">
      <div class="melon-tooltip__popper" ref="popperNode" v-on="dropdownEvents" v-if="visible">
        <slot name="content">{{ content }}</slot>
        <div id="arrow" data-popper-arrow></div>
      </div>
    </transition>
  </div>
</template>
<style scoped>
@import "./style.css";
</style>

import { each, isElement } from "lodash-es";
import { onMounted, onUnmounted, watch } from "vue";
import type { ComputedRef, Ref, WatchStopHandle } from "vue";
import type { TooltipProps } from "./types";
/**
 *
 * @param props 包含Tooltip组件的属性和是否启用虚拟触发
 * @param triggerNode 计算属性：返回触发事件的HTML元素
 * @param events 响应式引用：包含要绑定的事件及其处理函数
 * @param closeMethod 关闭Tooltip
 */
export function useEventsToTriggerNode(
  props: TooltipProps & { virtualTriggering?: boolean },
  triggerNode: ComputedRef<HTMLElement | undefined>,
  events: Ref<Record<string, EventListener>>,
  closeMethod: () => void
) {
  let watchEventsStopHandle: WatchStopHandle | void;
  let watchTriggerNodeStopHandle: WatchStopHandle | void;

  const _eventHandleMap = new Map();

  // 将事件绑定到虚拟触发节点上
  const _bindEventToVirtualTriggerNode = () => {
    const el = triggerNode.value;
    isElement(el) &&
      each(events.value, (fn, event) => {
        _eventHandleMap.set(event, fn);
        el?.addEventListener(event as keyof HTMLElementEventMap, fn);
      });
  };
  // 解绑虚拟触发节点上的特殊事件
  const _unbindEventToVirtualTriggerNode = () => {
    const el = triggerNode.value;
    isElement(el) &&
      each(
        ["mouseenter", "click", "contextmenu"],
        (key) =>
          _eventHandleMap.has(key) &&
          el?.removeEventListener(key, _eventHandleMap.get(key))
      );
  };
  // 组件挂载时监听：triggerNode和events
  onMounted(() => {
    // 1.监听triggerNode，如果启用了虚拟触发，则绑定事件
    watchTriggerNodeStopHandle = watch(
      triggerNode,
      () => props.virtualTriggering && _bindEventToVirtualTriggerNode(),
      { immediate: true }
    );
    // 2.监听events，如果启用了虚拟触发，则解绑并重新绑定事件，并关闭Tooltip
    watchEventsStopHandle = watch(
      events,
      () => {
        if (!props.virtualTriggering) return;
        _unbindEventToVirtualTriggerNode();
        _bindEventToVirtualTriggerNode();
        closeMethod();
      },
      { deep: true }
    );
  });
  // 组件卸载时，停止监听
  onUnmounted(() => {
    watchTriggerNodeStopHandle?.();
    watchEventsStopHandle?.();
  });
}

export default useEventsToTriggerNode;

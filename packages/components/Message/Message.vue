<script setup lang="ts">
import type { MessageProps } from "./types";
import { ref, computed, onMounted, watch } from "vue";
import { bind, delay } from "lodash-es";
import { useOffset, useEventListener } from "@melon-element/hooks";
import { getLastBottomOffset } from "./methods";
import { typeIconMap, RenderVnode } from "@melon-element/utils";
import MelonIcon from "../Icon/Icon.vue";
defineOptions({ name: "ErMessage" });
const props = withDefaults(defineProps<MessageProps>(), {
  type: "info",
  duration: 3000,
  offset: 10,
  transitionName: "fade-up",
});

const messageRef = ref<HTMLDivElement>();
const visible = ref(false);
const boxHeight = ref(0);

const iconName = computed(() => typeIconMap.get(props.type) ?? "circle-info");

const { topOffset, bottomOffset } = useOffset({
  getLastBottomOffset: bind(getLastBottomOffset, props),
  offset: props.offset,
  boxHeight,
});
const cssStyle = computed(() => ({
  top: topOffset.value + "px",
}));

let timer: number;
function startTimer() {
  if (props.duration === 0) return;
  timer = delay(close, props.duration);
}
function clearTimer() {
  clearTimeout(timer);
}

function close() {
  visible.value = false;
}

onMounted(() => {
  visible.value = true;
  startTimer();
});
useEventListener(document, "keydown", (e: Event) => {
  const { code } = e as KeyboardEvent;
  if (code === "Escape") {
    close();
  }
});
watch(visible, (val) => {
  if (!val) boxHeight.value = -props.offset; // 退出动画更流畅
});
defineExpose({
  bottomOffset,
  close,
});
</script>
<template>
  <Transition
    :name="transitionName"
    @enter="boxHeight = messageRef!.getBoundingClientRect().height"
    @after-leave="!visible && onDestory()"
  >
    <div
      ref="messageRef"
      class="melon-message"
      :class="{
        [`melon-message--${type}`]: type,
        'is-close': showClose,
        'text-center': center,
      }"
      :style="cssStyle"
      v-show="visible"
      role="alert"
      @mouseenter="clearTimer"
      @mouseleave="startTimer"
    >
      <melon-icon class="melon-message__icon" :icon="iconName" />
      <div class="melon-message__content">
        <slot>
          <render-vnode v-if="message" :vNode="message" />
        </slot>
      </div>
      <div class="melon-message__close" v-if="showClose">
        <melon-icon icon="xmark" @click.stop="close" />
      </div>
    </div>
  </Transition>
</template>

<style scoped>
@import "./style.css";
</style>

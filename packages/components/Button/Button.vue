<script setup lang="ts">
import type { ButtonProps, ButtonEmits, ButtonInstance } from "./types";
import { ref, computed, inject } from "vue";
import { throttle } from "lodash-es";
import MelonIcon from "../Icon/Icon.vue";
import { BUTTON_GROUP_CTX_KEY } from "./contants";
/**
 * 选项定义函数defineOptions：定义一个名为MelonButton的组件
 * defineOptions vue3新特性，用于定义组件的选项。这些选项在组件实例化之前被设置。
 * 接收一个对象，该对象包含组件选项，name必选
 */
defineOptions({
  name: "MelonButton",
});
/**
 * 定义props
 * withDefaults：如果属性不存在，将一个对象的所有属性设置为默认值。
 * 接受一个对象作为参数，返回一个新对象，其中所有值具有默认值。
 * defineProps vue3新特性，用于在组件中定义属性
 * ButtonProps 类型定义，表明组件可以接收的属性
 * vue2：props定义属性，v-bind绑定属性
 */
const props = withDefaults(defineProps<ButtonProps>(), {
  tag: "button",
  nativeType: "button",
  useThrottle: true,
  throttleDuration: 500,
});
/**
 * 组件选项定义，定义组件可以触发的事件
 * defineEmits vue3新特性，定义组件可以触发的事件。接收一个对象作为参数，该对象表示组件可以触发的事件及其类型
 * ButtonEmits 类型定义，包含组件可以触发的事件名称及其类型
 * 通过defineEmits，组件可以访问这些定义的事件类型，并在需要时触发它们。
 * this.$emit('click','some payload')
 * 返回的emits是一个对象，包含按钮组件可以触发的事件类型
 * vue2：mixins或extends
 */
const emits = defineEmits<ButtonEmits>();
/**
 * 插槽语法糖，用于在父组件中向子组件中传递自定义内容
 * defineSlots：定义插槽，接收一个函数作为参数。
 * 该函数返回一个对象，该对象包含父组件中传递给子组件的插槽内容。
 * 当子组件中没有定义相应的插槽时，父组件中的插槽内容将默认填充到子组件的<slot>标签中。
 * 如果子组件定义了插槽，父组件中的插槽内容将覆盖子组件中的插槽内容
 */
const slots = defineSlots();
const ctx = inject(BUTTON_GROUP_CTX_KEY, void 0);
const size = computed(() => ctx?.size ?? props?.size ?? "");
const type = computed(() => ctx?.type ?? props?.type ?? "");
const disabled = computed(() => ctx?.disabled || props?.disabled || false);
/**
 * ref：创建一个对HTMLButtonElement的引用
 * 返回一个对象，其中包含一个名为value的属性，该属性包含创建的引用。
 * 可以通过_ref.value来访问按钮元素
 */
const _ref = ref<HTMLButtonElement>();
/**
 * 计算属性，根据插槽内容是否存在来决定是否显示图标
 * 基于它们依赖进行缓存，只有缓存发生改变时才重新计算它们的值
 * iconStyle依赖slots.default
 * 控制图标的位置marginRight
 */
const iconStyle = computed(() => ({
  marginRight: slots.default ? "6px" : "0px",
}));
/**
 * 定义名为handleBtnClick的函数，该函数接受一个名为e的参数，它是MouseEvent类型。
 * 主要目的：将e事件对象传递给父组件，从而触发父组件中的click事件
 * emits将click事件传递给父组件。当用户点击按钮时，这个函数被调用，并将事件对象e传递给父组件
 */
const handleBtnClick = (e: MouseEvent) => emits("click", e);
/**
 * throttle：节流函数，用于限制函数的执行频率。（第三方库）
 * 接受两个参数：一个是要被节流的函数，另一个是延迟执行的时间。
 * 返回一个新函数，该函数在指定的时间内只允许调用一次。
 */
const handleBtnClickThrottle = throttle(
  handleBtnClick,
  props.throttleDuration,
  { trailing: false }
);
/**
 * 在组件中暴露一个响应式引用ref，这个函数接收一个类型参数ButtonInstance，用于指定要暴露的组件实例的类型
 * 通过调用defineExpose函数并传入一个对象，该对象包含一个ref属性，用于存储组件实例的响应式引用
 * 其他组件可以通过访问this.$refs对象来获取组件实例
 */
defineExpose<ButtonInstance>({
  ref: _ref,
  disabled,
  size,
  type,
});
</script>
<!-- 
  写在template和components中，测试不同过。删除这一段 11/10，原来是19/2
  上面定义的props：tag、autofocus、nativeType、disabled、loading、type....
  type：根据tag设置值。当tag为'button'时,type被设置为nativeType；否则设置为void 0。
  is：vue的特殊属性，动态绑定当前组件的类型。根据不同条件渲染不同元素
-->
<template>
  <component
    :is="tag"
    :autofocus="autofocus"
    ref="_ref"
    class="melon-button"
    :type="tag === 'button' ? nativeType : void 0"
    :disabled="disabled || loading ? true : void 0"
    :class="{
      [`melon-button--${type}`]: type,
      [`melon-button--${size}`]: size,
      'is-plain': plain,
      'is-round': round,
      'is-circle': circle,
      'is-disabled': disabled,
      'is-loading': loading,
    }"
    @click="
      (e: MouseEvent) =>
        useThrottle ? handleBtnClickThrottle(e) : handleBtnClick(e)
    "
  >
    <!-- 
    :icon="loadingIcon ?? 'spinner'"
    如果loadingIcon存在，则使用loadingIcon的值作为图标的名称；否则使用默认的图标名称'spinner'。
   -->
    <template v-if="loading">
      <slot name="loading">
        <melon-icon
          class="loading-icon"
          :icon="loadingIcon ?? 'spinner'"
          :style="iconStyle"
          size="1x"
          spin
        ></melon-icon>
      </slot>
    </template>
    <melon-icon
      v-if="icon && !loading"
      :icon="icon"
      size="1x"
      :style="iconStyle"
    >
    </melon-icon>
    <slot></slot>
  </component>
</template>
<style scoped>
@import "./style.css";
</style>

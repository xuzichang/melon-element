import type { Component, ComputedRef, Ref } from "vue";
export type ButtonType = "primary" | "success" | "warning" | "danger" | "info";
export type NativeType = "button" | "submit" | "reset";
export type ButtonSize = "large" | "default" | "small";

export interface ButtonProps {
  tag?: string | Component;
  type?: ButtonType;
  size?: ButtonSize;
  nativeType?: NativeType;
  disabled?: boolean;
  loading?: boolean;
  icon?: string;
  circle?: boolean;
  plain?: boolean;
  round?: boolean;
  loadingIcon?: string;
  autofocus?: boolean;
  useThrottle?: boolean;
  throttleDuration?: number;
}

/**
 * 定义名为 ButtonEmits 的接口，用于描述按钮组件的发出事件
 * 接口中定义一个方法：
 * 接受参数一：事件名称（名e的属性，类型为字符串click）
 * 接收参数二：事件值（名val的属性，类型为MouseEvent）
 * 没有返回值，只接受一个MouseEvent类型的参数
 * 
 * 便于再父组件中处理事件，父组件可以明确知道按钮组件会发出哪些事件，以及事件的参数类型
 * 
 */
export interface ButtonEmits {
  (e: "click", val: MouseEvent): void;
}

/**
 * 定义名为 ButtonInstance 的接口，用于描述按钮组件的实例
 * 接口中定义一个属性：
 * 属性名：ref
 * 属性类型：Ref<HTMLButtonElement | void>
 * 
 * Ref是Vue提供的一个类型，用于表示一个响应式的引用
 */
export interface ButtonInstance {
  ref: Ref<HTMLButtonElement | void>;
  disabled: ComputedRef<boolean>;
  size: ComputedRef<string>;
  type: ComputedRef<string>;
}


// 按钮组
export interface ButtonGroupProps {
  size?:ButtonSize
  type?:ButtonType
  disabled?:boolean
}

// 上下文用于依赖注入
export interface ButtonGroupContext {
  size?:ButtonSize
  type?:ButtonType
  disabled?:boolean
}
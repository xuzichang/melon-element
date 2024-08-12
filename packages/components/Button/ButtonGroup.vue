<script setup lang="ts">
import type { ButtonGroupProps } from './types';
import {provide,reactive,toRef} from 'vue'
import {BUTTON_GROUP_CTX_KEY} from './contants'

defineOptions({
    name:'MelonButtonGroup'
})
const props = defineProps<ButtonGroupProps>()
// provide在组件树中提供响应式数据
provide(
    BUTTON_GROUP_CTX_KEY,
    // reactive创建一个响应式对象，toRef将props中的属性转换为响应式引用
    reactive({
        size:toRef(props,'size'),
        type:toRef(props,'type'),
        disabled:toRef(props,'disabled')
    })
)
</script>
<template>
    <div class="melon-button-group">
        <slot></slot>
    </div>
</template>
<style scoped>
@import './style.css';
</style>
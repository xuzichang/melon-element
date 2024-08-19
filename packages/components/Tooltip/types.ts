import type {Placement,Options} from '@popperjs/core'
export interface TooltipProps{
    content?:string;// 提示框内容，任意字符串
    trigger?:"hover"|"click"|"contextmenu";// 触发提示框事件类型
    placement?:Placement;// 提示框相对于目标元素位置
    manual?:boolean;// 是否手动控制提示框的显示和隐藏，默认false
    disabled?:boolean;// 是否禁用提示框，默认false
    popperOptions?:Partial<Options>;// 传递给popperjs的选项，用于自定义弹出框的行为
    transition?:string;// 过渡动画名称
    showTImeout?:number;// 显示延时，单位毫秒
    hideTimeout?:number;// 隐藏延时，单位毫秒
}
export interface TooltipEmits{
    // 提示框的可见性发生变化时触发，value表示提示框是否可见
    (e:"visible-change",value:boolean):void;
    // 当用户点击提示框外部时触发
    (e:"click-outside"):void;
}
export interface TooltipInstance{
    show():void;
    hide():void;
}
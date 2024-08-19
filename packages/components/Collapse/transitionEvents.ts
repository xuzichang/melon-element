// 在过渡开始前将元素高度设置为0，便于隐藏元素
const _setHeightZero = (el:HTMLElement)=>(el.style.height="0px")
// 在过渡过程中将元素高度设置为实际内容高度，便于显示元素全部内容
const _setHeightScroll = (el:HTMLElement)=>(el.style.height=`${el.scrollHeight}px`)
// 在过渡结束后将元素高度设置为空字符串
const _setHeightEmpty=(el:HTMLElement)=>(el.style.height="")
// 在过渡过程中，隐藏元素溢出的内容
const _setOverflowHidden =(el:HTMLElement)=>(el.style.overflow="hidden")
// 在过渡结束后，将overflow重置
const _setOverflowEmpty = (el:HTMLElement)=>(el.style.overflow="")

const transitionEvents:Record<string,(el:HTMLElement)=>void>={
    // 过渡前调用，将高度设为0，将overflow设为空字符串
    beforeEnter(el){
        _setHeightZero(el)
        _setOverflowEmpty(el)
    },
    // 过渡时，将高度设为实际内容高度
    enter:(el)=>_setHeightScroll(el),
    // 过渡后，将高度重置为空字符串，将overflow重置
    afterEnter(el){
        _setHeightEmpty(el)
        _setOverflowEmpty(el)
    },
    // 离开过渡前，将高度设为实际内容高度，将overflow设为hidden
    beforeLeave(el){
        _setHeightScroll(el)
        _setOverflowHidden(el)
    },
    // 离开过渡时，将高度设为0
    leave:(el)=>_setHeightZero(el),
    // 离开过渡后，将高度设为空字符串，将overflow设为空字符串
    afterLeave(el){
        _setHeightEmpty(el)
        _setOverflowEmpty(el)
    }
}

export default transitionEvents
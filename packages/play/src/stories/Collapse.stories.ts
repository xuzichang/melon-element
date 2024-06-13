import type {Meta,StoryObj} from '@storybook/vue3'
import {MelonCollapse,MelonCollapseItem} from 'melon-element'
import 'melon-element/dist/theme/Collapse.css'
import "melon-element/dist/index.css";

type Story = StoryObj<typeof MelonCollapse>;

const meta:Meta<typeof MelonCollapse>={
    title:'Example/Collapse',
    component:MelonCollapse,
    subcomponents:{MelonCollapseItem},
    tags:["autodocs"]
}

export const Default:Story={
    render:(args)=>({
        components:{
            MelonCollapse,
            MelonCollapseItem,
        },
        setup(){
            return {
                args
            }
        },
        template:`
        <melon-collapse v-bind="args">
            <melon-collapse-item name="a" title="Title a">
                <div>this is content a</div>
            </melon-collapse-item>
            <melon-collapse-item name="b" title="title b">
                <div>this is content b</div>
            </melon-collapse-item>
            <melon-collapse-item name="c" title="title c disabled" disabled>
                <div>this is content c</div>
            </melon-collapse-item>
        </melon-collapse>
        `
    }),
    args:{
        accordion:true,
        modelValue:["a"]
    }
}
export default meta;
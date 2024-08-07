<script setup lang="ts">
import { ref, reactive, h } from "vue";
import {
  MelonMessage,
  MelonNotification,
  type RenderLabelFunc,
} from "melon-element";
const inputValue = ref("");

const switchValue = ref(true);

// 表单
const formRef = ref();
const formData = reactive({
  email: "123",
  password: "",
  confirmPwd: "",
});
const formRules: any = {
  email: [{ type: "email", required: true, trigger: "blur" }],
  password: [
    { type: "string", required: true, trigger: "blur", min: 3, max: 5 },
  ],
  confirmPwd: [
    { type: "string", required: true, trigger: "blur" },
    {
      validator: (_: typeof formRules, value: string) =>
        value === formData.password,
      trigger: "blur",
      message: "两个密码必须相同",
    },
  ],
};

async function submit() {
  try {
    await formRef.value.validate();
    console.log("passed!");
  } catch (e) {
    console.log("the error", e);
  }
}
function handleBtnClick() {
  MelonMessage.info("Button Click");
}
function handleNotify() {
  MelonNotification({
    title: "Title",
    message: "Message",
    type: "success",
  });
}
const selectValue = ref("");
const selectOptions = ref([
  {
    label: "Option A",
    value: "a",
  },
  {
    label: "Option B",
    value: "b",
  },
  {
    label: "Option C",
    value: "c",
    disabled: true,
  },
]);
const customOptionRender: RenderLabelFunc = (opt) => {
  return h("div", null, [
    h("b", { style: { color: "red" } }, opt.label),
    h("span", null, `~${opt.value}`),
  ]);
};
</script>

<template>
  <melon-select
    v-model="selectValue"
    placeholder="请选择"
    :render-label="customOptionRender"
    :options="selectOptions"
    clearable
    filterable
  >
    <melon-option label="opt 1" value="1" />
    <melon-option label="opt 2" value="2" />
    <span>a</span>
    <melon-option label="opt 3" value="3" disabled />
    <melon-option label="opt 4" value="4">
      <span style="color: green">opt 4</span>
    </melon-option>
  </melon-select>
  <melon-popconfirm title="Are you sure to delete this?">
    <melon-button type="danger">Danger</melon-button>
  </melon-popconfirm>
  <melon-alert title="📝按钮" description="点击按钮调用 MelonMessage " />
  <melon-button @click="handleBtnClick" :use-throttle="false"
    >MelonMessage</melon-button
  >
  <melon-alert title="📝按钮" description="点击按钮调用 MelonNotification " />
  <melon-button type="primary" @click="handleNotify"
    >MelonNotification</melon-button
  >
  <melon-alert title="📝切换按钮" />
  <melon-switch
    v-model="switchValue"
    size="large"
    active-text="ON"
    inactive-text="OFF"
  />
  <melon-alert title="📝Tooltip" />

  <melon-tooltip
    ref="tooltipRef"
    placement="right-end"
    trigger="hover"
    :popper-options="{ placement: 'right-end', strategy: 'fixed' }"
  >
    <melon-button icon="arrow-up">tooltip</melon-button>
    <template #content> 弹出部分 </template>
  </melon-tooltip>

  <melon-alert title="📝Alert" />
  <melon-alert title="title" type="success" show-icon />
  <melon-alert
    title="title"
    description="description"
    type="warning"
    show-icon
  />
  <melon-alert
    title="title"
    description="description"
    type="danger"
    show-icon
  />
  <melon-alert title="title" description="description" type="info" show-icon />
  <melon-alert title="📝输入框" />
  <melon-input v-model="inputValue" placeholder="请输入内容">
    <template #suffix> <melon-button>test</melon-button> </template>
    <template #append> test1</template>
  </melon-input>

  <melon-alert title="📝表单" />
  <melon-form
    ref="formRef"
    :model="formData"
    :rules="formRules"
    label-suffix=":"
    melon-loading-text="loading..."
    melon-loading-spinner="circle-notch"
    @submit="submit"
  >
    <melon-form-item label="email" prop="email" disabled>
      <melon-input v-model="formData.email" clearable />
    </melon-form-item>
    <melon-form-item label="password" prop="password">
      <melon-input v-model="formData.password" type="password" />
    </melon-form-item>
    <melon-form-item
      label="confirm password"
      prop="confirmPwd"
      :rules="[
        {
          required: true,
          trigger: 'test',
          message: '测试自定义触发',
        },
      ]"
    >
      <template #default="{ validate: _validate }">
        <melon-input v-model="formData.confirmPwd" type="password" />
        <button @click.prevent="_validate('test')">vli</button>
      </template>
    </melon-form-item>
    <div style="text-align: center">
      <melon-button type="primary" native-type="submit">Submit</melon-button>
    </div>
  </melon-form>
</template>

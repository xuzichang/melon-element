<script setup lang="ts">
import { ref ,reactive} from "vue";
const inputValue = ref("");

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

</script>

<template>
  <melon-button type="primary" size="small">test</melon-button>

  <melon-tooltip
    ref="tooltipRef"
    placement="right-end"
    trigger="hover"
    :popper-options="{ placement: 'right-end', strategy: 'fixed' }"
  >
    <melon-button icon="arrow-up">tooltip</melon-button>
    <template #content> 弹出部分 </template>
  </melon-tooltip>

  Alert：
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
输入框：
  <melon-input v-model="inputValue" placeholder="请输入内容">
    <template #suffix> <melon-button>test</melon-button> </template>
    <template #append> test1</template>
  </melon-input>

  表单：
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

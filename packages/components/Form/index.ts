import Form from "./Form.vue";
import FormItem from "./FormItem.vue";
import { withInstall } from "@melon-element/utils";

export const MelonForm = withInstall(Form);
export const MelonFormItem = withInstall(FormItem);

export * from "./types";
export * from "./hooks";
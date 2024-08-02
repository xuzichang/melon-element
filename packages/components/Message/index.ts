import Message from "./Message.vue";
import { withInstallFunction } from "@melon-element/utils";

export const MelonMessage = withInstallFunction(Message, "$message");

export * from "./types";

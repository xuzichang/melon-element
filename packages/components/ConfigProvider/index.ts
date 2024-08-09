import { withInstall } from "@melon-element/utils";
import ConfigProvider from "./ConfigProvider.vue";

export const MelonConfigProvider = withInstall(ConfigProvider);

export * from "./types";
export * from "./hooks";
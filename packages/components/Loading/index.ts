import { Loading } from "./service";
import { vLoading } from "./directive";
import type { App } from "vue";
export const MelonLoading = {
  name: "MelonLoading",
  install(app: App) {
    app.directive("loading", vLoading);
    app.config.globalProperties.$loading = Loading;
  },
  directive: vLoading,
  service: Loading,
};
export default MelonLoading;

export {
  vLoading,
  vLoading as MelonLoadingDirective,
  Loading as MelonLoadingService,
};

export * from "./types";

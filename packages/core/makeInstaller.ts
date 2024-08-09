import { get, set, each } from "lodash-es";
import { INSTALLED_KEY } from "@melon-element/constants";
import { type ConfigProviderProps ,provideGlobalConfig} from "@melon-element/components";
import type { App, Plugin } from "vue";
export default function makeInstaller(components: Plugin[]) {
  const install = (app: App, options?: ConfigProviderProps) => {
    if (get(app, INSTALLED_KEY)) return;
    set(app, INSTALLED_KEY, true);
    each(components, (c) => {
      app.use(c);
    });
    if (options) provideGlobalConfig(options, app, true);
  };
  return install;
}

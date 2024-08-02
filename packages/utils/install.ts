import type { App, Plugin } from "vue";
import { each } from "lodash-es";

type SFCWithInstall<T> = T & Plugin;

/**
 *
 * @param components 接受一个Plugin类型的数组
 * @returns
 *
 * components中的每个元素，再将installer转换为Plugin类型返回。
 */
export function makeInstaller(components: Plugin[]) {
  const installer = (app: App) => each(components, (c) => app.use(c));
  return installer as Plugin;
}

/**
 *
 * @param component 接受一个类型为T的组件作为参数
 * @returns 返回一个新的组件，这个组件的install方法会接受一个app参数，用于将新组件注册到Vue应用程序中
 *
 * 实现原理：
 * 1. 通过类型断言将组件转换为SFCWithInstall<T>类型，SFCWithInstall是一个类型，继承原始组件的类型，并添加install方法
 * 2. 在install方法中，获取组件名称，使用app.component方法将组件注册到Vue应用程序中。
 *    app.component接受三个参数：组件名称、组件实例、是否全局注册。这样就可以在应用程序中使用<component-name>标签来渲染组件。
 * 3. 返回新的组件，它具有intall方法
 *
 * 使用示例：export const MelonButton = withInstall(Button)
 */
export const withInstall = <T>(component: T) => {
  (component as SFCWithInstall<T>).install = (app: App) => {
    const name = (component as any).name;
    app.component(name, component as Plugin);
  };
  return component as SFCWithInstall<T>;
};

export const withInstallFunction = <T>(fn: T, name: string) => {
  (fn as SFCWithInstall<T>).install = (app: App) => {
    app.config.globalProperties[name] = fn;
  };
  return fn as SFCWithInstall<T>;
};

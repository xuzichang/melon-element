import { describe, it, expect, test, vi, beforeEach } from "vitest";
import { MelonDropdown, MelonDropdownItem, type DropdownItemProps } from ".";
import Dropdown from "./Dropdown.vue";
import DropdownItem from "./DropdownItem.vue";
import { withInstall } from "@melon-element/utils";
import { mount } from "@vue/test-utils";

vi.mock("@popperjs/core");

describe("Dropdown/index.ts", () => {
  // 测试 withInstall 函数是否被正确应用
  it("should be exported with withInstall", () => {
    expect(MelonDropdown.install).toBeDefined();
    expect(MelonDropdownItem.install).toBeDefined();
  });
  // 测试 Dropdown 组件是否被正确导出
  it("should be exported Dropdown component", () => {
    expect(MelonDropdown).toBe(Dropdown);
    expect(MelonDropdownItem).toBe(DropdownItem);
  });
  // 可选：测试 withInstall 是否增强了 Tooltip 组件的功能
  test("should enhance Dropdown component", () => {
    const enhanceDropdown = withInstall(Dropdown);
    expect(enhanceDropdown).toBe(MelonDropdown);
    // 这里可以添加更多测试，确保 withInstall 增强了组件的特定功能
  });
  // 可选：如果你的 withInstall 函数有特定的行为或属性，确保它们被正确应用
  test("should apply specific enhancements", () => {
    const enhanceDropdown = withInstall(Dropdown);
    // 例如，如果你的 withInstall 增加了一个特定的方法或属性
    expect(enhanceDropdown).toHaveProperty("install");
  });
});

describe("Dropdown.vue", () => {
  // 在每个测试之前执行
  beforeEach(() => {
    // 使用虚拟定时器
    vi.useFakeTimers();
    // 清除所有模拟
    vi.clearAllMocks();
  });
  // 测试渲染插槽是否正确
  it("should render slots correctly", () => {
    // 定义下拉菜单项
    const items: DropdownItemProps[] = [
      { label: "Item 1", command: "item1" },
      { label: "Item 2", command: "item2" },
    ];
    // 挂载Dropdown组件，并传入props和slots
    const wrapper = mount(Dropdown, {
      props: {
        trigger: "click",
      },
      slots: {
        default: () => <button id="trigger">Default slot content</button>,
        dropdown: () => items.map((item) => <DropdownItem {...item} />),
      },
    });

    // 断言渲染的文本包含默认插槽内容
    expect(wrapper.text()).toContain("Default slot content");
    // 断言渲染的DOM中存在melon-dropdown类
    expect(wrapper.find(".melon-dropdown").exists()).toBeTruthy();
  });

  it("should emit command event when item is clicked", async () => {
    // 创建一个DropdownItemProps数组，包含两个对象，分别表示两个下拉菜单项
    const items: DropdownItemProps[] = [
      { label: "Item 1", disabled: true },
      { label: "Item 2", command: "item2", divided: true },
    ];
    // 创建一个mock函数，用于模拟onCommand事件
    const onCommand = vi.fn();
    // 使用mount函数创建一个Dropdown组件的实例，并传入props和slots
    const wrapper = mount(Dropdown, {
      props: {
        trigger: "click",
        onCommand,
      },
      slots: {
        default: () => <button id="trigger">Defalut slot content</button>,
        dropdown: () => items.map((item) => <DropdownItem {...item} />),
      },
    });
    // 使用find函数找到id为trigger的元素
    const triggerArea = wrapper.find("#trigger");
    // 断言triggerArea元素存在
    expect(triggerArea.exists()).toBeTruthy();

    // 模拟点击triggerArea元素
    triggerArea.trigger("click");
    // 等待所有定时器执行完毕
    await vi.runAllTimers();

    // 断言下拉菜单存在
    expect(wrapper.find(".melon-dropdown__menu").exists()).toBeTruthy();
    // 模拟点击第一个下拉菜单项
    await wrapper.findAll("li").at(0)?.trigger("click");
    // 断言onCommand函数没有被调用
    expect(onCommand).toBeCalledTimes(0); // disabled

    // 模拟点击第三个下拉菜单项
    await wrapper.findAll("li").at(2)?.trigger("click");
    // 断言onCommand函数被调用，并且参数为"item2"
    expect(onCommand).toBeCalled();
    expect(onCommand).toBeCalledWith("item2");
  });

  it("should toggle visibility when split btn is clicked", async () => {
    // 创建一个DropdownItemProps类型的数组，包含两个对象，分别表示两个下拉菜单项
    const items: DropdownItemProps[] = [
      { label: "Item 1" },
      { label: "Item 2", command: "item2" },
    ];
    // 创建一个模拟的onClick函数
    const onClick = vi.fn();
    // 使用mount函数创建一个Dropdown组件的实例，并传入props和slots参数
    const wrapper = mount(Dropdown, {
      props: {
        trigger: "click",
        splitButton: true,
        items: items,
        onClick,
      },
      slots: {
        default: () => <div id="trigger">Default slot content</div>,
      },
    });  
    // 使用find函数找到id为"trigger"的元素
    const triggerArea = wrapper.find("#trigger");
    // 断言该元素存在
    expect(triggerArea.exists()).toBeTruthy();
    // 触发该元素的click事件
    triggerArea.trigger("click");
    // 运行所有的定时器
    await vi.runAllTimers();

    // 断言下拉菜单存在
    expect(wrapper.find(".melon-dropdown__menu").exists()).toBeFalsy();
    // 断言onClick函数被调用
    expect(onClick).toBeCalled();
  });
  // it("should toggle visibility when split btn is clicked", async () => {
  //   const items: DropdownItemProps[] = [
  //     { label: "Item 1" },
  //     { label: "Item 2", command: "item2" },
  //   ];
  //   const onClick = vi.fn();
  //   const wrapper = mount(Dropdown, {
  //     props: {
  //       trigger: "click",
  //       splitButton: true,
  //       items: items,
  //       onClick,
  //     },
  //     slots: {
  //       default: () => <div id="trigger">Default slot content</div>,
  //     },
  //   });

  //   const triggerArea = wrapper.find("#trigger");
  //   expect(triggerArea.exists()).toBeTruthy();
  //   triggerArea.trigger("click");
  //   await vi.runAllTimers();

  //   expect(wrapper.find(".melon-dropdown__menu").exists()).toBeFalsy();
  //   expect(onClick).toBeCalled();
  // });
});
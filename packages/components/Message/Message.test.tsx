import { describe, test, expect } from "vitest";
import { message, closeAll } from "./methods";
import { nextTick } from "vue";
export const rAF = () => {
  return new Promise((res) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        res(null);
        await nextTick();
      });
    });
  });
};
function getTopValue(element: Element) {
  const styles = window.getComputedStyle(element);
  const topValue = styles.getPropertyValue("top");
  return Number.parseFloat(topValue);
}
describe("createMessage", () => {
  test("调用方法应该创建对应的 Message 组件", async () => {
    const handler = message({ message: "hello msg", duration: 0 });
    await rAF();
    expect(document.querySelector(".melon-message")).toBeTruthy();
    handler.close();
    await rAF();
    expect(document.querySelector(".melon-message")).toBeFalsy();
  });

  test("多次调用应该创建多个实例", async () => {
    message({ message: "hello msg", duration: 0 });
    message({ message: "hello msg2", duration: 0 });
    await rAF();
    expect(document.querySelectorAll(".melon-message").length).toBe(2);
    closeAll();
    await rAF();
    expect(document.querySelectorAll(".melon-message").length).toBe(0);
  });

  test("创建多个实例应该设置正确的offset", async () => {
    message({ message: "hello msg", duration: 0, offset: 100 });
    message({ message: "hello msg2", duration: 0, offset: 50 });
    await rAF();
    const elements = document.querySelectorAll(".melon-message");
    expect(elements.length).toBe(2);
    // jsdom 中获取height的数值都为0
    expect(getTopValue(elements[0])).toBe(100);
    expect(getTopValue(elements[1])).toBe(150);
  });
});

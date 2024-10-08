import { describe, test, expect } from "vitest";
import { notification, closeAll } from "./methods";
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
describe("createNotification", () => {
  test("调用方法应该创建对应的 Notification 组件", async () => {
    const handler = notification({ message: "hello notification", duration: 0 });
    await rAF();
    expect(document.querySelector(".melon-notification")).toBeTruthy();
    handler.close();
    await rAF();
    expect(document.querySelector(".melon-notification")).toBeFalsy();
  });

  test("多次调用应该创建多个实例", async () => {
    notification({ message: "hello notification", duration: 0 });
    notification({ message: "hello notification2", duration: 0 });
    await rAF();
    expect(document.querySelectorAll(".melon-notification").length).toBe(2);
    closeAll();
    await rAF();
    expect(document.querySelectorAll(".melon-notification").length).toBe(0);
  });

  test("创建多个实例应该设置正确的offset", async () => {
    notification({ message: "hello notification", duration: 0, offset: 100 });
    notification({ message: "hello notification2", duration: 0, offset: 50 });
    await rAF();
    const elements = document.querySelectorAll(".melon-notification");
    expect(elements.length).toBe(2);
    // jsdom 中获取height的数值都为0
    expect(getTopValue(elements[0])).toBe(100);
    expect(getTopValue(elements[1])).toBe(150);
  });
});

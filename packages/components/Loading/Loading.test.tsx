import { describe, it, expect } from "vitest";
import { nextTick } from "vue";
import { Loading } from "./service";
export const rAF = async () => {
  return new Promise((res) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(async () => {
        res(null);
        await nextTick();
      });
    });
  });
};
describe("Loading", () => {
  it("should create Loading instance", () => {
    const instance = Loading();
    expect(instance).toBeTruthy();
  });
  it("should render mask", async () => {
    Loading();
    await rAF();
    expect(document.querySelector(".melon-loading__mask")).toBeTruthy();
  });
  it("should close Loading and remove it from DOM", async () => {
    const instance = Loading();
    await rAF();
    expect(document.querySelector(".melon-loading")).toBeTruthy();
    instance.close();
    await rAF();
    expect(document.querySelector(".melon-loading")).toBeFalsy();
  });
});

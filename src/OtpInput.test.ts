import { describe, it, expect } from "vitest";
import { mount } from "@vue/test-utils";
import OtpInput from "./OtpInput.vue";

describe("OtpInput", () => {
  it("renders correct number of inputs", () => {
    const wrapper = mount(OtpInput, { props: { length: 6 } });
    expect(wrapper.findAll("input").length).toBe(6);
  });

  it("renders 4 inputs when length=4", () => {
    const wrapper = mount(OtpInput, { props: { length: 4 } });
    expect(wrapper.findAll("input").length).toBe(4);
  });

  it("emits update:modelValue on digit input", async () => {
    const wrapper = mount(OtpInput, { props: { length: 6 } });
    const input = wrapper.findAll("input")[0];
    await input.setValue("1");
    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    const emitted = wrapper.emitted("update:modelValue")!;
    expect(emitted[emitted.length - 1][0]).toContain("1");
  });

  it("emits complete when all digits filled", async () => {
    const wrapper = mount(OtpInput, { props: { length: 4 } });
    const inputs = wrapper.findAll("input");
    await inputs[0].setValue("1");
    await inputs[1].setValue("2");
    await inputs[2].setValue("3");
    await inputs[3].setValue("4");
    expect(wrapper.emitted("complete")).toBeTruthy();
    expect(wrapper.emitted("complete")![0][0]).toBe("1234");
  });

  it("syncs from modelValue prop", () => {
    const wrapper = mount(OtpInput, { props: { length: 4, modelValue: "5678" } });
    const inputs = wrapper.findAll("input");
    expect((inputs[0].element as HTMLInputElement).value).toBe("5");
    expect((inputs[1].element as HTMLInputElement).value).toBe("6");
    expect((inputs[2].element as HTMLInputElement).value).toBe("7");
    expect((inputs[3].element as HTMLInputElement).value).toBe("8");
  });

  it("rejects non-digit input in number mode", async () => {
    const wrapper = mount(OtpInput, { props: { length: 4, type: "number" } });
    const input = wrapper.findAll("input")[0];
    await input.setValue("a");
    // Should not emit with 'a'
    const emitted = wrapper.emitted("update:modelValue");
    if (emitted) {
      const lastValue = emitted[emitted.length - 1][0] as string;
      expect(lastValue).not.toContain("a");
    }
  });

  it("accepts letters in text mode", async () => {
    const wrapper = mount(OtpInput, { props: { length: 4, type: "text" } });
    const input = wrapper.findAll("input")[0];
    await input.setValue("A");
    const emitted = wrapper.emitted("update:modelValue")!;
    expect(emitted[emitted.length - 1][0]).toContain("A");
  });

  it("applies disabled state", () => {
    const wrapper = mount(OtpInput, { props: { length: 4, disabled: true } });
    const inputs = wrapper.findAll("input");
    inputs.forEach((input) => {
      expect((input.element as HTMLInputElement).disabled).toBe(true);
    });
    expect(wrapper.classes()).toContain("otp-disabled");
  });

  it("applies error class", () => {
    const wrapper = mount(OtpInput, { props: { length: 4, error: true } });
    expect(wrapper.classes()).toContain("otp-error");
  });

  it("applies variant class", () => {
    const wrapper = mount(OtpInput, { props: { length: 4, variant: "filled" } });
    expect(wrapper.classes()).toContain("otp-filled");
  });

  it("applies size class", () => {
    const wrapper = mount(OtpInput, { props: { length: 4, size: "lg" } });
    expect(wrapper.classes()).toContain("otp-lg");
  });

  it("renders separator", () => {
    const wrapper = mount(OtpInput, { props: { length: 6, separator: "-" } });
    const separators = wrapper.findAll(".otp-separator");
    expect(separators.length).toBeGreaterThan(0);
    expect(separators[0].text()).toBe("-");
  });

  it("handles paste of full code", async () => {
    const wrapper = mount(OtpInput, { props: { length: 6 } });
    const input = wrapper.findAll("input")[0];
    await input.trigger("paste", {
      clipboardData: { getData: () => "123456" },
    });
    expect(wrapper.emitted("complete")).toBeTruthy();
    expect(wrapper.emitted("complete")![0][0]).toBe("123456");
  });

  it("handles paste of partial code", async () => {
    const wrapper = mount(OtpInput, { props: { length: 6 } });
    const input = wrapper.findAll("input")[2];
    await input.trigger("paste", {
      clipboardData: { getData: () => "78" },
    });
    const emitted = wrapper.emitted("update:modelValue")!;
    const lastValue = emitted[emitted.length - 1][0] as string;
    expect(lastValue).toContain("78");
  });

  it("exposes clear method", async () => {
    const wrapper = mount(OtpInput, { props: { length: 4, modelValue: "1234" } });
    (wrapper.vm as any).clear();
    await wrapper.vm.$nextTick();
    const emitted = wrapper.emitted("update:modelValue")!;
    expect(emitted[emitted.length - 1][0]).toBe("");
  });

  it("exposes getValue method", () => {
    const wrapper = mount(OtpInput, { props: { length: 4, modelValue: "5678" } });
    expect((wrapper.vm as any).getValue()).toBe("5678");
  });
});

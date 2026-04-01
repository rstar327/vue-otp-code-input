<template>
  <div :class="containerClass" :style="containerStyle">
    <template v-for="(_, index) in length" :key="index">
      <input
        ref="inputRefs"
        type="text"
        :inputmode="type === 'number' ? 'numeric' : 'text'"
        :pattern="type === 'number' ? '[0-9]*' : undefined"
        :class="inputClass(index)"
        :style="inputStyle"
        :value="digits[index] || ''"
        :placeholder="placeholderChar"
        :disabled="disabled"
        :readonly="readonly"
        :aria-label="`${ariaLabel} digit ${index + 1}`"
        autocomplete="one-time-code"
        @input="onInput(index, $event)"
        @keydown="onKeyDown(index, $event)"
        @focus="onFocus(index, $event)"
        @blur="onBlur(index, $event)"
        @paste="onPaste(index, $event)"
      />
      <span v-if="separator && separatorPositions.includes(index + 1)" class="otp-separator">{{ separator }}</span>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick } from "vue";

export interface OtpInputProps {
  modelValue?: string;
  length?: number;
  type?: "number" | "text" | "password";
  placeholder?: string;
  disabled?: boolean;
  readonly?: boolean;
  autofocus?: boolean;
  separator?: string;
  separatorPosition?: number[];
  error?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "outline" | "filled" | "underline";
  ariaLabel?: string;
}

const props = withDefaults(defineProps<OtpInputProps>(), {
  modelValue: "",
  length: 6,
  type: "number",
  placeholder: "",
  disabled: false,
  readonly: false,
  autofocus: false,
  separator: "",
  separatorPosition: () => [],
  error: false,
  size: "md",
  variant: "outline",
  ariaLabel: "OTP",
});

const emit = defineEmits<{
  (e: "update:modelValue", value: string): void;
  (e: "complete", value: string): void;
  (e: "change", value: string): void;
  (e: "focus", index: number, event: FocusEvent): void;
  (e: "blur", index: number, event: FocusEvent): void;
}>();

const inputRefs = ref<HTMLInputElement[]>([]);
const digits = ref<string[]>(Array(props.length).fill(""));
const focusedIndex = ref(-1);

// Computed
const placeholderChar = computed(() => props.placeholder || (props.type === "password" ? "" : ""));

const separatorPositions = computed(() => {
  if (!props.separator) return [];
  if (props.separatorPosition && props.separatorPosition.length > 0) {
    return props.separatorPosition;
  }
  // Default: separator in the middle (e.g. 3 for 6-digit)
  const mid = Math.floor(props.length / 2);
  return [mid];
});

const containerClass = computed(() => [
  "otp-container",
  `otp-${props.size}`,
  `otp-${props.variant}`,
  {
    "otp-error": props.error,
    "otp-disabled": props.disabled,
  },
]);

const containerStyle = computed(() => ({
  "--otp-length": props.length,
}));

const inputStyle = computed(() => {
  const sizes = { sm: "36px", md: "48px", lg: "56px" };
  const fonts = { sm: "16px", md: "20px", lg: "24px" };
  return {
    width: sizes[props.size],
    height: sizes[props.size],
    fontSize: fonts[props.size],
  };
});

function inputClass(index: number) {
  return [
    "otp-input",
    {
      "otp-input--focused": focusedIndex.value === index,
      "otp-input--filled": !!digits.value[index],
      "otp-input--error": props.error,
    },
  ];
}

// Methods
function isValidChar(char: string): boolean {
  if (props.type === "number") return /^\d$/.test(char);
  return char.length === 1;
}

function setDigit(index: number, value: string) {
  const newDigits = [...digits.value];
  newDigits[index] = value;
  digits.value = newDigits;
  emitValue();
}

function emitValue() {
  const value = digits.value.join("");
  emit("update:modelValue", value);
  emit("change", value);
  if (value.length === props.length && digits.value.every(Boolean)) {
    emit("complete", value);
  }
}

function focusInput(index: number) {
  nextTick(() => {
    const input = inputRefs.value[index];
    if (input) {
      input.focus();
      input.select();
    }
  });
}

function onInput(index: number, event: Event) {
  const input = event.target as HTMLInputElement;
  const value = input.value;

  // Handle multi-char input (some mobile keyboards)
  if (value.length > 1) {
    const chars = value.split("").filter(isValidChar);
    for (let i = 0; i < chars.length && index + i < props.length; i++) {
      setDigit(index + i, chars[i]);
    }
    const nextIndex = Math.min(index + chars.length, props.length - 1);
    focusInput(nextIndex);
    return;
  }

  if (value && isValidChar(value)) {
    setDigit(index, value);
    if (index < props.length - 1) {
      focusInput(index + 1);
    }
  } else if (!value) {
    // Cleared via backspace on some browsers
    setDigit(index, "");
  } else {
    // Invalid char — restore
    input.value = digits.value[index] || "";
  }
}

function onKeyDown(index: number, event: KeyboardEvent) {
  switch (event.key) {
    case "Backspace":
      event.preventDefault();
      if (digits.value[index]) {
        setDigit(index, "");
      } else if (index > 0) {
        setDigit(index - 1, "");
        focusInput(index - 1);
      }
      break;

    case "Delete":
      event.preventDefault();
      setDigit(index, "");
      break;

    case "ArrowLeft":
      event.preventDefault();
      if (index > 0) focusInput(index - 1);
      break;

    case "ArrowRight":
      event.preventDefault();
      if (index < props.length - 1) focusInput(index + 1);
      break;

    case "Home":
      event.preventDefault();
      focusInput(0);
      break;

    case "End":
      event.preventDefault();
      focusInput(props.length - 1);
      break;

    default:
      if (isValidChar(event.key)) {
        // If all digits filled, block further input
        const allFilled = digits.value.every(Boolean);
        if (allFilled && index === props.length - 1) {
          event.preventDefault();
          return;
        }
        // Replace current filled digit and move forward
        if (digits.value[index]) {
          event.preventDefault();
          setDigit(index, event.key);
          if (index < props.length - 1) {
            focusInput(index + 1);
          }
        }
      }
  }
}

function onPaste(index: number, event: ClipboardEvent) {
  event.preventDefault();
  const pasted = event.clipboardData?.getData("text") ?? "";
  const chars = pasted.split("").filter(isValidChar);

  if (chars.length === 0) return;

  // If pasting full code, start from index 0
  const startIndex = chars.length >= props.length ? 0 : index;

  const newDigits = [...digits.value];
  for (let i = 0; i < chars.length && startIndex + i < props.length; i++) {
    newDigits[startIndex + i] = chars[i];
  }
  digits.value = newDigits;
  emitValue();

  // Focus the next empty or last filled
  const nextEmpty = newDigits.findIndex((d, i) => i >= startIndex && !d);
  focusInput(nextEmpty >= 0 ? nextEmpty : Math.min(startIndex + chars.length - 1, props.length - 1));
}

function onFocus(index: number, event: FocusEvent) {
  focusedIndex.value = index;
  // Select content on focus
  (event.target as HTMLInputElement).select();
  emit("focus", index, event);
}

function onBlur(index: number, event: FocusEvent) {
  focusedIndex.value = -1;
  emit("blur", index, event);
}

// Sync from v-model
function syncFromModelValue(value: string) {
  const chars = value.split("");
  const newDigits = Array(props.length).fill("");
  for (let i = 0; i < chars.length && i < props.length; i++) {
    if (isValidChar(chars[i])) {
      newDigits[i] = chars[i];
    }
  }
  digits.value = newDigits;
}

// Watchers
watch(() => props.modelValue, (val) => {
  if (val !== digits.value.join("")) {
    syncFromModelValue(val);
  }
}, { immediate: true });

watch(() => props.length, (newLen) => {
  const current = digits.value;
  digits.value = Array(newLen).fill("").map((_, i) => current[i] || "");
});

// Lifecycle
onMounted(() => {
  if (props.autofocus && !props.disabled) {
    focusInput(0);
  }
});

// Expose
defineExpose({
  focus: (index = 0) => focusInput(index),
  clear: () => {
    digits.value = Array(props.length).fill("");
    emitValue();
    focusInput(0);
  },
  getValue: () => digits.value.join(""),
});
</script>

<style>
.otp-container {
  display: inline-flex;
  align-items: center;
  gap: 8px;
}
.otp-container.otp-sm { gap: 6px; }
.otp-container.otp-lg { gap: 10px; }
.otp-disabled { opacity: 0.5; pointer-events: none; }

/* Base input */
.otp-input {
  text-align: center;
  font-family: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace;
  font-weight: 600;
  border: none;
  outline: none;
  background: transparent;
  caret-color: #3b82f6;
  transition: border-color 0.15s, box-shadow 0.15s, background-color 0.15s;
  -moz-appearance: textfield;
}
.otp-input::-webkit-outer-spin-button,
.otp-input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}
.otp-input::placeholder {
  color: #ccc;
  font-weight: 400;
}

/* Outline variant */
.otp-outline .otp-input {
  border: 2px solid #d1d5db;
  border-radius: 8px;
}
.otp-outline .otp-input--focused {
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.otp-outline .otp-input--filled {
  border-color: #9ca3af;
}
.otp-outline .otp-input--error {
  border-color: #ef4444;
}
.otp-outline .otp-input--error.otp-input--focused {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

/* Filled variant */
.otp-filled .otp-input {
  background: #f3f4f6;
  border: 2px solid transparent;
  border-radius: 8px;
}
.otp-filled .otp-input--focused {
  background: #fff;
  border-color: #3b82f6;
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.15);
}
.otp-filled .otp-input--filled {
  background: #e5e7eb;
}
.otp-filled .otp-input--error {
  background: #fef2f2;
  border-color: #ef4444;
}

/* Underline variant */
.otp-underline .otp-input {
  border-bottom: 2px solid #d1d5db;
  border-radius: 0;
}
.otp-underline .otp-input--focused {
  border-bottom-color: #3b82f6;
}
.otp-underline .otp-input--filled {
  border-bottom-color: #6b7280;
}
.otp-underline .otp-input--error {
  border-bottom-color: #ef4444;
}

/* Separator */
.otp-separator {
  color: #9ca3af;
  font-size: 20px;
  font-weight: 300;
  user-select: none;
  line-height: 1;
}

/* Password type */
input[type="password"].otp-input {
  font-size: 28px;
}
</style>

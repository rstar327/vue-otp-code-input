# vue-otp-code-input

Vue 3 OTP / verification code input component. Zero dependencies, fully typed, with auto-focus, paste support, and multiple style variants.

## Features

- Auto-focus next input on digit entry
- Full paste support (paste full code or partial, from any position)
- Backspace moves to previous input
- Arrow keys, Home, End navigation
- 3 style variants: `outline`, `filled`, `underline`
- 3 sizes: `sm`, `md`, `lg`
- Number-only or alphanumeric mode
- Password/masked mode
- Separator support (e.g. `123 - 456`)
- Error state
- v-model support
- `complete` event when all digits filled
- Exposed `focus()`, `clear()`, `getValue()` methods
- Full TypeScript support
- Zero dependencies

## Install

```bash
npm install vue-otp-code-input
```

## Quick Start

```vue
<template>
  <OtpInput
    v-model="code"
    :length="6"
    autofocus
    @complete="onComplete"
  />
</template>

<script setup>
import { ref } from 'vue'
import { OtpInput } from 'vue-otp-code-input'
import 'vue-otp-code-input/style.css'

const code = ref('')

function onComplete(value) {
  console.log('Code entered:', value)
  // verify OTP...
}
</script>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `modelValue` | `string` | `""` | The OTP value (v-model) |
| `length` | `number` | `6` | Number of digits |
| `type` | `"number" \| "text" \| "password"` | `"number"` | Input type. `number` restricts to digits only |
| `placeholder` | `string` | `""` | Placeholder character for each box |
| `disabled` | `boolean` | `false` | Disable all inputs |
| `readonly` | `boolean` | `false` | Make inputs readonly |
| `autofocus` | `boolean` | `false` | Focus first input on mount |
| `separator` | `string` | `""` | Separator character (e.g. `"-"`, `"."`) |
| `separatorPosition` | `number[]` | `[]` | Positions after which to show separator. Default: middle |
| `error` | `boolean` | `false` | Show error state |
| `size` | `"sm" \| "md" \| "lg"` | `"md"` | Input size |
| `variant` | `"outline" \| "filled" \| "underline"` | `"outline"` | Visual style |
| `ariaLabel` | `string` | `"OTP"` | Aria label prefix |

## Events

| Event | Payload | Description |
|-------|---------|-------------|
| `update:modelValue` | `string` | Current value (v-model) |
| `complete` | `string` | Fired when all digits are filled |
| `change` | `string` | Fired on any change |
| `focus` | `index, FocusEvent` | Input focused |
| `blur` | `index, FocusEvent` | Input blurred |

## Exposed Methods

```vue
<template>
  <OtpInput ref="otpRef" v-model="code" />
  <button @click="otpRef?.clear()">Clear</button>
  <button @click="otpRef?.focus()">Focus</button>
</template>

<script setup>
import { ref } from 'vue'
import { OtpInput } from 'vue-otp-code-input'

const otpRef = ref()
const code = ref('')
</script>
```

| Method | Description |
|--------|-------------|
| `focus(index?)` | Focus input at index (default: 0) |
| `clear()` | Clear all digits and focus first input |
| `getValue()` | Get current value as string |

## Examples

### 4-digit PIN

```vue
<OtpInput v-model="pin" :length="4" size="lg" />
```

### With separator

```vue
<OtpInput v-model="code" :length="6" separator="-" />
```

### Custom separator position

```vue
<OtpInput v-model="code" :length="8" separator="-" :separator-position="[2, 5]" />
```

### Filled style

```vue
<OtpInput v-model="code" variant="filled" />
```

### Underline style

```vue
<OtpInput v-model="code" variant="underline" />
```

### Password / masked

```vue
<OtpInput v-model="code" type="password" />
```

### Alphanumeric

```vue
<OtpInput v-model="code" type="text" :length="5" />
```

### With error state

```vue
<OtpInput v-model="code" :error="hasError" />
<span v-if="hasError" style="color: red">Invalid code</span>
```

### With validation

```vue
<template>
  <OtpInput v-model="code" :error="!!error" @complete="verify" />
  <p v-if="error" style="color: red">{{ error }}</p>
</template>

<script setup>
import { ref } from 'vue'
import { OtpInput } from 'vue-otp-code-input'

const code = ref('')
const error = ref('')

async function verify(value) {
  try {
    await api.verifyOtp(value)
  } catch {
    error.value = 'Invalid verification code'
  }
}
</script>
```

## Styling

Import default styles:

```js
import 'vue-otp-code-input/style.css'
```

CSS classes for customization:

- `.otp-container` — wrapper
- `.otp-input` — individual input box
- `.otp-input--focused` — focused state
- `.otp-input--filled` — has a value
- `.otp-input--error` — error state
- `.otp-separator` — separator element
- `.otp-outline` / `.otp-filled` / `.otp-underline` — variant classes
- `.otp-sm` / `.otp-md` / `.otp-lg` — size classes

## License

MIT

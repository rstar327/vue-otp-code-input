<template>
  <div class="page">
    <header>
      <h1>vue-otp-code-input</h1>
      <p class="tagline">OTP / verification code input for Vue 3</p>
      <div class="badges">
        <a href="https://www.npmjs.com/package/vue-otp-code-input" target="_blank">
          <img src="https://img.shields.io/npm/v/vue-otp-code-input?color=blue" alt="npm" />
        </a>
        <a href="https://github.com/rstar327/vue-otp-code-input" target="_blank">
          <img src="https://img.shields.io/github/stars/rstar327/vue-otp-code-input?style=social" alt="GitHub" />
        </a>
      </div>
      <pre class="install">npm install vue-otp-code-input</pre>
    </header>

    <section>
      <h2>Basic (6 digits)</h2>
      <p class="desc">Default outline style. Try typing, pasting, or using arrow keys.</p>
      <div class="demo-row">
        <OtpInput v-model="otp1" autofocus @complete="onComplete" />
      </div>
      <div class="result">
        <span><b>Value:</b> {{ otp1 || '—' }}</span>
        <span><b>Complete:</b> {{ otp1.length === 6 ? 'Yes' : 'No' }}</span>
      </div>
    </section>

    <section>
      <h2>4-digit PIN</h2>
      <p class="desc">Large size, perfect for PIN entry.</p>
      <div class="demo-row">
        <OtpInput v-model="otp2" :length="4" size="lg" />
      </div>
      <div class="result">
        <span><b>Value:</b> {{ otp2 || '—' }}</span>
      </div>
    </section>

    <section>
      <h2>With separator</h2>
      <p class="desc">Dash separator in the middle.</p>
      <div class="demo-row">
        <OtpInput v-model="otp3" :length="6" separator="–" />
      </div>
      <div class="result">
        <span><b>Value:</b> {{ otp3 || '—' }}</span>
      </div>
    </section>

    <section>
      <h2>Custom separator positions</h2>
      <p class="desc">8 digits with separators after positions 2 and 5.</p>
      <div class="demo-row">
        <OtpInput v-model="otp4" :length="8" separator="-" :separator-position="[2, 5]" size="sm" />
      </div>
      <div class="result">
        <span><b>Value:</b> {{ otp4 || '—' }}</span>
      </div>
    </section>

    <section>
      <h2>Filled variant</h2>
      <p class="desc">Gray background, highlights on focus.</p>
      <div class="demo-row">
        <OtpInput v-model="otp5" variant="filled" />
      </div>
    </section>

    <section>
      <h2>Underline variant</h2>
      <p class="desc">Minimal underline style.</p>
      <div class="demo-row">
        <OtpInput v-model="otp6" variant="underline" />
      </div>
    </section>

    <section>
      <h2>Small size</h2>
      <div class="demo-row">
        <OtpInput v-model="otp7" size="sm" />
      </div>
    </section>

    <section>
      <h2>Error state</h2>
      <p class="desc">Click toggle to see the error state.</p>
      <div class="demo-row">
        <OtpInput v-model="otp8" :error="showError" />
      </div>
      <p v-if="showError" class="error-msg">Invalid verification code</p>
      <button class="btn" @click="showError = !showError">
        {{ showError ? 'Clear error' : 'Show error' }}
      </button>
    </section>

    <section>
      <h2>Alphanumeric</h2>
      <p class="desc">Accepts letters and numbers. 5 characters.</p>
      <div class="demo-row">
        <OtpInput v-model="otp9" :length="5" type="text" placeholder="?" />
      </div>
      <div class="result">
        <span><b>Value:</b> {{ otp9 || '—' }}</span>
      </div>
    </section>

    <section>
      <h2>With placeholder</h2>
      <div class="demo-row">
        <OtpInput v-model="otp10" placeholder="0" variant="filled" />
      </div>
    </section>

    <section>
      <h2>Disabled</h2>
      <div class="demo-row">
        <OtpInput model-value="123456" disabled />
      </div>
    </section>

    <section>
      <h2>Programmatic control</h2>
      <p class="desc">Use exposed methods to control the input.</p>
      <div class="demo-row">
        <OtpInput ref="controlRef" v-model="otp11" />
      </div>
      <div class="btn-row">
        <button class="btn" @click="controlRef?.focus()">Focus</button>
        <button class="btn" @click="controlRef?.clear()">Clear</button>
      </div>
    </section>

    <footer>
      <a href="https://github.com/rstar327/vue-otp-code-input" target="_blank">GitHub</a>
      <span>|</span>
      <a href="https://www.npmjs.com/package/vue-otp-code-input" target="_blank">npm</a>
      <span>|</span>
      <span>MIT License</span>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { OtpInput } from "../src/index";

const otp1 = ref("");
const otp2 = ref("");
const otp3 = ref("");
const otp4 = ref("");
const otp5 = ref("");
const otp6 = ref("");
const otp7 = ref("");
const otp8 = ref("");
const otp9 = ref("");
const otp10 = ref("");
const otp11 = ref("");
const showError = ref(false);
const controlRef = ref<InstanceType<typeof OtpInput>>();

function onComplete(value: string) {
  console.log("OTP complete:", value);
}
</script>

<style>
@import "../dist/vue-otp-code-input.css";

* { margin: 0; padding: 0; box-sizing: border-box; }
body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background: #f5f5f5;
  color: #222;
  line-height: 1.6;
}
.page {
  max-width: 560px;
  margin: 0 auto;
  padding: 48px 24px 80px;
}
header { text-align: center; margin-bottom: 48px; }
h1 { font-size: 32px; font-weight: 700; margin-bottom: 4px; }
.tagline { color: #666; font-size: 16px; margin-bottom: 16px; }
.badges { display: flex; gap: 8px; justify-content: center; margin-bottom: 16px; }
.badges img { height: 20px; }
.install {
  display: inline-block;
  background: #1a1a2e;
  color: #e0e0e0;
  padding: 10px 20px;
  border-radius: 8px;
  font-size: 14px;
  font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
}

section {
  background: #fff;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.06);
}
h2 { font-size: 16px; font-weight: 600; color: #333; margin-bottom: 4px; }
.desc { font-size: 13px; color: #888; margin-bottom: 14px; }
.demo-row { display: flex; justify-content: center; padding: 8px 0; }
.result {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 12px;
  font-size: 13px;
  color: #555;
  justify-content: center;
}
.error-msg { color: #ef4444; font-size: 13px; margin-top: 8px; text-align: center; }
.btn {
  margin-top: 10px;
  padding: 6px 16px;
  border: 1px solid #d0d5dd;
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 13px;
  transition: background 0.1s;
}
.btn:hover { background: #f5f5f5; }
.btn-row { display: flex; gap: 8px; justify-content: center; margin-top: 10px; }

footer {
  text-align: center;
  margin-top: 48px;
  font-size: 13px;
  color: #999;
}
footer a { color: #666; text-decoration: none; }
footer a:hover { color: #333; text-decoration: underline; }
footer span { margin: 0 6px; }
</style>

<template>
  <body>
    <h1>Generate Mockup Data</h1>
    <div class="container">
      <div class="w-100">
        <div class="d-flex w-50 gap-4">
          <BFormSelect v-model="primaryKey" :options="optionsPrimaryKey" />

          <BFormInput v-model="quantity" placeholder="Enter quantity" />
        </div>
        <div class="block-code">
          <code-editor v-model="originalCode" />
        </div>
      </div>
      <div class="w-100">
        <div class="d-flex justify-content-end">
          <BPopover click placement="top" body="Copied">
            <template #target>
              <BButton
                size="sm"
                variant="outline-primary"
                :disabled="!targetCode"
                @click="handleCopy"
                >Copy</BButton
              >
            </template>
          </BPopover>
        </div>
        <div class="block-code">
          <code-editor v-model="targetCode" readonly />
        </div>
      </div>
    </div>
    <div class="container">
      <BButton variant="success" :disabled="isDisabledSubmit" @click="getCode"
        >Generate</BButton
      >
    </div>
  </body>
</template>
<script setup>
import CodeEditor from "./components/CodeEditor.vue";
import { computed, ref } from "vue";

const originalCode = ref("");
const targetCode = ref("");
const primaryKey = ref(null);
const quantity = ref("");

const isDisabledSubmit = computed(() => {
  try {
    const parsed = JSON.parse(originalCode.value);
    return !parsed;
  } catch (e) {
    return true;
  }
});

const optionsPrimaryKey = computed(() => {
  try {
    const parsed = JSON.parse(originalCode.value);
    const keys = Object.keys(parsed);

    const arrKeys = keys.map((key) => ({ value: key, text: key }));
    return [{ value: null, text: "Primary key" }, ...arrKeys];
  } catch (error) {
    return [{ value: null, text: "Primary key" }];
  }
});

const getCode = () => {
  if (!quantity.value) quantity.value = 1;

  let jsonOriginal;
  jsonOriginal = JSON.parse(originalCode.value);

  const pushData = [];

  for (let i = 0; i < quantity.value; i++) {
    const obj = {};

    for (const [key, value] of Object.entries(jsonOriginal)) {
      if (key === primaryKey.value) {
        obj[key] = typeof value === "number" ? value + 1 : `${value}_${i}`;
      } else if (typeof value === "string") {
        obj[key] = `${value}_${i}`;
      }
    }

    pushData.push(obj);
  }

  targetCode.value = JSON.stringify(pushData, null, 2);
};

const handleCopy = async () => {
  await navigator.clipboard.writeText(targetCode.value);
};
</script>

<style scoped>
body {
  font-family: "Poppins", sans-serif;
  margin: 0;
  height: 100vh;
  padding: 2rem;
  background: linear-gradient(to right, #eef2f3, #ffffff);
  color: #333;
}
h1 {
  text-align: center;
  margin-bottom: 2rem;
  font-size: 2.5rem;
  color: #6c63ff;
}
.container {
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  margin-bottom: 2rem;
}
.block-code {
  overflow: hidden;
  width: 100%;
  border: 1px solid #ccc;
  border-radius: 16px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  resize: none;
  font-size: 1rem;
  margin-top: 2rem;
}
</style>

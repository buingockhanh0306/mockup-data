<template>
  <Title text="Generate JSON" />
  <div class="container">
    <div class="w-100">
      <div class="d-flex justify-content-between align-items-center gap-4">
        <div class="d-flex align-items-center gap-2">
          <label class="mb-0">Mode:</label>
          <BFormSelect
            v-model="mode"
            :options="optionsMode"
            class="form-select-sm element"
          />
        </div>
        <div class="d-flex align-items-center gap-2">
          <label class="mb-0">Primary key:</label>
          <BFormSelect
            v-model="primaryKey"
            :options="optionsPrimaryKey"
            class="form-select-sm element"
          />
        </div>
        <div class="d-flex align-items-center gap-2 w-25">
          <label class="mb-0">Quantity:</label>
          <BFormInput v-model="quantity" class="form-control-sm element" />
        </div>
      </div>

      <div class="block-code" v-if="mode === 'JSON'">
        <code-editor v-model="originalCode" />
      </div>
      <div v-else style="margin-top: 2rem">
        <div
          v-for="(item, index) in keysAndValues"
          :key="index"
          class="d-flex gap-4 align-items-center mb-2"
        >
          <BFormInput
            v-model="item.key"
            class="element"
            placeholder="Field name"
          />
          <BFormInput
            v-model="item.value"
            class="element"
            placeholder="Value"
          />
          <div
            class="circle"
            :class="{
              'circle-hidden': index !== keysAndValues.length - 1,
              'circle-disabled': !item.key,
            }"
            @click="handleAddField"
          >
            +
          </div>
        </div>
      </div>
    </div>
    <div class="w-100">
      <div class="d-flex justify-content-end">
        <BButton
          size="sm"
          class="me-2"
          variant="outline-danger"
          @click="handleClear"
          >Clear</BButton
        >
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
</template>
<script setup>
import Title from "@/components/Title.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import { computed, ref, watch } from "vue";

const originalCode = ref("");
const targetCode = ref("");
const primaryKey = ref(null);
const quantity = ref("");
const mode = ref("JSON");
const keysAndValues = ref([]);

const optionsMode = [
  { value: "JSON", text: "JSON" },
  { value: "fields", text: "Fields" },
];

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
    return [{ value: null, text: "Select primary key" }, ...arrKeys];
  } catch (error) {
    return [{ value: null, text: "Select primary key" }];
  }
});

watch(
  originalCode,
  () => {
    try {
      const parsed = JSON.parse(originalCode.value);
      keysAndValues.value = Object.entries(parsed).map(([key, value]) => ({
        key,
        value,
      }));
    } catch {
      keysAndValues.value = [{ key: "", value: "" }];
    }
  },
  { immediate: true }
);

watch(
  keysAndValues,
  (newList) => {
    if (!newList.length) return;

    const obj = {};
    newList.forEach(({ key, value }) => {
      if (key) obj[key] = value;
    });
    if (!Object.keys(obj).length) return;
    originalCode.value = JSON.stringify(obj, null, 2);
  },
  { deep: true }
);

const getCode = () => {
  if (!quantity.value) quantity.value = 1;

  let jsonOriginal;
  jsonOriginal = JSON.parse(originalCode.value);

  const pushData = [];

  for (let i = 0; i < quantity.value; i++) {
    const obj = {};

    for (const [key, value] of Object.entries(jsonOriginal)) {
      if (i === 0) {
        obj[key] = value;
        continue;
      }
      if (typeof value === "number") {
        obj[key] = key === primaryKey.value ? value + i : value;
      } else if (typeof value === "string") {
        obj[key] = `${value}_${i}`;
      }
    }

    pushData.push(obj);
  }

  targetCode.value = JSON.stringify(pushData, null, 2);
};

const handleAddField = () => {
  keysAndValues.value.push({ key: "", value: "" });
};

const handleCopy = async () => {
  await navigator.clipboard.writeText(targetCode.value);
};
const handleClear = () => {
  originalCode.value = "";
  targetCode.value = "";
  primaryKey.value = null;
  quantity.value = "";
};
</script>

<style scoped>
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
.circle {
  background: linear-gradient(to right, #6f42c1, #0dcaf0);
  border-radius: 50%;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 6px 12px;
  cursor: pointer;
}
.circle-disabled {
  background: #999;
  cursor: default;
  pointer-events: none;
}
.circle-hidden {
  visibility: hidden;
}
.element {
  box-shadow: 0 2px 3px rgba(0, 0, 0, 0.2);
}
</style>

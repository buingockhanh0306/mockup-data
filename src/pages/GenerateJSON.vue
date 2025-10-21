<template>
  <Title text="Generate JSON" />
  <div class="container">
  <div class="d-flex justify-content-between w-100">
    <div class="d-flex gap-4">
      <div class="d-flex align-items-center gap-2">
        <label class="mb-0">Mode:</label>
        <BFormSelect
            v-model="mode"
            :options="optionsMode"
            class="form-select-sm element"
        />
      </div>
      <div class="d-flex align-items-center gap-2">
        <label class="mb-0">{{mode === MODE_CONVERT.EXCEL ? 'Key:' : 'Primary key:'}}</label>
        <BFormSelect
            v-if="mode !== MODE_CONVERT.EXCEL"
            v-model="primaryKey"
            :options="optionsPrimaryKey"
            class="form-select-sm element"
        />
        <BFormSelect
            v-else
            v-model="keyColumn"
            :options="optionColumnExcel"
            class="form-select-sm element"
        />
      </div>
      <div class="d-flex align-items-center gap-2">
        <label class="mb-0">{{mode === MODE_CONVERT.EXCEL ? 'Value:' : 'Quantity:'}}</label>
        <BFormInput
            v-if="mode !== MODE_CONVERT.EXCEL"
            v-model="quantity"
            @keypress="onlyNumber"
            class="form-control-sm element"
        />
        <BFormSelect
            v-else
            v-model="valueColumn"
            :options="optionColumnExcel"
            class="form-select-sm element"
        />
      </div>
    </div>
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
  </div>
  </div>
  <div class="container">
    <div class="w-100">
      <div class="block-code" v-if="mode === MODE_CONVERT.JSON">
        <code-editor v-model="originalCode" />
      </div>
      <div v-else-if="mode === MODE_CONVERT.FIELDS" style="margin-top: 2rem">
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
      <div v-else-if="mode === MODE_CONVERT.EXCEL" style="margin-top: 2rem">
        <div
           class="drag-area d-flex gap-2"
           :style="{ border: getInfoFile.styleBorder }"
           @dragover.prevent="isDragging = true"
           @dragleave.prevent="isDragging = false"
           @drop.prevent="handleDrop"
        >
          <i :class="getInfoFile.classIcon"></i>
          <span :class="getInfoFile.classColor">{{getInfoFile.text}}</span>
          <span class="my-3" :class="getInfoFile.classColor">{{fileName}}</span>
          <input
              type="file"
              ref="fileInput"
              accept=".xls,.xlsx"
              @change="handleFileUpload($event)"
              style="display: none;"
          />
          <BButton class="c-button drag-area__btn" @click="triggerUpload">
            Upload
          </BButton
          >
        </div>

      </div>
    </div>
    <div class="w-100">

      <div class="block-code">
        <code-editor v-model="targetCode" readonly />
      </div>
    </div>
  </div>
  <div class="container">
    <BButton class="c-button" :disabled="isDisabledSubmit" @click="getCode"
      >Generate</BButton
    >
  </div>
</template>
<script setup>
import Title from "@/components/Title.vue";
import CodeEditor from "@/components/CodeEditor.vue";
import {computed, onMounted, ref, watch} from "vue";
import {MODE_CONVERT} from "@/constants/index.js";
import * as XLSX from "xlsx";

const originalCode = ref("");
const targetCode = ref("");
const primaryKey = ref(null);
const quantity = ref("");
const mode = ref("JSON");
const keysAndValues = ref([]);
const fileInput = ref(null);
const isDragging = ref(false);
const fileSelected = ref(null);
const optionColumnExcel = ref(['Please upload file']);
const keyColumn = ref(null);
const valueColumn = ref(null);
const isValidFile = ref(false);

const optionsMode = [
  { value: MODE_CONVERT.JSON, text: "JSON" },
  { value: MODE_CONVERT.FIELDS, text: "Fields" },
  { value: MODE_CONVERT.EXCEL, text: "Excel" },
];

const isDisabledSubmit = computed(() => {
  if(mode.value === MODE_CONVERT.EXCEL && fileSelected.value && isValidFile.value) return false
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

const getInfoFile = computed(()=>{
  if(fileSelected.value && !isValidFile.value) {
    return {
      text: "The uploaded file is invalid!",
      classColor: "text-danger",
      classIcon: "bi bi-x-octagon drag-area__icon text-danger",
      styleBorder: "2px dashed var(--error-color)"
    }
  } else if(fileSelected.value){
     return {
      text: "The file was uploaded successfully!",
      classColor: "text-success",
      classIcon: "bi bi-file-earmark-spreadsheet drag-area__icon text-success",
      styleBorder: "2px dashed var(--success-color)"
    }
  } else{
    return {
      text: "Drag & Drop To Upload Excel File",
      classColor: "text-primary",
      classIcon: "bi bi-cloud-arrow-up-fill drag-area__icon",
      styleBorder: "2px dashed var(--primary-color)"
    }
  }
})


const fileName = computed(()=>{
  return fileSelected.value ? fileSelected.value.name : "Or"
})

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

watch(
    [keyColumn, valueColumn],
    ([newKey, newValue], [oldKey, oldValue]) => {
      if (oldValue === "Please upload file") return
      getCode()
    }
)

const triggerUpload = ()=>{
  fileInput.value.click();
}

const handleDrop = async (event)=>{
  isDragging.value = false;
  const file = event.dataTransfer.files[0];
  isValidFile.value = await checkFileExcel(file);
  if (file) {
    readExcel(file);
  }
}
const handleFileUpload = async(event)=>{
  const file = event?.target?.files[0];
  isValidFile.value = await checkFileExcel(file);
  if (file) {
    readExcel(file);
  } else{
    console.log("not file")
  }
}

const readExcel = async (file)=>{
  fileSelected.value = file
  if(!isValidFile.value) {
    resetDataFile();
    return
  }
  const rows = await getRowsExcel(file)
  optionColumnExcel.value = rows[0];
  keyColumn.value = optionColumnExcel.value[0];
  valueColumn.value = optionColumnExcel.value[1];
}

const onlyNumber = (e) => {
  const char = String.fromCharCode(e.keyCode);
  if (!/[0-9]/.test(char)) {
    e.preventDefault();
  }
};

const getCode = async() => {
  if(mode.value === MODE_CONVERT.EXCEL){
    const result  = await convertExcelToJson(fileSelected.value)
    console.log(result);
    targetCode.value = JSON.stringify(result, null, 2);
    return;
  }
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
  fileSelected.value = null;
  resetDataFile()
};

const resetDataFile = () =>{
  optionColumnExcel.value = ['Please upload file'];
  keyColumn.value = optionColumnExcel.value[0];
  valueColumn.value = optionColumnExcel.value[0];
}

const checkFileExcel = async (file) => {
  const allowedExtensions = ['.xls', '.xlsx'];
  const fileName = file.name.toLowerCase();
  return allowedExtensions.some(ext => fileName.endsWith(ext));
}

const getRowsExcel = async(file) =>{
  const arrayBuffer = await file.arrayBuffer();
  const workbook = XLSX.read(arrayBuffer, { type: "array" });
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });
}


const convertExcelToJson = async (file, skipHeader = true)=>{
  const rows = await getRowsExcel(file)

  const result = {};
  const idxKey = optionColumnExcel.value.indexOf(keyColumn.value)
  const idxValue = optionColumnExcel.value.indexOf(valueColumn.value)
  const startRow = skipHeader ? 1 : 0;

  const setNested = (obj, pathArr, value) => {
    let cur = obj;
    for (let i = 0; i < pathArr.length; i++) {
      const key = String(pathArr[i]).trim();
      if (!key) continue;
      if (i === pathArr.length - 1) {
        cur[key] = value;
      } else {
        if (!cur[key] || typeof cur[key] !== "object") cur[key] = {};
        cur = cur[key];
      }
    }
  };

  for (let i = startRow; i < rows.length; i++) {
    const row = rows[i];
    if (!row) continue;

    const keyCell = row[idxKey];
    const valueCell = row[idxValue];
    console.log({ keyCell, value: valueCell });
    if (!keyCell || String(keyCell).trim() === "") continue;

    const pathArr = String(keyCell)
        .split(".")
        .map((s) => s.trim())
        .filter((s) => s);

    setNested(result, pathArr, valueCell ?? "");
  }
  return result;
}

onMounted(()=>{
  keyColumn.value = optionColumnExcel.value[0]
  valueColumn.value = optionColumnExcel.value[0]
})
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
.drag-area{
  width: 100%;
  border-radius: 15px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 514px;
}
.drag-area__icon{
  line-height: 6rem;
  font-size: 6rem;
  color: var(--primary-color);
}
.drag-area__btn{
  background: var(--primary-color);
}
.drag-area__btn:hover,
.drag-area__btn:active{
  background: var(--primary-color) !important;
  opacity: 0.8 !important;
}
</style>



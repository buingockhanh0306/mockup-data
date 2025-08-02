<template>
  <v-ace-editor
    v-model:value="innerValue"
    lang="json"
    theme="chrome"
    style="height: 500px"
    :readonly="readonly"
    :options="editorOptions"
  />
</template>

<script setup>
import { ref, defineProps, defineEmits, watch } from "vue";
import { VAceEditor } from "vue3-ace-editor";

import * as ace from "ace-builds";
import "ace-builds/src-noconflict/ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-chrome";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/worker-json";

ace.config.set("basePath", "/ace");

const editorOptions = {
  useWorker: true,
  fontSize: 16,
  enableBasicAutocompletion: true,
  enableLiveAutocompletion: true,
  enableSnippets: true,
};

const props = defineProps({
  modelValue: String,
  readonly: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits(["update:modelValue"]);

const innerValue = ref(props.modelValue || "");

watch(innerValue, (val) => {
  emit("update:modelValue", val);
});
watch(
  () => props.modelValue,
  (val) => {
    if (val !== innerValue.value) {
      innerValue.value = val;
    }
  }
);
</script>
<style lang="css" scoped>
.ace_editor {
  margin: 6px;
  border-radius: 16px;
}
</style>

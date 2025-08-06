<template>
  <Title text="Generate Text" />
  <div class="container">
    <div class="d-flex align-items-center mb-4 justify-content-between">
      <div class="d-flex gap-2 align-items-center">
        <label for="">Length: </label>
        <BFormInput
          v-model="inputLength"
          placeholder="Enter text length"
          @keypress="onlyNumber"
        />
        <BButton
          class="c-button"
          :disabled="!inputLength"
          @click="handleGenerateText"
          >Generate</BButton
        >
      </div>
      <div class="d-flex">
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
              :disabled="!generatedText"
              @click="handleCopy"
              >Copy</BButton
            >
          </template>
        </BPopover>
      </div>
    </div>
    <BFormTextarea
      v-model="generatedText"
      placeholder="Enter something..."
      @input="isShowWarning = false"
      @blur="handleBlurTextarea"
      rows="18"
    />
    <transition name="slide-down">
      <div
        class="warning-box text-warning mt-2"
        :class="{ 'is-visible': isShowWarning }"
      >
        <i class="bi bi-exclamation-circle"></i>
        <p>There is a space at the beginning or end of the text.</p>
      </div>
    </transition>
    <div class="d-flex mt-4 mx-auto justify-content-between w-80">
      <div>
        <label class="fs-4 me-3">Characters:</label>
        <label
          class="fs-3 text-success"
          style="min-width: 90px; display: inline-block"
          >{{ countTextLength }}</label
        >
      </div>
      <div>
        <label class="fs-4 me-3">Words:</label>
        <label
          class="fs-3 text-success"
          style="min-width: 90px; display: inline-block"
          >{{ countWords }}</label
        >
      </div>
      <div>
        <label class="fs-4 me-3">Sentences:</label>
        <label
          class="fs-3 text-success"
          style="min-width: 90px; display: inline-block"
          >{{ countSentences }}</label
        >
      </div>
      <div>
        <label class="fs-4 me-3">Paragraphs:</label>
        <label
          class="fs-3 text-success"
          style="min-width: 90px; display: inline-block"
          >{{ countParagraphs }}</label
        >
      </div>
      <div>
        <label class="fs-4 me-3">Spaces:</label>
        <label
          class="fs-3 text-success"
          style="min-width: 90px; display: inline-block"
          >{{ countSpaces }}</label
        >
      </div>
    </div>
  </div>
</template>
<script setup>
import { computed, ref } from "vue";
import Title from "@/components/Title.vue";

const generatedText = ref("");
const inputLength = ref(null);
const isShowWarning = ref(false);
const lorem =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ";

const countTextLength = computed(() => {
  return generatedText.value.length;
});

const countWords = computed(() => {
  const words = generatedText.value.trim().replaceAll(/\s+/g, " ").split(" ");
  if (words.length === 1 && words[0] === "") return 0;
  return words.length;
});

const countSentences = computed(() => {
  const cleanedText = generatedText.value.trim().replace(/\s+/g, " ");
  const sentences = cleanedText.split(/(?<=[.!?])\s+/);
  return sentences.filter((s) => s.length > 0).length;
});

const countParagraphs = computed(() => {
  const paragraphs = generatedText.value
    .split(/\n+/)
    .filter((p) => p.trim().length > 0);
  return paragraphs.length;
});

const countSpaces = computed(() => {
  return (generatedText.value.match(/ /g) || []).length;
});

const onlyNumber = (e) => {
  const char = String.fromCharCode(e.keyCode);
  if (!/[0-9]/.test(char)) {
    e.preventDefault();
  }
};

const handleBlurTextarea = () => {
  const hasSpace = /^\s|\s$/.test(generatedText.value);
  if (hasSpace) {
    isShowWarning.value = true;
  }
};

const handleClear = () => {
  generatedText.value = "";
  inputLength.value = null;
};

const handleCopy = async () => {
  await navigator.clipboard.writeText(generatedText.value);
};

const handleGenerateText = () => {
  let result = "";
  while (result.length < inputLength.value) {
    result += lorem;
  }

  generatedText.value = result.slice(0, inputLength.value);
};
</script>
<style scoped>
.warning-box {
  opacity: 0;
  visibility: hidden;
  transform: translateY(-10px);
  transition: all 0.3s ease;
  min-height: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-weight: 500;
}
.warning-box i {
  margin-top: -14px;
}

.warning-box.is-visible {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-enter-to,
.slide-down-leave-from {
  opacity: 1;
  transform: translateY(0);
}
</style>

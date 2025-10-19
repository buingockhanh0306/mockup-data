<template>
  <Title text="Generate Voice" />
  <div class="container">
    <div class="d-flex align-items-center mb-4 justify-content-between">
      <div class="d-flex gap-2 align-items-center">
        <label for="">Type of voice: </label>
        <BFormSelect
          v-model="typeVoice"
          :options="optionTypeVoices"
          class="form-select-sm element me-4"
        />
        <label for="">Rate: </label>
        <BFormInput
          v-model="rate"
          type="range"
          :min="0.1"
          :max="1.5"
          :step="0.1"
          class="w-50"
        />
        <span class="rate">{{ rate }}x</span>
      </div>
      <div class="d-flex">
        <BButton
          class="c-button me-2"
          :disabled="!inputText.length"
          @click="handleGenerateVoice"
        >
          <i
            :class="isPlaying ? 'bi-stop-fill' : 'bi-play-fill'"
            class="me-1"
          ></i>
          {{ isPlaying ? "Stop" : "Play" }}
        </BButton>

        <BButton
          size="sm"
          class="me-2"
          variant="outline-danger"
          @click="handleClear"
          >Clear</BButton
        >
      </div>
    </div>
    <BFormTextarea
      v-model="inputText"
      placeholder="Enter something..."
      rows="18"
    />
  </div>
</template>
<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import Title from "@/components/Title.vue";

const rate = ref(1);
const inputText = ref("");
const typeVoice = ref("");
const isPlaying = ref(false);
const optionTypeVoices = ref([]);

onMounted(() => {
  setListVoices();
});

const setListVoices = () => {
  const listVoices = responsiveVoice.getVoices();
  optionTypeVoices.value = listVoices.map((voice) => voice.name);
  typeVoice.value = optionTypeVoices.value[0] || "";
};

const handleGenerateVoice = () => {
  if (isPlaying.value) {
    responsiveVoice.cancel();
    isPlaying.value = false;
    return;
  }
  responsiveVoice.speak(inputText.value, typeVoice.value, {
    rate: rate.value,
    onstart: () => {
      isPlaying.value = true;
    },
    onend: () => {
      isPlaying.value = false;
    },
  });
};

const handleClear = () => {
  inputText.value = "";
  typeVoice.value = optionTypeVoices.value[0];
  rate.value = 1;
  responsiveVoice.cancel();
};
</script>

<style lang="css" scoped>
.rate {
  color: var(--primary-color);
  font-weight: bold;
}
</style>

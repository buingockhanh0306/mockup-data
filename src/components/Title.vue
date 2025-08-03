<template>
  <h1>{{ text }}</h1>
</template>
<script setup>
import { defineProps } from "vue";
const props = defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>
<style scoped>
h1 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
  background: linear-gradient(to right, #6c63ff, #00bcd4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  color: transparent;
}
</style>

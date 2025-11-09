<template>
  <Title text="Get Key Translate" />
  <div class="container">
    <template v-if="mode === MODE.INPUT">
      <div class="d-flex gap-2 align-items-center">
        <label for="">Text prefix: </label>
        <BFormInput
            v-model="inputPrefix"
            placeholder="Enter text prefix"
            class="w-1/2"
        />
        <BButton
            class="c-button btn-getKey"
            :disabled="isDisableGetKey"
            @click="handleGetKey"
        >Get key</BButton
        >
      </div>
      <div class="block-code" >
        <code-editor v-model="inputObj" />
      </div>
    </template>

    <template v-else>
      <div class="d-flex gap-2 align-items-center">
        <label for="">Search: </label>
        <BFormInput
            v-model="inputSearch"
            placeholder="Enter key or text..."
            class="w-1/2"
            @input="handleSearch"
        />
        <BButton
            class="c-button"
            @click="mode = MODE.INPUT"
        >Back</BButton
        >
      </div>
      <BTable
          class="table-result"
          striped
          hover
          :items="itemsFiltered"
          :fields="columns"
      >
        <template #cell(action)="data">
          <div class="text-copy" @click="handleCopy(data)">
            Copy Key Angular
          </div>
        </template>
      </BTable>
    </template>
  </div>
</template>
<script setup lang="ts">
import Title from "@/components/Title.vue";
import {computed, ref} from "vue";
import {BButton, BFormInput} from "bootstrap-vue-next";
import CodeEditor from "@/components/CodeEditor.vue";

const inputPrefix = ref('');
const inputSearch = ref('');
const inputObj = ref(null);
const items = ref([]);
const itemsFiltered = ref([]);
const MODE = {
  INPUT: "input",
  RESULT: "result",
}
const mode = ref(MODE.INPUT);
const columns = [
  { key: 'key', label: 'Key Angular' },
  { key: 'value', label: 'Text' },
  { key: 'action', label: 'Action' }
]

const isDisableGetKey = computed(() => {
  const parsed = JSON.parse(inputObj.value);
  return !parsed;
})


const handleGetKey = () =>{
  const obj = JSON.parse(inputObj.value)
  const result = Object.entries(obj)
  items.value = []
  result.forEach(item=>{
    items.value.push({
      key:  inputPrefix.value ? `{{ "${inputPrefix.value}.${item[0]}" | translate }}`: `{{ "${item[0]}" | translate }}`,
      value:item[1]}
    );
  })
  mode.value = MODE.RESULT
  handleSearch()
}

const handleSearch = ()=>{
  itemsFiltered.value = items.value.filter(item=> item.key.includes(inputSearch.value) || item.value.includes(inputSearch.value))
}

const handleCopy = (data) =>{
  console.log(data.item.key)
  navigator.clipboard.writeText(data.item.key)
}

</script>
<style scoped>
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
.table-result{
  margin-top: 2rem;
  overflow: hidden;
  border: 1px solid #ccc;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
.btn-getKey{
  width: 100px;
}
.text-copy{
  color: var(--primary-color);
}
.text-copy:hover{
  text-decoration: underline;
  cursor: pointer;
}
</style>
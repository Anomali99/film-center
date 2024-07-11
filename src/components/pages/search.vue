<script setup>
import { Navbar, Poster } from "../assets";
import { useRoute } from "vue-router";

const route = useRoute();
const result = route.meta.data;
const key = route.meta.key;
const category = route.meta.category || "Search";

const getData = () => {
  const max = 5;
  const filteredData = result.filter((value) => value.poster !== "");
  const results = [];

  for (let i = 0; i < filteredData.length; i += max) {
    let chunk = filteredData.slice(i, i + max);
    while (chunk.length < max) {
      chunk.push(null);
    }
    results.push(chunk);
  }
  return results;
};
</script>

<template>
  <Navbar />
  <div
    class="w-full h-screen bg-gray-600 overflow-y-auto custom-scrollbar pt-20 px-36"
  >
    <h1 class="text-xl font-semibold text-gray-400 mb-4 bg-black p-2">
      Results of
      <span class="font-bold text-white uppercase">{{ category }}</span
      >: <span class="font-bold text-white lowercase">{{ key }}</span>
    </h1>
    <div
      v-for="(item, index) in getData()"
      :key="index"
      class="flex w-full flex-row gap-4 pb-8"
    >
      <div v-for="(value, index) in item" :key="index" class="w-full">
        <Poster
          v-if="value != null"
          :title="value.title"
          :img="`/img/${value.poster}`"
          :type="value.type"
        />
      </div>
    </div>
  </div>
</template>

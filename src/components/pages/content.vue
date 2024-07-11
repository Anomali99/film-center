<script setup>
import { ref } from "vue";
import { Navbar, Poster, FilmContainer } from "../assets";
import { useRoute } from "vue-router";

const route = useRoute();
const data = ref(route.meta.data.content);
const eps = ref(parseInt(route.query.e || "1"));
const other = ref(route.meta.data.other);
const label = ref(data.value.class == "" ? "Group" : "Class");

const getData = (content) => {
  const max = 5;
  const filteredData = content.filter((value) => value.poster !== "");
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
    <FilmContainer :data="data" :eps="eps" />
    <div
      v-for="(value, index) in other"
      :key="index"
      class="w-full flex flex-col"
    >
      <h1 class="text-xl font-semibold text-white mb-4 mt-5 bg-black p-2">
        Film {{ label }}: {{ value.label }}
      </h1>
      <div
        v-for="(item, index) in getData(value.data)"
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
  </div>
</template>

<script setup>
import { ref } from "vue";
import navbar from "../assets/navbar.vue";
import poster from "../assets/poster.vue";
import { useRoute } from "vue-router";

const route = useRoute();
const data = ref(route.meta.data.content);
const isSeries = ref(data.value.type === "series");
const isClass = ref(data.value.class !== "");
const other = route.meta.data.other;
const eps = parseInt(route.query.e || "1");

let url;
if (typeof data.value.path === "string") {
  url = `/koleksi${data.value.path}`;
} else if (
  Array.isArray(data.value.path) &&
  eps - 1 >= 0 &&
  eps - 1 < data.value.path.length
) {
  url = `/koleksi${data.value.path[eps - 1].path}`;
} else {
  console.error("Unexpected data format");
  url = "/koleksi";
}

const videoUrl = new URL(url, import.meta.url).href;
const genreString = data.value.genre.join(", ");

const subtitleUrl = (path) => {
  const newPath = `/koleksi${path}`;
  return new URL(newPath, import.meta.url).href;
};

const getData = () => {
  const max = 5;
  const filteredData = other.filter((value) => value.poster !== "");
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

function currentEps(key) {
  return parseInt(key) == eps;
}
</script>

<template>
  <navbar />
  <div
    class="w-full h-screen bg-gray-600 overflow-y-auto custom-scrollbar pt-20 px-36"
  >
    <h1 class="text-xl font-semibold text-white mb-4 bg-black p-2">
      {{ data.title }} ({{ data.year }})
      <span v-if="isSeries">Episode {{ eps }}</span>
    </h1>
    <div class="w-full flex flex-row gap-4">
      <video
        class="object-contain aspect-video w-full max-w-[80rem] bg-gray-800"
        :poster="`/img/${data.poster}`"
        :src="videoUrl"
        controls
      >
        <track
          v-if="data.subtitle"
          :src="subtitleUrl(data.subtitle)"
          kind="subtitles"
          srclang="id"
          label="Indonesia"
          type="text/vtt"
          default
        />
      </video>
      <div class="w-1/3 bg-gray-700 p-4">
        <div class="w-full flex justify-center">
          <img class="w-40" :src="`/img/${data.poster}`" alt="poster" />
        </div>
        <p class="text-white mt-4"><strong>Type:</strong> {{ data.type }}</p>
        <p class="text-white mt-2"><strong>Genre:</strong> {{ genreString }}</p>
        <p class="text-white mt-2"><strong>Group:</strong> {{ data.group }}</p>
        <p v-if="isClass" class="text-white mt-2">
          <strong>Class:</strong> {{ data.class }}
        </p>
        <p v-if="isSeries" class="text-white mt-2">
          <strong>Total Episode:</strong> {{ data.path.length }}
        </p>
        <p class="text-white mt-2">
          <strong>Released:</strong> {{ data.released }}
        </p>
        <p class="text-white mt-2">
          <strong>Runtime:</strong> {{ data.runtime }}
        </p>
        <p class="text-white font-bold mt-2">Plot:</p>
        <p class="text-white">{{ data.plot }}</p>
      </div>
    </div>
    <div v-if="isSeries" class="w-full bg-gray-800 mt-4 p-2">
      <p class="text-xl text-white font-bold ml-4">Episode:</p>
      <div class="w-full bg-gray-700 p-4 mt-2">
        <ul class="w-full flex flex-row gap-2">
          <li v-for="(item, index) in data.path">
            <a
              :class="[
                'py-1 px-3 text-xl text-white font-bold rounded  ',
                currentEps(item.name)
                  ? 'bg-gray-950'
                  : 'bg-gray-800 hover:bg-gray-600',
              ]"
              :href="`?e=${item.name}`"
              >{{ item.name }}</a
            >
          </li>
        </ul>
      </div>
    </div>
    <h1 class="text-xl font-semibold text-white mb-4 mt-5 bg-black p-2">
      Film Group: {{ data.group }}
    </h1>
    <div
      v-for="(item, index) in getData()"
      :key="index"
      class="flex w-full flex-row gap-4 pb-8"
    >
      <div v-for="(value, index) in item" :key="index" class="w-full">
        <poster
          v-if="value != null"
          :title="value.title"
          :img="`/img/${value.poster}`"
          :type="value.type"
        />
      </div>
    </div>
  </div>
</template>

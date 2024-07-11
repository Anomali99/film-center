<script setup>
import { ref } from "vue";

const props = defineProps(["data", "eps"]);
const data = ref(props.data);

const isSeries = ref(data.value.type === "series");
const isClass = ref(data.value.class !== "");
const eps = props.eps;
const subtitle = ref(isSubtitles());

let videoPath;
if (typeof data.value.path === "string") {
  videoPath = `/koleksi${data.value.path}`;
} else if (
  Array.isArray(data.value.path) &&
  eps - 1 >= 0 &&
  eps - 1 < data.value.path.length
) {
  videoPath = `/koleksi${data.value.path[eps - 1].path}`;
} else {
  console.error("Unexpected data format");
  videoPath = "/koleksi";
}

const videoUrl = new URL(videoPath, import.meta.url).href;
const genreString = data.value.genre.join(", ");

const subtitleUrl = (path) => {
  const newPath = `/koleksi${path}`;
  return new URL(newPath, import.meta.url).href;
};

function currentEps(key) {
  return parseInt(key) == eps;
}

function isSubtitles() {
  if (typeof data.value.path === "string" && data.value.subtitle) {
    return { exsist: true, path: data.value.subtitle };
  } else if (
    Array.isArray(data.value.path) &&
    eps - 1 >= 0 &&
    eps - 1 < data.value.path.length &&
    data.value.path.subtitle
  ) {
    return { exsist: true, path: data.value.path.subtitle };
  } else {
    return { exsist: false, path: [] };
  }
}
</script>

<template>
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
        v-if="subtitle.exsist"
        v-for="(item, index) in subtitle.path"
        :key="index"
        :label="item.label"
        :src="subtitleUrl(item.path)"
        kind="subtitles"
        srclang="id"
        type="text/vtt"
        :default="item.label === 'default'"
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
</template>

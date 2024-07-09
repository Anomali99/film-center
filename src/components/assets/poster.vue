<script setup>
import { getSlug } from "../../assets/data";
const props = defineProps(["title", "img", "type"]);
const title = props.title;
const img_uri = props.img;
const type = props.type;
const href = getSlug(title);
</script>

<template>
  <div
    class="group w-full rounded hover:bg-gray-400 hover:scale-110 hover:z-30"
  >
    <a :href="href">
      <div
        class="relative w-full rounded-t aspect-poster bg-cover"
        :style="{ backgroundImage: `url(${img_uri})` }"
      >
        <div
          :class="[
            'absolute uppercase  text-white px-2 py-1 w-max rounded-tl rounded-br',
            type == 'movie' ? 'bg-red-700' : 'bg-green-700',
          ]"
        >
          {{ type }}
        </div>
        <div
          class="absolute h-1/3 bottom-0 left-0 right-0 bg-gradient-to-t from-gray-500 via-transparent to-transparent"
        ></div>
      </div>
      <div class="w-full pb-4 px-4 pt-2">
        <h4 class="text-white font-bold group-hover:text-black">
          {{ title }}
        </h4>
      </div></a
    >
  </div>
</template>

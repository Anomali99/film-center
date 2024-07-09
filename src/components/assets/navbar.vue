<script setup>
import { ref, onMounted } from "vue";
import { getNavbarContent } from "../../assets/data";

const dropdown_year = ref(false);
const dropdown_genre = ref(false);
const dropdown_type = ref(false);
const dropdown_group = ref(false);
const dropdown_class = ref(false);
const menu_mobile = ref(false);
const search = ref("");
const menu = ref([]);

function closeDropdowns(dropdown) {
  for (let item of ["year", "genre", "type", "group", "class"]) {
    let currentDropdown = getValue(item);
    currentDropdown.value = item === dropdown ? !currentDropdown.value : false;
  }
}

function navigateToSearch() {
  const query = search.value.trim().replace(/ /g, "+");
  if (query) {
    window.location.href = `/search?i=${query}`;
  }
}

function getValue(name) {
  switch (name) {
    case "year":
      return dropdown_year;
    case "genre":
      return dropdown_genre;
    case "type":
      return dropdown_type;
    case "group":
      return dropdown_group;
    case "class":
      return dropdown_class;
    default:
      return null;
  }
}

onMounted(async () => {
  try {
    const result = await getNavbarContent();
    menu.value = [
      { name: "year", data: result.uniqe_year.sort() },
      { name: "genre", data: result.uniqe_genre.sort() },
      { name: "type", data: result.uniqe_type.sort() },
      { name: "group", data: result.uniqe_group.sort() },
      { name: "class", data: result.uniqe_class.sort() },
    ];
  } catch (error) {
    console.error("Failed to fetch navbar content:", error);
  }
});
</script>

<template>
  <nav class="bg-gray-900 border-gray-700 fixed top-0 left-0 right-0 z-10">
    <div
      class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4"
    >
      <a href="/" class="flex items-center space-x-3 rtl:space-x-reverse">
        <img src="/icons/app_icon.svg" class="h-8" alt="App Logo" />
        <span
          class="self-center text-2xl font-bold whitespace-nowrap text-white font-sans"
          >Film Center</span
        >
      </a>
      <button
        data-collapse-toggle="navbar-multi-level"
        type="button"
        class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm rounded-lg md:hidden focus:outline-none focus:ring-2 text-gray-400 hover:bg-gray-700 focus:ring-gray-600"
        aria-controls="navbar-multi-level"
        aria-expanded="false"
        @click="menu_mobile.value = !menu_mobile.value"
      >
        <span class="sr-only">Open main menu</span>
        <svg
          class="w-5 h-5"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 17 14"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M1 1h15M1 7h15M1 13h15"
          />
        </svg>
      </button>
      <div
        :class="[
          'w-full md:block md:w-auto',
          menu_mobile.value ? '' : 'hidden',
        ]"
        id="navbar-multi-level"
      >
        <div class="relative md:hidden mt-8">
          <div
            class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
          >
            <svg
              class="w-4 h-4 text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
            <span class="sr-only">Search icon</span>
          </div>
          <input
            type="text"
            id="search-navbar"
            class="block w-full p-2 ps-10 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search..."
            v-model="search"
            @keyup.enter="navigateToSearch"
          />
        </div>
        <ul
          class="flex flex-col font-medium p-4 md:p-0 mt-4 border rounded-lg md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 bg-gray-800 md:bg-gray-900 border-gray-700"
        >
          <li v-for="(item, index) in menu" :key="index">
            <button
              :id="`dropdown-${item.name}`"
              data-dropdown-toggle="dropdownNavbar"
              class="flex items-center justify-between w-full py-2 px-3 md:border-0 md:p-0 md:w-auto text-white md:hover:text-blue-500 focus:text-white hover:bg-gray-700 md:hover:bg-transparent uppercase"
              @click="closeDropdowns(item.name)"
            >
              {{ item.name }}
              <svg
                class="w-2.5 h-2.5 ms-2.5"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  v-if="!getValue(item.name).value"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="m1 1 4 4 4-4"
                />
                <path
                  v-if="getValue(item.name).value"
                  stroke="currentColor"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M1 5l4-4 4 4"
                />
              </svg>
            </button>
            <!-- Dropdown menu -->
            <div
              v-if="getValue(item.name).value"
              :id="`dropdownNavbar-${item.name}`"
              class="z-20 font-normal absolute divide-y rounded-lg shadow w-44 bg-gray-700 divide-gray-600"
            >
              <ul
                class="py-2 text-sm text-gray-200 overflow-auto max-h-[50vh]"
                aria-labelledby="dropdownLargeButton"
              >
                <li v-for="(value, index) in item.data" :key="index">
                  <a
                    :href="`/${item.name}/${value}`"
                    class="block px-4 py-2 hover:bg-gray-600 hover:text-white lowercase"
                    >{{ value }}</a
                  >
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
      <div class="relative hidden md:block">
        <div
          class="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none"
        >
          <svg
            class="w-4 h-4 text-gray-400"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
          <span class="sr-only">Search icon</span>
        </div>
        <input
          type="text"
          id="search-navbar"
          class="block w-full p-2 ps-10 text-sm border rounded-lg bg-gray-700 border-gray-600 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
          placeholder="Search..."
          v-model="search"
          @keyup.enter="navigateToSearch"
        />
      </div>
    </div>
  </nav>
</template>

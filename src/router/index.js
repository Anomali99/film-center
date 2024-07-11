import { createWebHistory, createRouter } from "vue-router";
import { content, home, search } from "../components/pages";
import { getByCategory, getContent, getSearch } from "../assets/data";

const routes = [
  { path: "/", component: home, name: "Home" },
  { path: "/search", component: search, name: "Search" },
  { path: "/:type/:key", component: search, name: "Type" },
  { path: "/:slug", component: content, name: "Content" },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from, next) => {
  if (to.name === "Search") {
    const key = to.query.i.replace(/\+/g, " ");
    if (key) {
      try {
        to.meta.data = await getSearch(key);
        to.meta.key = key;
        next();
      } catch (error) {
        console.error("Failed to fetch search data:", error);
      }
    } else {
      next(from);
    }
  } else if (to.name === "Type") {
    const key = to.params.key.replace(/%20/g, " ");
    const category = to.params.type.replace(/%20/g, " ");
    try {
      to.meta.data = await getByCategory(category, key);
      to.meta.key = key;
      to.meta.category = category;
      next();
    } catch (error) {
      console.error("Failed to fetch category data:", error);
    }
  } else if (to.name === "Content") {
    const key = to.params.slug;
    try {
      to.meta.data = await getContent(key);
      if (to.meta.data) {
        next();
      }
    } catch (error) {
      console.error("Failed to fetch content data:", error);
    }
  } else {
    next();
  }
});

export default router;

// import data from "./output.json";
const data = async () => await getJSON();

async function getJSON() {
  try {
    const response = await fetch("/index.json");
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
    return [];
  }
}

function blank_check(value, uniqe_set) {
  if (value !== "") {
    uniqe_set.add(value);
  }
  return uniqe_set;
}

async function getNavbarContent() {
  const value = await data();
  let uniqe_year = new Set();
  let uniqe_genre = new Set();
  let uniqe_type = new Set();
  let uniqe_group = new Set();
  let uniqe_class = new Set();

  for (let item of value) {
    uniqe_year = blank_check(item.year, uniqe_year);
    uniqe_type = blank_check(item.type, uniqe_type);
    uniqe_group = blank_check(item.group, uniqe_group);
    uniqe_class = blank_check(item.class, uniqe_class);

    if (item.genre.length !== 0) {
      for (let value of item.genre) {
        uniqe_genre = blank_check(value, uniqe_genre);
      }
    }
  }

  return {
    uniqe_year: Array.from(uniqe_year),
    uniqe_genre: Array.from(uniqe_genre),
    uniqe_type: Array.from(uniqe_type),
    uniqe_group: Array.from(uniqe_group),
    uniqe_class: Array.from(uniqe_class),
  };
}

async function getSearch(key) {
  const value = await data();
  key = `%${key}%`;
  let regexPattern = key.replace(/%/g, ".*").replace(/_/g, ".");
  let regex = new RegExp(regexPattern, "i");
  return value.filter((item) => regex.test(item.title));
}

async function getByCategory(category, key) {
  const value = await data();
  return value.filter(
    (item) => item[category]?.toLowerCase() === key.toLowerCase()
  );
}

function getSlug(title) {
  let value = title.replace(/[:.?!]/g, "").replace(/\s+/g, "-");
  return value.toLowerCase();
}

async function getContent(slug) {
  const value = await data();
  let content = value.filter((item) => slug === getSlug(item.title))[0];
  console.log(content);
  if (content) {
    let other = value.filter(
      (item) => content.group === item.group && item.title !== content.title
    );

    if (content.class == "") {
      return { content, other: [{ label: content.group, data: other }] };
    } else {
      const groupedOther = other.reduce((acc, item) => {
        if (!acc[item.class]) {
          acc[item.class] = [];
        }
        acc[item.class].push(item);
        return acc;
      }, {});
      const result = Object.keys(groupedOther).map((key) => ({
        label: key,
        data: groupedOther[key],
      }));
      console.log(result);
      return { content, other: result };
    }
  } else {
    return null;
  }
}

export {
  data,
  getNavbarContent,
  getSearch,
  getByCategory,
  getContent,
  getSlug,
};

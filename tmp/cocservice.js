const fs = require("fs");
const axios = require("axios");
const cheerio = require("cheerio");

let updateWriteStream = fs.createWriteStream("./coc.json");

const host = "https://www.cocservice.top";

async function getAllItem() {
  let response = await axios.get(host + "/update");
  // Load HTML content into Cheerio
  const $ = cheerio.load(response.data);
  let subTitles = $("#update-tab-home .subtitle");
  let subTitleList = subTitles.toArray().map((i) => {
    let children = $(i)
      .next()
      .find("a")
      .toArray()
      .map((j) => {
        let link = $(j).attr("href");
        let name = $(j).find(".update-card-text").text();
        return {
          link,
          name,
        };
      });
    return {
      title: $(i).text(),
      children,
    };
  });
  getUpdateTable(subTitleList);
}

getAllItem();

async function getUpdateTable(list) {
  for (let i = 0; i < list.length; i++) {
    const children = list[i].children;
    for (let j = 0; j < children.length; j++) {
      const item = children[j];
      console.log(list[i].title, item.name);
      let link = item.link;
      let response = await axios.get(host + link);
      const $ = cheerio.load(response.data);
      buildingNumber = getUpdateNumber($);
      item.buildingNumber = buildingNumber;
      const table = $(".update-data-table").first();
      // Get the table headers and construct keys based on "升级花费" with image alt text as part of the key
      const headers = Array.from(table.find("table thead th")).map((th) => {
        const text = $(th).text().trim().replace(/\*/g, "");
        if (
          text === "升级花费" ||
          text === "升级费用" ||
          text === "升级所需资源"
        ) {
          const imgAlt = $(th).find("img").attr("alt");
          return `升级花费${imgAlt}`;
        }
        if (text === "所需大本营等级" || text === "所需大本等级") {
          return "所需大本营等级";
        }
        return text;
      });

      // Get the table rows from the DOM object
      const rows = Array.from(table.find("table tbody tr"));

      // Construct a JSON object from the table rows and headers
      const jsonData = rows.map((row) => {
        const cells = Array.from($(row).find("td"));
        const object = {};
        headers.forEach((key, i) => {
          let t = $(cells[i]).text().trim();
          object[key] = !isNaN(t) ? Number(t) : t;
        });
        return object;
      });
      item.data = jsonData;
    }
  }
  updateWriteStream.write(JSON.stringify(list));
}

function getUpdateNumber($) {
  const obj = {};
  const parent = $(".building-num-parent");
  parent.children("div:not(:first-child)").each((i, el) => {
    const key = $(el).find(".building-num-key").text().trim();
    const value = $(el).find(".building-num-value").text().trim();
    if (key.includes("-")) {
      const [start, end] = key.split("-").map(Number);
      for (let i = start; i <= end; i++) {
        obj[i] = Number(value);
      }
    } else {
      obj[Number(key)] = Number(value);
    }
  });
  return obj;
}

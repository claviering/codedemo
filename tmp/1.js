// using axios get html from http://www.21wnw.com/tool/wxue/ueditor.html#
// queryselect all class itembox
// format to {id: index, templete: html}
// save to local file using nodejs

const axios = require("axios");
const cheerio = require("cheerio");
const fs = require("fs");

const tabList = [
  { key: "followContent", label: "关注" },
  { key: "titleContent", label: "标题" },
  { key: "textContent", label: "正文" },
  { key: "separationLineContent", label: "分割线" },
  { key: "readMoreContent", label: "阅读全文" },
  { key: "readMoreContent1", label: "阅读全文1" },
  { key: "promoteContent", label: "互推" },
  { key: "dynamicBackgroundContent", label: "动态背景" },
  { key: "graphicAndTextTemplateContent", label: "图文模版" },
];

const url = "http://www.21wnw.com/tool/wxue/ueditor.html#";

// Get HTML content from URL using axios
axios
  .get(url)
  .then((response) => {
    // Load HTML content into Cheerio
    const $ = cheerio.load(response.data);

    let data = [];

    // Select all elements with class 'itembox'
    let id = 1;
    for (let i = 0; i < tabList.length; i++) {
      const key = tabList[i].key;
      const itemboxes = $(`#tab${i + 1} .itembox`);

      // Convert jQuery collection to array of objects with id and template properties
      const tmp = itemboxes.toArray().map((box, index) => ({
        id: id++,
        type: key,
        template: $.html(box)
          .replace(/[\n\t]/g, "")
          .replace(/>\s+</g, "><"),
      }));
      data = [...data, ...tmp];
    }

    // Save data to local file
    const filename = "output.json";
    fs.writeFileSync(filename, JSON.stringify(data));
    console.log(`Data saved to ${filename}`);
  })
  .catch((error) => {
    console.error(error);
  });

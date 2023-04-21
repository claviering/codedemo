const fs = require("fs");
const wenaiJSON = require("./可爱系二次元bot词库1.5万词V1.2.json");
const path = "./可爱系二次元bot词库1.5万词V1.2.jsonl";
let writeStream = fs.createWriteStream(path);
for (const key in wenaiJSON) {
  let values = wenaiJSON[key];
  const prompt = `${key}\n\n###\n\n`;
  for (let i = 0; i < values.length; i++) {
    const value = values[i];
    const obj = {
      prompt,
      completion: ` ${value}###`,
    };
    writeStream.write(JSON.stringify(obj) + "\n");
  }
}

const FormData = require("form-data");
const fs = require("fs");
const axios = require("axios");

const data = new FormData();
data.append("image", fs.createReadStream("/PATH/TO/captcha.png"));

const options = {
  method: "POST",
  url: "https://ocr-extract-text.p.rapidapi.com/ocr",
  headers: {
    "X-RapidAPI-Key": "3ee6682068msh5fa3b6b97998f57p1a158ajsn64c6e410be0c",
    "X-RapidAPI-Host": "ocr-extract-text.p.rapidapi.com",
    ...data.getHeaders(),
  },
  data: data,
};

axios
  .request(options)
  .then(function (response) {
    console.log(response.data);
  })
  .catch(function (error) {
    console.error(error);
  });

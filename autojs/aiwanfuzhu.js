"auto";

// 自动输入爱玩辅助启动码
function autoqdm() {
  textContains("输入启动码").waitFor();
  var input = id("editText").findOne();
  var r = http.get("http://aiwan.eatuo.com:88/php/qdm.php", {
    headers: {
      "Referer": "http://aiwanfuzhu.com/",
    },
  });
  var qdm = r.body.string();
  toastLog("qdm = " + qdm);
  input.setText(qdm);
  //暂停5秒
  sleep(5 * 1000);
  autoqdm()
}
autoqdm();
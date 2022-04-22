// copy to share
if (!window.getSelection) {
  /* IE */
  document.body.oncopy = function () {
    event.returnValue = false;
    var selectedText = document.selection.createRange().text;
    var pageInfo =
      "<br>---------------------<br>来源：<br>" +
      "链接：" +
      document.location.href +
      "<br>转载请注明出处";
    clipboardData.setData(
      "Text",
      selectedText.replace(/\n/g, "<br>") + pageInfo
    );
  };
} else {
  function addCopyRight() {
    var body_element = document.getElementsByTagName("body")[0];
    var selection = window.getSelection();
    var pageInfo =
      "<br>---------------------<br>来源：<br>" +
      "链接：" +
      document.location.href +
      "<br>转载请注明出处";
    var copyText = selection.toString().replace(/\n/g, "<br>"); // Solve the line breaks conversion issue
    if (copyText) {
      copyText = copyText + pageInfo;
      var newDiv = document.createElement("div");
      newDiv.style.position = "absolute";
      newDiv.style.left = "-99999px";
      body_element.appendChild(newDiv);
      newDiv.innerHTML = copyText;
      selection.selectAllChildren(newDiv);
      window.setTimeout(function () {
        body_element.removeChild(newDiv);
      }, 0);
    }
  }
  document.oncopy = addCopyRight;
}

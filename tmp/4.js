function replaceSrc(fileContent, exclude) {
  var reg = new RegExp('(src|data-src|href)=\\\\?[\'\"]([\\s\\S]*?)\\\\?[\'\"]', 'ig');
  fileContent = fileContent.replace(reg, function(str, attrName, imgUrl){
    console.log(imgUrl)
    if(!imgUrl) return str; // 避免空src引起编译失败
    if(/^(http(s?):)?\/\//.test(imgUrl)) return str; // 绝对路径的图片不处理
    if(!/\.(jpg|jpeg|png|gif|svg|webp|ico)$/i.test(imgUrl)) return str; // 非静态图片不处理
    if(exclude && imgUrl.indexOf(exclude) != -1) return str; // 不处理被排除的
    //图片路径开头带有webpack别名且没有./
    if(!(/^[\.\/]/).test(imgUrl) && imgUrl.indexOf('@') < 0) {
      imgUrl = './' + imgUrl;
    }
    console.log(imgUrl)
    return attrName+"=\"+JSON.stringify(require("+JSON.stringify(imgUrl)+"))+\"";
  });
return fileContent;
}

let str = '<#if article?? && article.mthInfo??> img(style="width: 15px; border-radius: 9px; margin-right: 0.05rem;" src="${article.mthInfo.iconUrl}" ) span(style="margin-right: 0.2rem;") | ${article.mthInfo.name} </#if>'
let str1 = '<#if article?? && article.mthInfo??> img(style="width: 15px; border-radius: 9px; margin-right: 0.05rem;" src="${article.mthInfo}" ) span(style="margin-right: 0.2rem;") | ${article.mthInfo.name} </#if>'

console.log(replaceSrc(str));
console.log('----');
console.log(replaceSrc(str1));
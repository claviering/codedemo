let optionContent = "免费下午茶-1,免费餐饮代取号-1";
let s = "免费餐饮代取号";
let newoptionContent = optionContent.replace(new RegExp(s + "-1"), s + "-0")
console.log('newoptionContent', newoptionContent);
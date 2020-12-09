/** 
 * 计算2个日期相差的天数，不包含今天，如：2016-12-13到2016-12-15，相差2天 
 * @param startDateString 
 * @param endDateString 
 * @returns 
 */
function dateDiff(startDateString, endDateString) {
  var separator = "-"; //日期分隔符  
  var startDates = startDateString.split(separator);
  var endDates = endDateString.split(separator);
  var startDate = new Date(startDates[0], startDates[1] - 1, startDates[2]);
  var endDate = new Date(endDates[0], endDates[1] - 1, endDates[2]);
  return parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24); //把相差的毫秒数转换为天数   
}


/** 
 * 计算2个日期相差的天数，包含今天，如：2016-12-13到2016-12-15，相差3天 
 * @param startDateString 
 * @param endDateString 
 * @returns 
 */
function dateDiffIncludeToday(startDateString, endDateString) {
  var separator = "-"; //日期分隔符  
  var startDates = startDateString.split(separator);
  var endDates = endDateString.split(separator);
  var startDate = new Date(startDates[0], startDates[1] - 1, startDates[2]);
  var endDate = new Date(endDates[0], endDates[1] - 1, endDates[2]);
  return parseInt(Math.abs(endDate - startDate) / 1000 / 60 / 60 / 24) + 1; //把相差的毫秒数转换为天数   
}
let start = '2019-10-03'
let end = '2019-10-10'
let s = dateDiff(end, start)
let f = dateDiffIncludeToday(start, end)
console.log(s, f);
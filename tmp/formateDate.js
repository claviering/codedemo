let format = "剩余DD天HH小时MM分钟ss秒zzz"
//                      3s         3min 3h   3d
let end = Date.now() + (3 * 1000 * 60 * 60 * 24)
function setTime() {
  let now = Date.now();
  if (end - now > 0) {
    formateDate(format, getTime(end - now))
  } else {
  }
  return
}
setTime()
function getTime(time) {
  let ms = time % 1000
  let s = time / 1000
  let m = s / 60
  let h = m / 60
  let d = h / 24

  s = (s % 60) | 0;
  m = (m % 60) | 0;
  h = (h % 24) | 0;
  d = d | 0;

  d = d > 0 ? d : 0
  h = h > 0 ? h : 0
  m = m > 0 ? m : 0
  
  return {d, h, m, s, ms}
}
function formateDate(format, time) {
  let {d, h, m, s, ms} = time
  return format.replace(/DD|HH|MM|ss|zzz/g, function (a) {
    switch (a) {
      case 'DD': return d;
      case 'HH': return h;
      case 'MM': return m;
      case 'ss': return s;
      case 'zzz': return ms;
    }
  })
}
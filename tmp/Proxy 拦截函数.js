let wx = {
  request: function (params) {
    let {url, success} = params
    console.log(url);
    success.call(this, '111')
  }
}
// request({
//   url: 'aaa',
//   success: (res) => {
//     console.log(res);
//   }
// })
// 拦截 success
const handlerSuccess = {
  apply: function(target, thisArg, argumentsList) {
    let res = target(argumentsList[0]);
    console.log('拦截 success result');
    return res
  }
};
// 拦截 request
const handlerRequest = {
  apply: function(target, thisArg, argumentsList) {
    console.log('request');
    // 拦截 success
    if (argumentsList && argumentsList.length && typeof argumentsList[0].success === 'function') {
      argumentsList[0].success = new Proxy(argumentsList[0].success, handlerSuccess);
    }
    return target(argumentsList[0]);
  }
};

wx.request = new Proxy(wx.request, handlerRequest);
wx.request({
  url: 'aaa',
  success: (res) => {
    console.log(res);
  }
})
let wx = {
  request: function (params) {
    let {url, success} = params
    console.log(url);
    success.call(this, '111')
  }
}
// 拦截 request
Object.getOwnPropertyNames(wx).forEach(function (property) {
  if (property !== 'request') return;
  var originalRequest = wx[property];
  if (typeof originalRequest === 'function') {
    wx[property] = function (requestArguments) {
      // 拦截 success
      Object.getOwnPropertyNames(requestArguments).forEach(function (requestProperty) {
        if (requestProperty !== 'success') return;
        var originalSuccess = requestArguments[requestProperty];
        if (typeof originalSuccess === 'function') {
          requestArguments[requestProperty] = function (successArguments) {
            console.log('拦截 success result');
            originalSuccess.call(requestArguments, successArguments);
          };
        }
      });
      originalRequest.call(wx, requestArguments);
    };
  }
});

wx.request({
  url: 'aaa',
  success: (res) => {
    console.log(res);
  }
});
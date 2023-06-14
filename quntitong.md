查询场地日期信息

POST /sportinterNew/androidstadium/queryStore2.do HTTP/1.1
Host: www.quntitong.cn
Content-Type: application/x-www-form-urlencoded
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Accept: _/_
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac
Referer: https://servicewechat.com/wxe350a6af6d22b9e8/106/page-frame.html
Content-Length: 93
Accept-Language: en-us

citys=440100&cgCode=0020C061256&booking=Y&sportCode=003&sign=BFA5A3BB3FEA1059BC45A627A3CD0CF3

###

```json
[
  {
    "costmoney": "",
    "costmoney1": "",
    "discount0": "",
    "discount10": "",
    "discount7": "",
    "opendate": "2023-02-28",
    "ordernum": "5",
    "price": "0",
    "price1": "100"
  },
  {
    "costmoney": "",
    "costmoney1": "",
    "discount0": "",
    "discount10": "",
    "discount7": "",
    "opendate": "2023-03-01",
    "ordernum": "12",
    "price": "0",
    "price1": "70"
  },
  {
    "costmoney": "",
    "costmoney1": "",
    "discount0": "",
    "discount10": "",
    "discount7": "",
    "opendate": "2023-03-02",
    "ordernum": "17",
    "price": "0",
    "price1": "70"
  },
  {
    "costmoney": "",
    "costmoney1": "",
    "discount0": "",
    "discount10": "",
    "discount7": "",
    "opendate": "2023-03-03",
    "ordernum": "26",
    "price": "0",
    "price1": "70"
  }
]
```

###

查询场次具体信息

POST /sportinterNew/androidstadium/queryStoreByType.do HTTP/1.1
Host: www.quntitong.cn
Content-Type: application/x-www-form-urlencoded
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Accept: _/_
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac
Referer: https://servicewechat.com/wxe350a6af6d22b9e8/106/page-frame.html
Content-Length: 100
Accept-Language: en-us

cgCode=0020C061256&sportCode=003&openDate=2023-03-03&booking=Y&sign=96868D7BA8839C2AD2FA2A00BF6729F4

提交订单

POST /sportinterNew/androidorder/saveOrder.do HTTP/1.1
Host: www.quntitong.cn
Content-Type: application/x-www-form-urlencoded
Accept-Encoding: gzip, deflate, br
Connection: keep-alive
Accept: _/_
User-Agent: Mozilla/5.0 (iPhone; CPU iPhone OS 11_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E217 MicroMessenger/6.8.0(0x16080000) NetType/WIFI Language/en Branch/Br_trunk MiniProgramEnv/Mac
Referer: https://servicewechat.com/wxe350a6af6d22b9e8/106/page-frame.html
Content-Length: 383
Accept-Language: en-us

userID=&cgId=402881b441a660630141a712b12f0046&cgCode=0020C061256&cgtype=3&terminal=10&openDate=2023-03-03&ordertotal=60&os=wx&queryType=android&lon=113.27333860756984&lat=23.134780403969454&subAdress=&sportsNum=5&citys=440100&num8a42f48786839f6801868e78e15b10fb=1&storeIds=8a42f48786839f6801868e78e15b10fb&quanid=&sign=8AE8139CFE29FF39A87ED007BCDD2107

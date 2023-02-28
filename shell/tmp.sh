curl 'http://1.1.1.2/homepage/logout' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7' \
  -H 'Connection: keep-alive' \
  -H 'Cookie: Sessionid=1686226318-1' \
  -H 'Referer: http://1.1.1.2/homepage/index.html?_FLAG=1' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' \
  -H 'X-Requested-With: XMLHttpRequest' \
  --compressed \
  --insecure

curl 'http://1.1.1.2/ac_portal/login.php' \
  -H 'Accept: */*' \
  -H 'Accept-Language: en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7' \
  -H 'Connection: keep-alive' \
  -H 'Content-Type: application/x-www-form-urlencoded; charset=UTF-8' \
  -H 'Cookie: Sessionid=1686226318-1' \
  -H 'Origin: http://1.1.1.2' \
  -H 'Referer: http://1.1.1.2/ac_portal/20161128144614/pc.html?template=20161128144614&tabs=pwd&vlanid=0&_ID_=0&switch_url=&url=http://1.1.1.2/homepage/index.html&controller_type=&mac=3c-e5-a6-5e-a9-00' \
  -H 'User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36' \
  -H 'X-Requested-With: XMLHttpRequest' \
  --data-raw 'opr=pwdLogin&userName=linwy&pwd=QWE%40654321&rememberPwd=1' \
  --compressed \
  --insecure
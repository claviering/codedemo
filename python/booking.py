import random
import time
import requests
from PIL import Image
from io import BytesIO

"""
原理: 不加载资源, 直接调用接口
1. 获取验证码 (超时重新获取验证码)
2. 登陆, 需要手动输入验证码 (登陆失败回到 step 1, 超时重试登陆)
3. 获取预约数据列表 (超时重试获取预约列表)
4. 预约, 需要手动输入验证码 (超时重试预约)
"""

host = "https://hk.sz.gov.cn:8118"
mydate = '2022-02-20' # 想要预约的日期

def getVerify(session, num=1):
  Headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
      "Host": "hk.sz.gov.cn:8118",
      "Referer": "https://hk.sz.gov.cn:8118/userPage/login",
      "Sec-Fetch-Dest": "image",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "same-origin",
      "Connection": "keep-alive"
  }
  url = host + "/user/getVerify?" + str(random.random())
  try:
    print("获取验证码中...")
    response = session.get(url, headers=Headers, timeout=1)
    img = Image.open(BytesIO(response.content))
    img.show()
    code = input("请输入验证码: ")
    return code
  except requests.exceptions.Timeout:
    print("%d 获取验证码超时, 重试中..." % (num))
    return getVerify(session, num+1)

# ED9101314：3, RUQ5MTAxMzE0, OTIwNzc2ODU1ZjVjZmI0YzZhNzg2YzA3OWViNGFhYjM=
# EJ3931121: 3, RUozOTMxMTIx, OGQwOTQzN2I3YzYzMzA0YTAzZTY3YmQ1MTJkNmRlNmE=
# CA5744679: 2, Q0E1NzQ0Njc5, OGQwOTQzN2I3YzYzMzA0YTAzZTY3YmQ1MTJkNmRlNmE=
def login(session, code, num=1):
  if code == 1:
    return
  payload = {
    "certType": 3, # 通行证 2, 护照 3
    "verifyCode": code,
    "certNo": "RUQ5MTAxMzE0", # 通行证 CA5744679 -> Q0E1NzQ0Njc5, 护照 EJ3931121 -> RUozOTMxMTIx
    "pwd": "OTIwNzc2ODU1ZjVjZmI0YzZhNzg2YzA3OWViNGFhYjM="
  }
  Headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
    "Host": "hk.sz.gov.cn:8118",
    "Referer": "https://hk.sz.gov.cn:8118/userPage/login",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Site": "same-origin",
    "X-Requested-With": "XMLHttpRequest",
    "Connection": "keep-alive",
  }
  print("登陆中...")
  try:
    response = session.post(host + '/user/login', headers=Headers, data=payload, timeout=3)
    status = response.json()['status']
    if status != 200:
      print("登陆失败, %s" % (response.json()['msg']))
      return login(session, getVerify(session))
    else:
      print("登陆成功")
      return
  except requests.exceptions.Timeout:
    print("%d 登陆超时, 重试中..." % (num))
    return login(session, code, num+1)

def isAfter10AM():
  now = time.localtime()
  if now.tm_hour >= 10:
    return True
  else:
    return False

def getBookingUrl(session, date, num=1):
  url = ''
  Headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
    "Host": "hk.sz.gov.cn:8118",
    "Origin": "https://hk.sz.gov.cn:8118",
    "Referer": "https://hk.sz.gov.cn:8118/passInfo/detail",
    "Sec-Fetch-Dest": "empty",
    "Sec-Fetch-Mode": "no-cors",
    "Sec-Fetch-Site": "same-origin",
    "X-Requested-With": "XMLHttpRequest",
    "Connection": "keep-alive",
  }
  try:
    timeout=1
    if isAfter10AM():
      timeout = 30 # 估计10点后，预约列表会有一个队列，等待时间长一点
    else:
      time.sleep(2) # 10点前，保持登陆状态
    response = session.post(host + '/districtHousenumLog/getList', headers=Headers, timeout=timeout)
    data = response.json()['data']
    for item in data:
      print("预约日期: %s, 可预约数: %d, 总预约数: %d, sign: %s" % (item['date'], item['count'], item['total'], item['sign']))
      if item['date'] == date:
        checkinDate = item['date']
        timespan = item['timespan']
        sign = item['sign']
        url = host + "/passInfo/confirmOrder?checkinDate=" + checkinDate + "&t=" + str(timespan) + "&s=" + sign
    return url
  except requests.exceptions.Timeout:
    print("%d 获取预约列表超时, 重试中..." % (num))
    return getBookingUrl(session, date, num+1)

def booking(session, url, num=1):
  Headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
      "Host": "hk.sz.gov.cn:8118",
      "Referer": "https://hk.sz.gov.cn:8118/passInfo/detail",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "no-cors",
      "Sec-Fetch-Site": "same-origin",
      "Connection": "keep-alive"
  }
  while True:
    try:
      print('拼命抢号中...')
      response = session.get(url, headers=Headers, timeout=1, verify=False)
      print(response.text)
      if '未到开放时间' in response.text:
        print("未到开放时间, 抢号中...")
        return booking(session, getBookingUrl(session, mydate), num+1)
      elif '沒有可預約的數據' in response.text:
        print("沒有可預約的數據, 抢号结束!")
        return
      else:
        # 没有代码，先保存再分析一下
        with open("booking" + str(random.random()) + ".html", "w", encoding="utf-8") as f:
          f.write(response.text)
          return booking(session, getBookingUrl(session, mydate), num+1)
    except requests.exceptions.Timeout:
      print("%d 预约超时, 重试中..." % (num))
      return booking(session, getBookingUrl(session, mydate), num+1)

def main():
  session = requests.Session()
  code = getVerify(session)
  login(session, code)
  url = getBookingUrl(session, mydate)
  booking(session, url)




if __name__ == '__main__':
    main()
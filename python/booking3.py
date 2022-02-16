from curses.ascii import NUL
import random
import time
import requests
from PIL import Image
from PIL import UnidentifiedImageError
from io import BytesIO
from datetime import timedelta
from datetime import date
from threading import Thread

"""
原理: 不加载资源, 直接调用接口
1. 获取验证码 (超时重新获取验证码)
2. 登陆, 需要手动输入验证码 (登陆失败回到 step 1, 超时重试登陆)
3. 获取预约数据列表 (超时重试获取预约列表)
4. 预约, 需要手动输入验证码 (超时重试预约)
"""

host = "https://hk.sz.gov.cn:8118"
endDay = date.today() + timedelta(days=6)  # 想要预约的日期
endDay = endDay.strftime("%Y-%m-%d")



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
        response = session.get(url, headers=Headers, timeout=10)
        img = Image.open(BytesIO(response.content))
        img.show()
        code = input("请输入验证码: ")
        return code
    except requests.exceptions.Timeout:
        print("%d 获取验证码超时, 重试中..." % (num))
        return getVerify(session, num+1)
    except requests.exceptions.ConnectionError:
        print("%d 获取验证码 ConnectionError, 重试中..." % (num))
        return getVerify(session, num+1)
    except UnidentifiedImageError:
        print("%d 获取验证码 UnidentifiedImageError, 重试中..." % (num))
        return getVerify(session, num+1)

# ED9101314：3, RUQ5MTAxMzE0, OTIwNzc2ODU1ZjVjZmI0YzZhNzg2YzA3OWViNGFhYjM=
# EJ3931121: 3, RUozOTMxMTIx, OGQwOTQzN2I3YzYzMzA0YTAzZTY3YmQ1MTJkNmRlNmE=
# CA5744679: 2, Q0E1NzQ0Njc5, OGQwOTQzN2I3YzYzMzA0YTAzZTY3YmQ1MTJkNmRlNmE=


def login(session, code, num=1):
    if code == 1:
        return
    payload = {
        "certType": 3,  # 通行证 2, 护照 3
        "verifyCode": code,
        "certNo": "RUQ5MTAxMzE0",  # 通行证 CA5744679 -> Q0E1NzQ0Njc5, 护照 EJ3931121 -> RUozOTMxMTIx
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
        response = session.post(host + '/user/login',
                                headers=Headers, data=payload, timeout=10)
        status = response.json()['status']
        if status != 200:
            print("登陆失败, %s" % (response.text))
            return login(session, getVerify(session))
        else:
            print("登陆成功")
            return
    except requests.exceptions.Timeout:
        print("%d 登陆超时, 重试中..." % (num))
        return login(session, code, num+1)
    except requests.exceptions.ConnectionError:
        print("%d ConnectionError, 重试中..." % (num))
        return login(session, code, num+1)


def isAfter0959AM():
    now = time.localtime()
    if now.tm_hour >= 9 and now.tm_min >= 59:
        return True
    else:
        return False


def getBookingUrl(session, num=1):
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
    now = time.localtime()
    print("线程 %d 请求数据时间: %d:%d:%d" % (num, now.tm_hour, now.tm_min, now.tm_sec))
    try:
        response = session.post(
            host + '/districtHousenumLog/getList', headers=Headers)
        data = response.json()['data']
        now = time.localtime()
        print("线程 %d 返回数据时间: %d:%d:%d" % (num, now.tm_hour, now.tm_min, now.tm_sec))
        for item in data:
            print("预约日期: %s, 可预约数: %d, 总预约数: %d, sign: %s" %
                (item['date'], item['count'], item['total'], item['sign']))
            if item['date'] == endDay:
                checkinDate = item['date']
                timespan = item['timespan']
                sign = item['sign']
                return checkinDate, str(timespan), sign
    except requests.exceptions.Timeout:
        print("%d 登陆超时, 重试中..." % (num))
        return getBookingUrl(session, num+1)
    except requests.exceptions.ConnectionError:
        print("%d ConnectionError, 重试中..." % (num))
        return getBookingUrl(session, num+1)
    except requests.exceptions.JSONDecodeError:
        print("%d JSONDecodeError, 重试中..." % (num))
        return getBookingUrl(session, num+1)


def booking(session, num, code=None):
    checkinDate, timespan, sign = getBookingUrl(session, num)
    if not code:
        code = getVerify(session, num)
    Headers = {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36',
        "Host": "hk.sz.gov.cn:8118",
        "Referer": "https://hk.sz.gov.cn:8118/passInfo/detail",
        "Sec-Fetch-Dest": "empty",
        "Sec-Fetch-Mode": "no-cors",
        "Sec-Fetch-Site": "same-origin",
        "Connection": "keep-alive"
    }
    url = host + "/passInfo/submitReservation"
    payload = {
        "checkinDate": checkinDate,
        "checkCode": code,
        "houseType": "1",
        "t": timespan,
        "s": sign,
    }
    print('线程 %d 拼命抢号中...' % (num))
    try:
        response = session.post(url, headers=Headers, data=payload, verify=False)
        print("线程 %d 结果: %s" % (num, response.text))
        return
    except requests.exceptions.ConnectionError:
        print("%d ConnectionError, 重试中..." % (num))
        return booking(session, num+1, code)

def test(a, b):
    code = input("请输入验证码: ")
    print(code)

def main():
    session = requests.Session()
    code = getVerify(session)
    login(session, code)
    num = 1
    while True:
      t = Thread(target=booking, args=(session, num))
      t.start()
      num = num + 1
      if isAfter0959AM():
        time.sleep(1)
      else:
        time.sleep(30)


if __name__ == '__main__':
    main()

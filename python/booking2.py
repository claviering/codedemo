import random
import time
from turtle import Turtle
import requests
from PIL import Image
from io import BytesIO
from datetime import timedelta
from datetime import date
import asyncio
import aiohttp
import threading

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
getVerifyTimeout = aiohttp.ClientTimeout(total=10)
loginTimeout = aiohttp.ClientTimeout(total=10)


async def getVerify(session, num=1):
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
        async with session.get(url, headers=Headers, timeout=getVerifyTimeout) as response:
            content = await response.read()
            img = Image.open(BytesIO(content))
            img.show()
            code = input("请输入验证码: ")
            return code
    except asyncio.TimeoutError:
        print("%d 获取验证码超时, 重试中..." % (num))
        return getVerify(session, num+1)

# ED9101314：3, RUQ5MTAxMzE0, OTIwNzc2ODU1ZjVjZmI0YzZhNzg2YzA3OWViNGFhYjM=
# EJ3931121: 3, RUozOTMxMTIx, OGQwOTQzN2I3YzYzMzA0YTAzZTY3YmQ1MTJkNmRlNmE=
# CA5744679: 2, Q0E1NzQ0Njc5, OGQwOTQzN2I3YzYzMzA0YTAzZTY3YmQ1MTJkNmRlNmE=


async def login(session, code, num=1):
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
        async with session.post(host + '/user/login',
                                headers=Headers, data=payload, timeout=loginTimeout) as response:
            if response.status != 200:
                print("登陆失败")
                return login(session, getVerify(session))
            else:
                print("登陆成功")
                return
    except asyncio.TimeoutError:
        print("%d 登陆超时, 重试中..." % (num))
        return login(session, code, num+1)


def isAfter10AM():
    now = time.localtime()
    print("请求数据时间: %d:%d:%d" % (now.tm_hour, now.tm_min, now.tm_sec))
    if now.tm_hour >= 10:
        return True
    else:
        return False


async def getBookingUrl(session, date, num=1):
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
        timeout = 1
        if isAfter10AM():
            timeout = 60  # 估计10点后，预约列表会有一个队列，等待时间长一点
        else:
            time.sleep(2)  # 10点前，保持登陆状态
        async with session.post(host + '/districtHousenumLog/getList', headers=Headers, timeout=aiohttp.ClientTimeout(total=timeout)) as response:
            data = await response.json()
            now = time.localtime()
            print("返回数据时间: %d:%d:%d" % (now.tm_hour, now.tm_min, now.tm_sec))
            for item in data:
                print("预约日期: %s, 可预约数: %d, 总预约数: %d, sign: %s" %
                    (item['date'], item['count'], item['total'], item['sign']))
                if item['date'] == date:
                    checkinDate = item['date']
                    timespan = item['timespan']
                    sign = item['sign']
                    url = host + "/passInfo/confirmOrder?checkinDate=" + \
                        checkinDate + "&t=" + str(timespan) + "&s=" + sign
            print(url)
            return url
    except asyncio.TimeoutError:
        print("%d 获取预约列表超时, 重试中..." % (num))
        return getBookingUrl(session, date, num+1)


async def booking(session, url, num=1):
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
            async with session.get(url, headers=Headers, timeout=30, verify=False) as response:
                text = await response.text()
                print(text)
                if '未到开放时间' in text:
                    print("未到开放时间, 抢号中...")
                    return booking(session, getBookingUrl(session, endDay), num+1)
                elif '沒有可預約的數據' in text:
                    print("沒有可預約的數據, 抢号结束!")
                    return
                else:
                    # 没有代码，先保存再分析一下
                    with open("booking" + str(random.random()) + ".html", "w", encoding="utf-8") as f:
                        f.write(text)
                        return booking(session, getBookingUrl(session, endDay), num+1)
        except asyncio.TimeoutError:
            print("%d 预约超时, 重试中..." % (num))
            return booking(session, getBookingUrl(session, endDay), num+1)

async def booking(session, num):
    await getBookingUrl(session, endDay)

async def test(num):
    print("test %d" % (num))
    await asyncio.sleep(100)

class myThread (threading.Thread):
    def __init__(self, threadID, name):
        threading.Thread.__init__(self)
        self.threadID = threadID
        self.name = name
    def run(self):
        print ("开始线程: " + self.name)
        test()
        print ("退出线程: " + self.name)

async def worker(session, num):
    num = 1
    while True:
        await asyncio.sleep(1)
        thread.start_new_thread(test, (num))
        # await test(num) # 加了await 会阻塞， 不加await会报错
        num += 1

async def main():
    async with aiohttp.ClientSession() as session:
        # code = await getVerify(session)
        # await login(session, code)
        await worker(session, 10)
        # url = getBookingUrl(session, endDay)
        # booking(session, url)


if __name__ == '__main__':
    asyncio.run(main())

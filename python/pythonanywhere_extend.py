#!/usr/local/bin/python
# -*- coding: utf-8 -*-
# pythonanywhere 签到延期脚本
# 使用 python3 pythonanywhere_extend.py <username> <password>

import requests
import re
import sys

login_url = "https://www.pythonanywhere.com/login/"

webapps_url = "https://www.pythonanywhere.com/user/hnaruto/webapps/"

extend_url = "https://www.pythonanywhere.com/user/hnaruto/webapps/hnaruto.pythonanywhere.com/extend"


def get_cookie(response):
    set_cookie = response.headers.get('Set-Cookie')
    return set_cookie


def get_headers(cookie, referer):
    headers = {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
        "Accept-Encoding": "gzip, deflate, br",
        "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
        "Cache-Control": "max-age=0",
        "Connection": "keep-alive",
        "Content-Type": "application/x-www-form-urlencoded",
        "Host": "www.pythonanywhere.com",
        "Origin": "https://www.pythonanywhere.com",
        "Cookie": cookie,
        "Referer": referer,
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "macOS",
        "Sec-Fetch-Dest": "document",
        "Sec-Fetch-Mode": "navigate",
        "Sec-Fetch-Site": "same-origin",
        "Sec-Fetch-User": "?1",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
    }
    return headers


def getToken(response):
    pattern = '<input\s+type="hidden"\s+name="csrfmiddlewaretoken"\s+value="([\w]+)">'
    result = re.search(pattern, response.text)
    csrfmiddlewaretoken = ''
    if result:
        csrfmiddlewaretoken = result.group(1)
    return csrfmiddlewaretoken


def login(sss, username, password):
    headers = get_headers(None, login_url)
    response = sss.get(login_url, headers=headers)
    cookie = get_cookie(response)
    headers['Cookie'] = cookie
    csrfmiddlewaretoken = getToken(response)
    data = {
        'auth-username': username,
        'auth-password': password,
        'login_view-current_step': 'auth',
        "csrfmiddlewaretoken": csrfmiddlewaretoken
    }
    r = sss.post(login_url, data=data, headers=headers)
    return r


def extend(sss):
    headers = get_headers(None, webapps_url)
    response = sss.get(webapps_url, headers=headers)
    cookie = get_cookie(response)
    headers['Cookie'] = cookie
    csrfmiddlewaretoken = getToken(response)
    data = {
        'csrfmiddlewaretoken': csrfmiddlewaretoken
    }
    response = sss.post(extend_url, data=data, headers=headers)
    print("pythonanywhere: " + str(response.status_code))


def main():
    username = sys.argv[1]
    password = sys.argv[2]
    sss = requests.Session()
    login(sss, username, password)
    extend(sss)


if __name__ == '__main__':
    main()

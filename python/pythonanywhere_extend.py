#!/usr/local/bin/python
# -*- coding: utf-8 -*-
# pythonanywhere 签到延期脚本

import requests
import re

def main():
  headers = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "Cache-Control": "max-age=0",
    "Connection": "keep-alive",
    "Cookie": "web_app_tab_type=%23tab_id_hnaruto_pythonanywhere_com; cookie_warning_seen=True; csrftoken=un2tRDO9Eml9IDlLLSlnATxETfuEOV76s8Vz7rsIGjZtVQamU8I6XumTbfCPyOcC; sessionid=jmfzba8eohsnlq3bxgy44eqjgc4fw30q; __stripe_mid=9e0449b1-34e5-4833-add3-9aaa52fadf15d0034b; __stripe_sid=5748f960-0f33-4135-b83c-a0eeecbd842178cd6b",
    "Host": "www.pythonanywhere.com",
    "Referer": "https://www.pythonanywhere.com/user/hnaruto/webapps/",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "macOS",
    "Sec-Fetch-Dest": "document",
    "Sec-Fetch-Mode": "navigate",
    "Sec-Fetch-Site": "same-origin",
    "Sec-Fetch-User": "?1",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36"
  }

  response = requests.get("https://www.pythonanywhere.com/user/hnaruto/webapps/", headers=headers, data=None)

  pattern = '<input\s+type="hidden"\s+name="csrfmiddlewaretoken"\s+value="([\w]+)">'
  result = re.search(pattern, response.text)
  csrfmiddlewaretoken = ''
  if result:
      print(result.group(1))
      csrfmiddlewaretoken = result.group(1)

  data = {
      'csrfmiddlewaretoken': csrfmiddlewaretoken
  }
  response = requests.post("https://www.pythonanywhere.com/user/hnaruto/webapps/hnaruto.pythonanywhere.com/extend", headers=headers, data=data)
  print(response.status_code)

if __name__ == '__main__':
    main()
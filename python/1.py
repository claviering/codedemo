#!/usr/local/bin/python
# -*- coding: utf-8 -*-

import requests

url = "https://ocr43.p.rapidapi.com/v1/results"

with open("python/captcha.png", "rb") as image_file:
    encoded_image = image_file.read()

payload = {"image": encoded_image}
headers = {
    'content-type': "multipart/form-data",
    'X-RapidAPI-Key': "3ee6682068msh5fa3b6b97998f57p1a158ajsn64c6e410be0c",
    'X-RapidAPI-Host': "ocr43.p.rapidapi.com"
}

response = requests.request("POST", url, data=payload, headers=headers)

print(response.text)


import requests

url = "https://ocr43.p.rapidapi.com/v1/results"
data = {
    'image': open('example.jpg', 'rb')  # 文件上传
}
response = requests.post(url, data=data)
print(response.text)

# upload a file
import requests

url = "https://ocr43.p.rapidapi.com/v1/results"
files = {
    'image': open('example.jpg', 'rb')  # 文件上从
}
response = requests.post(url, files=files)
print(response.text)

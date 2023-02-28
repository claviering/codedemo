#!/usr/local/bin/python
# -*- coding: utf-8 -*-

import time
import requests
import os
import datetime
import mysql.connector
from mysql.connector import Error

# export bilibili_cookie="your cookie"
# export DB_user="your DB user"
# export DB_password="your DB password"
# export DB_host="your DB host"
# export DB_database="your DB database"
cookie = os.environ.get('bilibili_cookie')
print(cookie)
user = os.environ.get('DB_user')
password = os.environ.get('DB_password')
host = os.environ.get('DB_host')
database = os.environ.get('DB_database')

URL = 'https://api.bilibili.com/x/web-interface/history/cursor'
headers = {
    'user-agent': 'my-app/0.0.1',
    'authority': 'api.bilibili.com',
    'method': 'GET',
    'scheme': 'https',
    'accept': '*/*',
    'accept-encoding': 'gzip, deflate, br',
    'accept-language': 'en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7',
    'origin': 'https://www.bilibili.com',
    'referer': 'https://www.bilibili.com/',
    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="102", "Google Chrome";v="102"',
    'sec-ch-ua-mobile': '?0',
    'sec-ch-ua-platform': '"macOS"',
    'sec-fetch-dest': 'empty',
    'sec-fetch-mode': 'cors',
    'sec-fetch-site': 'same-site',
    'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/102.0.0.0 Safari/537.36',
    'cookie': cookie
}
# use utf8mb4 to connect to mysql
config = {
    'user': user,
    'password': password,
    'host': host,
    'database': database,
    'raise_on_warnings': True,
    'charset': 'utf8mb4'
}

try:
    print("Connecting to database...")
    cnx = mysql.connector.connect(**config)
    if cnx.is_connected():
        db_Info = cnx.get_server_info()
        print("Connected to MySQL Server version ", db_Info)
        cursor = cnx.cursor()
        cursor.execute("select database();")
        record = cursor.fetchone()
        print("You're connected to database: ", record)

except Error as e:
    print("Error while connecting to MySQL", e)


def get_view_at_set():
    view_at_set = set()
    cursor = cnx.cursor()
    cursor.execute(
        "SELECT view_at FROM bilibili_history ORDER BY view_at DESC LIMIT 30")
    record = cursor.fetchall()
    for item in record:
        view_at_set.add(item[0])
    return view_at_set


def main():
    view_at_set = get_view_at_set()
    cursor = cnx.cursor()
    view_at = 0
    max = 0
    is_latest = False
    while True:
        if is_latest:
            print("已经是最新的历史记录了")
            break
        if view_at > 0:
            # format timestamp to YYYY-MM-DD HH:MM:SS
            timestring = datetime.datetime.fromtimestamp(
                view_at).strftime('%Y-%m-%d %H:%M:%S')
            print(f"正在获取 {timestring} 历史记录")
        else:
            print(f"正在获取今天的历史记录")
        r = requests.get(
            URL + f'?max={max}&view_at={view_at}&business=archive', headers=headers)
        data = r.json()
        if data['code'] != 0 or data['data']['list'] == []:
            print(data)
            break
        max = data['data']['cursor']['max']
        view_at = data['data']['cursor']['view_at']
        for item in data['data']['list']:
            if item['view_at'] in view_at_set:
                print("Already got the latest history")
                is_latest = True
                break
            itemDict = {
                'tag_name': item['tag_name'],  # 分类
                'author_name': item['author_name'],  # 作者
                'author_mid': item['author_mid'],  # 作者 id
                'title': item['title'],  # 标题
                'view_at': item['view_at'],  # 观看时间
                'duration': item['duration'],  # 视频总时长
                'progress': item['progress'],  # 观看时长(秒), 当视频看完时候为 -1
            }
            sql = "INSERT INTO bilibili_history (tag_name, author_name, author_mid, title, view_at, duration, progress) VALUES (%s, %s, %s, %s, %s, %s, %s)"
            val = (itemDict['tag_name'], itemDict['author_name'], itemDict['author_mid'],
                   itemDict['title'], itemDict['view_at'], itemDict['duration'], itemDict['progress'])
            cursor.execute(sql, val)
        cnx.commit()

        time.sleep(3)
    print("获取历史记录完成")
    cursor.close()
    cnx.close()


if __name__ == '__main__':
    main()

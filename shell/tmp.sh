#! /bin/sh
# -c 并发数量
# -r 请求数量
# -T 请求头
# -t 60S 设置请求时间 60s
# siege -H 'Content-Type: application/json, early_data: 1' -c 1 -t 60S 'https://localhost:8400/api/user/login POST < data.json'
siege -H 'Content-Type: application/json' -H 'Is-Early-Data: 1' -c 10 -t 60S 'https://localhost:8400/api/user/login POST < data.json'
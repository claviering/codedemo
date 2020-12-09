#! /bin/sh
# 签名文件
openssl dgst -sha384 -sign ../tls/server.key -out sign.txt.sha384 sign.txt
# 验证签名
openssl dgst -sha384 -verify ../tls/server.public.key -signature sign.txt.sha384 sign.txt

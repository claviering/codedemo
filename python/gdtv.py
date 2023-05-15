import websocket
import ssl
import requests
import json
import base64
import time
import hashlib
import hmac

url = "https://tcdn-api.itouchtv.cn/getParam"
response = requests.get(url)
data = json.loads(response.text)

ws = websocket.WebSocket(sslopt={"cert_reqs": ssl.CERT_NONE})
ws.connect("wss://tcdn-ws.itouchtv.cn:3800/connect")
print("WebSocket Connected")

# Once connected, you can send and receive messages
message = {
    "route": "getwsparam",
    "message": data['node']
}
ws.send(json.dumps(message))
message = json.loads(ws.recv())
print("ws message:", message)
node_b64 = base64.b64encode(message['wsnode'].encode('utf-8'))
node_b64_str = node_b64.decode('utf-8')
node_b64_str = "ZmY0ZjAzODg5OGY4YzlmNWNkNGFjNmRmYjJmMWVjNmItT1kyek5SRW9aWGNnWXcwTDQlMkY0OHV4SkQ1QnBoemxSWXk0TkVOYTRGRWFNSzViZlpDenlETHRMMGQwdHF2NUlURnlTZTRSVG5ObjRaRjVkcFU1R2I2MFQlMkZ5QXMlMkZXU0cyMzR1TXRZYnRGb2x3cnZuNFNSa3paN2lydiUyRmwxRmE3VzNsRXFDR0ZCcjdBSXI2YzJxMUVoOFR2RXgxJTJCQ1BkRXElMkYzRW1US0R6dW1rJTNE"
play_url = "https://gdtv-api.gdtv.cn/api/tv/v2/tvChannel/53?tvChannelPk=53&node=" + node_b64_str
t = str(int(round(time.time() * 1000)))
msg = "".join(["GET\n", play_url, "\n", t, "\n"])

# Secret key as bytes
key = b'dfkcY1c3sfuw0Cii9DWjOUO3iQy2hqlDxyvDXd1oVMxwYAJSgeB6phO8eW1dfuwX'
s = hmac.new(key, msg.encode('utf-8'), hashlib.sha256).digest()
signature = str(base64.b64encode(s), 'utf-8')
print(signature)

headers = {
    "authority": "gdtv-api.gdtv.cn",
    "method": "GET",
    "path": "/api/tv/v2/tvChannel/53?tvChannelPk=53&node=" + node_b64_str,
    "scheme": "https",
    "accept": "application/json, text/plain, */*",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "content-type": "application/json",
    "origin": "https://www.gdtv.cn",
    "referer": "https://www.gdtv.cn/",
    "sec-ch-ua": "\"Chromium\";v=\"112\", \"Google Chrome\";v=\"112\", \"Not:A-Brand\";v=\"99\"",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "\"macOS\"",
    "sec-fetch-dest": "empty",
    "sec-fetch-mode": "cors",
    "sec-fetch-site": "same-site",
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/112.0.0.0 Safari/537.36",
    "x-itouchtv-ca-key": "89541443007807288657755311869534",
    "x-itouchtv-ca-signature": signature,
    "x-itouchtv-ca-timestamp": t,
    "x-itouchtv-client": "WEB_PC",
    "x-itouchtv-device-id": "WEB_406fb130-eb0c-11ed-a2b1-e3bdef3c8a71"
}
response = requests.get(play_url, headers=headers)
print(response.status_code)
data = json.loads(response.text)
print("tvChannelPk: ", data)

# To close the connection
ws.close()

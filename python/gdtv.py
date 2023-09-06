import threading
import websocket
import ssl
import requests
import json
import base64
import time
import hashlib
import hmac


def get_params() -> str:
    print("2. getParam")
    url = "https://tcdn-api.itouchtv.cn/getParam"
    response = requests.get(url)
    data = json.loads(response.text)
    return data['node']


def send_node(ws):
    message = get_params()
    m = {
        "route": "getwsparam",
        "message": message
    }
    print('3. send wx message')
    ws.send(json.dumps(m))


def get_play_url(wsnode: str) -> str:
    print("5. get play url")
    node_b64 = base64.b64encode(wsnode)
    node_b64_str = node_b64.decode('utf-8')
    play_url = "https://gdtv-api.gdtv.cn/api/tv/v2/tvChannel/53?tvChannelPk=53&node=" + node_b64_str
    t = str(int(round(time.time() * 1000)))
    msg = "".join(["GET\n", play_url, "\n", t, "\n"])

    # Secret key as bytes
    key = b'dfkcY1c3sfuw0Cii9DWjOUO3iQy2hqlDxyvDXd1oVMxwYAJSgeB6phO8eW1dfuwX'
    s = hmac.new(key, msg.encode('utf-8'), hashlib.sha256).digest()
    signature = str(base64.b64encode(s), 'utf-8')

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
        "x-itouchtv-device-id": "WEB_a719ae70-076a-11ee-97d8-61607327fc49"
    }
    response = requests.get(play_url, headers=headers)
    print(response.status_code)
    data = json.loads(response.text)
    print("tvChannelPk: ", data)
    return data['playUrl']


def on_message(ws, message):
    print("4. on_message", message)
    m = json.loads(message)
    if (m['status'] == 201):
        get_play_url(m['wsnode'].encode('utf-8'))


def on_error(ws, error):
    print(error)


def on_close(ws, close_status_code, close_msg):
    print("### closed ###")


def on_open(ws):
    print("1. WebSocket Connected")
    send_node(ws)

    def run():
        while True:
            time.sleep(20)
            send_node(ws)
    thread = threading.Thread(target=run)
    thread.start()


if __name__ == "__main__":
    websocket.enableTrace(True)
    ws = websocket.WebSocketApp("wss://tcdn-ws.itouchtv.cn:3800/connect")
    ws.on_message = on_message
    ws.on_error = on_error
    ws.on_close = on_close
    ws.on_open = on_open
    ws.run_forever(sslopt={"cert_reqs": ssl.CERT_NONE})
    print('end')

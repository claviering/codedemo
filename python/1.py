import websocket
import ssl
import requests
import json

url = "https://tcdn-api.itouchtv.cn/getParam"
response = requests.get(url)
data = json.loads(response.text)
print(data['node'])

ws = websocket.WebSocket(sslopt={"cert_reqs": ssl.CERT_NONE})
ws.connect("wss://tcdn-ws.itouchtv.cn:3800/connect")
print("Connected")

# Once connected, you can send and receive messages
ws.send("Hello")
message = {
    "route": "getwsparam",
    "message": data['node']
}
ws.send(json.dumps(message))
message = ws.recv()
print(message)

# To close the connection
ws.close()

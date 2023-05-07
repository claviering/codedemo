import asyncio
import websockets

headers = {
    "Host": "tcdn-ws.itouchtv.cn:3800",
    "Origin": "https://www.gdtv.cn",
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "Cache-Control": "max-age=0",
    "Connection": "keep-alive",
    "Sec-WebSocket-Extensions": "permessage-deflate; client_max_window_bits",
    "Sec-WebSocket-Key": "bculRRFN9VkxkJrPboCINw==",
    "Sec-WebSocket-Version": "13"
}


async def connect():
    async with websockets.connect('wss://tcdn-ws.itouchtv.cn:3800/connect', ssl=False, extra_headers=headers) as websocket:
        print('Connected')
        while True:
            message = '{"status":204,"wsnode":"continue"}'
            await websocket.send(message)
            print(f'Sent message: {message}')
            response = await websocket.recv()
            print(f'Received response: {response}')
            await asyncio.sleep(20)
asyncio.run(connect())

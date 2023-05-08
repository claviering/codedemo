import requests
from PIL import Image
from io import BytesIO

headers = {
    ":authority": "tly.com",
    ":method": "GET",
    ":path": "/other/captcha.php?",
    ":scheme": "https",
    "accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7",
    "accept-encoding": "gzip, deflate, br",
    "accept-language": "en-US,en;q=0.9,zh-CN;q=0.8,zh;q=0.7",
    "cache-control": "max-age=0",
    "cookie": "PHPSESSID=1mftogi74heiu6g09jcgak8q41; user_pwd=731a8dd9d1d99493cfe0cdd580b79d5b7f66e2391acdc; uid=2323156; user_email=724063132%40qq.com; cf_chl_2=226b025239ebdb9; cf_clearance=CFAN5md8EYdwT94jcXfditnnY94Wsp9XoVXSKc7QofE-1680140135-0-150; __cf_bm=_QoL.NwvsudkoBIN1iCpbsPWZW3JLSp9Ip78CdScobA-1680140139-0-AaP/wqti/AApLyHUKFXI8pH3WIStifGqTsVUasDhMhSKpMXv+IT5xLuw/ZvHK515BH+U7RjpMy9s5SalaMsqa+pHY0Wt98j7sDPpLHJ0r06UAsFazFw9Ubh6fDZgBgUlRw==",
    "referer": "https://tly.com/other/captcha.php?__cf_chl_tk=6IE5EnJIP3wuspKqBXfCAGhToXAoTphcQdEkYNOXwFg-1680140134-0-gaNycGzNCrs",
    "sec-ch-ua-mobile": "?0",
    "sec-ch-ua-platform": "macOS",
    "sec-fetch-dest": "document",
    "sec-fetch-mode": "navigate",
    "sec-fetch-site": "same-origin",
    "sec-fetch-user": "?1",
    "upgrade-insecure-requests": 1,
    "user-agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/111.0.0.0 Safari/537.36",
}

response = requests.get("https://tly.com/other/captcha.php?", headers=headers, data=None)
img = Image.open(BytesIO(response.content))
img.show()
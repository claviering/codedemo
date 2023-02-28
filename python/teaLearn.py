import requests
import re
import os


def wirte_to_file(title, poster):
    filename = os.path.join('./python', 'README.md')
    content = ''
    with open(filename, 'r', encoding='utf-8') as f:
        content = f.readlines()
        # f.seek(0, 0)  # 重新设置文件读取指针到开头
        old_title = content[4].replace('## ', '').replace('\n', '')
        old_poster = content[6].replace(old_title, '').replace(
            '\n', '').replace('![](', '').replace(')', '')
        if old_poster == poster:
            print('Already newest!')
            return
        content.insert(10, f"[{old_title}]({old_poster})\n")
        content.insert(11, "\n")
        content[4] = f'## {title}\n'
        content[6] = f'![{title}]({poster})\n'

    with open(filename, 'w', encoding='utf-8') as f:
        contents = "".join(content)
        f.write(contents)
        print('Update Done!')


def main():
    headers = {
        "timeout": "100",
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/84.0.4147.125 Safari/537.36'
    }
    url = 'http://news.cyol.com/gb/channels/vrGlAKDl/index.html'
    response = requests.get(url, headers=headers)
    if response.status_code != 200:
        print(response.status_code)
        return
    match = re.search(r'https+://[^\s]*.html', response.text)
    if match is None:
        print('match fail!')
        return
    newest_url = match.group(0)
    poster = newest_url.replace('m.html', 'images/end.jpg')
    response = requests.get(newest_url, headers=headers)
    response.encoding = 'utf-8'
    match_title = re.search(r'<title>[^\s]*</title>', response.text)
    if match_title:
        title = match_title.group(0)
        title = title.replace('<title>', '').replace('</title>', '')
        wirte_to_file(title, poster)
    else:
        print('match fail!')


if __name__ == '__main__':
    main()

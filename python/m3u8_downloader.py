import requests
import os


def download_m3u8_video(url, output_file):
    response = requests.get(url)
    print(response.status_code)
    m3u8 = response.text.split('\n')
    segments = [segment for segment in m3u8 if segment.startswith('https://')]
    with open(output_file, 'wb') as fw:
        for i, segment in enumerate(segments):
            segment_url = os.path.join(os.path.dirname(url), segment)
            print('Downloading segment {} from {}'.format(i, segment_url))
            content = requests.get(segment_url).content
            print(content.__len__())
            fw.write(content)


if __name__ == '__main__':
    url = 'https://tcdn.itouchtv.cn/live/gdys.m3u8?t_token=63a723a9a73b6680a2011663907d1f5c-jCXx2kRMM%2B7ITAImO%2FWpxTBQyCxfiwzRNOlKWEFTnxKdUcXlUOMQ3%2Fi1r9GdGG8nj%2BdzVpOyhFYOLBLUJwZGZN%2BcXp7mHUa%2Bec0XH0%2F%2BTrzempYkTe%2BrYEQ2p2n3%2Bukj3ZYZZdA1F2kAtHeEjFDB5yPk9FQU0yJQvXDwNCxqvF%2B%2FE%2BCNmVeC7AOOTIZflEmZozjcq9UMEBNqrAVsT5Cu4caAmgAOQwr2j8sGF3lI76VuAT4exmpcS2cN4eXnE7h%2FWCnDAaXGPpSF29Z8AT%2BPSrWU9J6WYnjsJrm2AZ%2BplD3fICaPTCT%2FmMJNSnag8MvvNh%2BYrBLd2LTvyZpddKKVEvWM7abL5wgLN7KArZiHoCGdDmpL3gVwhBXRyOv%2FSDhYDehQhZokAM2CkmM5Pa4rMA%3D%3D'
    output_file = 'video.mp4'
    download_m3u8_video(url, output_file)

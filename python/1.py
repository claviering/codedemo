import re

url = 'https://www.pythonanywhere.com/login/'

domain = re.search(r'https?://([^/]+)', url).group(1)

print(domain)  # Output: www.pythonanywhere.com

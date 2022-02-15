import time
from datetime import timedelta
from datetime import date

def isAfter10AM():
  now = time.localtime()
  print(now)
  print("当前时间: %d:%d:%d" % (now.tm_hour, now.tm_min, now.tm_sec))
  if now.tm_hour >= 10:
    return True
  else:
    return False

def main():
    m = isAfter10AM()
    print(m)
    endTad = date.today() + timedelta(days=6)
    print(endTad)



if __name__ == '__main__':
    main()
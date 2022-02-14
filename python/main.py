import time

def isAfter10AM():
  now = time.localtime()
  print(now)
  if now.tm_hour >= 10:
    return True
  else:
    return False

def main():
    m = isAfter10AM()
    print(m)


if __name__ == '__main__':
    main()
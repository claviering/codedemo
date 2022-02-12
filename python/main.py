from datetime import date
from datetime import datetime
# print(date.today().weekday())
# print(datetime.today().replace(day=2))
# print(datetime.today().replace(day=2).weekday())
# print(["11"] == ["11"])

def setM(m, l):
    m["a"] = 2
    l.append(1)

def main():
    m = {"a": 1}
    print(m["a"])
    print(m["b"])


if __name__ == '__main__':
    main()
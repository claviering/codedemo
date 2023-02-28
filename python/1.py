#!/usr/local/bin/python
# -*- coding: utf-8 -*-

import datetime
import os

server_dir = '/home/cosmbvrm/api.cosmile.today'


def main():
    # if not exist log directory, create it
    if not os.path.exists(server_dir + '/schedule/log'):
        os.makedirs(server_dir + '/schedule/log')
    timeString = str(datetime.datetime.now().strftime("%Y-%m-%d-%H-%M-%S"))
    with open(server_dir + '/schedule/log/' + timeString + ".log", "a") as f:
        f.write('timeString: ' + timeString + '\n')


if __name__ == '__main__':
    main()

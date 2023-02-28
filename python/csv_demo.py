import pandas as pd
from datetime import datetime
import mysql.connector
from mysql.connector import Error

config = {
    'user': 'cosmbvrm_db_weiye',
    'password': 'LO_-vuXx+JOo',
    'host': '127.0.0.1',
    'database': 'cosmbvrm_DB',
    'raise_on_warnings': True
}

data = pd.read_csv('./python/money.csv')

try:
    print("Connecting to database...")
    cnx = mysql.connector.connect(**config)
    if cnx.is_connected():
        db_Info = cnx.get_server_info()
        print("Connected to MySQL Server version ", db_Info)
        cursor = cnx.cursor()
        cursor.execute("select database();")
        record = cursor.fetchone()
        print("You're connected to database: ", record)
        sql = "INSERT INTO ledger (category, type, updatetime, money, remark) VALUES (%s, %s, %s, %s, %s)"
        for row in data.values:
            print(row)
            typeint = 1 if row[2] > 0 else 0
            t = row[1].split('T')[0]
            d = datetime.strptime(t, "%Y-%m-%d").strftime('%s')
            timestamp = int(d)*1000
            val = (row[0].lower(), typeint, timestamp, abs(row[2]), row[3])
        cnx.commit()
        print('insert Done')


except Error as e:
    print("Error while connecting to MySQL", e)

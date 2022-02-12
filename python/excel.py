import pandas as pd

df = pd.read_excel('python/test.xlsx')
# df = df.fillna(method='ffill', axis=0)
df = df.fillna(method='ffill')
print(df.values)
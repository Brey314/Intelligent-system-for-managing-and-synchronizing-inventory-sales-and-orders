import requests

url = "https://intelligent-system-for-managing-and.onrender.com/api/productos/"
resp = requests.get(url)
print(resp.json())

import urllib.request
import urllib.error
import json

req = urllib.request.Request(
    'http://127.0.0.1:8000/auth/register',
    data=b'{"email":"test@example.com","password":"password123","full_name":"Test"}',
    headers={'Content-Type': 'application/json'}
)
try:
    resp = urllib.request.urlopen(req)
    print(resp.read().decode())
except urllib.error.HTTPError as e:
    print(e.code)
    print(e.read().decode())

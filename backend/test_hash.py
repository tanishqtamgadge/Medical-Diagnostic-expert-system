import traceback
try:
    from app.services.auth import hash_password
    print(hash_password("testpassword"))
except Exception as e:
    traceback.print_exc()

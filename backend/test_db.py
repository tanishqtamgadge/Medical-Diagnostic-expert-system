from app.database import SessionLocal, Base, engine
from app.models import User
import traceback

try:
    print("Creating tables...")
    from app.routers import users, diagnosis, history
    Base.metadata.create_all(bind=engine)
    print("Tables created.")
    
    db = SessionLocal()
    user = User(email="test2@example.com", hashed_password="pw", full_name="Test")
    db.add(user)
    db.commit()
    print("User inserted.")
except Exception as e:
    traceback.print_exc()

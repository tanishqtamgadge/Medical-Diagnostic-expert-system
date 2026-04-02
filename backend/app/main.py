from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .database import Base, engine
from .routers import diagnosis, history, users

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Medical Diagnostic Expert System API",
    version="1.0.0",
    description="FastAPI backend for symptom-based disease prediction, reporting, and history storage.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {"status": "ok"}


app.include_router(users.router)
app.include_router(diagnosis.router)
app.include_router(history.router)

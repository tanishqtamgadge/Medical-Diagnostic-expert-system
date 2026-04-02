from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from .database import Base


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True, nullable=False)
    hashed_password: Mapped[str] = mapped_column(String(255), nullable=False)
    full_name: Mapped[str] = mapped_column(String(120), default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    sessions: Mapped[list["DiagnosisSession"]] = relationship(back_populates="user")


class DiagnosisSession(Base):
    __tablename__ = "diagnosis_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[int | None] = mapped_column(Integer, ForeignKey("users.id"), nullable=True)
    patient_name: Mapped[str] = mapped_column(String(120), default="Anonymous")
    patient_age: Mapped[int | None] = mapped_column(Integer, nullable=True)
    patient_gender: Mapped[str | None] = mapped_column(String(32), nullable=True)
    symptoms: Mapped[str] = mapped_column(Text)
    symptom_details: Mapped[str] = mapped_column(Text)
    predicted_disease: Mapped[str] = mapped_column(String(120))
    probability: Mapped[float] = mapped_column(Float)
    recommendation: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user: Mapped[User | None] = relationship(back_populates="sessions")

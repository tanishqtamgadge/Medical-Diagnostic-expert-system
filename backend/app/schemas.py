from datetime import datetime
from typing import Literal

from pydantic import BaseModel, ConfigDict, EmailStr, Field


Severity = Literal["low", "medium", "high"]


class SymptomInput(BaseModel):
    name: str
    severity: Severity = "medium"


class PatientInfo(BaseModel):
    name: str = Field(default="Anonymous", min_length=1, max_length=120)
    age: int | None = Field(default=None, ge=0, le=120)
    gender: str | None = Field(default=None, max_length=32)


class DiagnosisRequest(BaseModel):
    patient: PatientInfo
    symptoms: list[SymptomInput] = Field(min_length=1)


class PredictionResult(BaseModel):
    disease: str
    probability: float
    rule_score: float
    ml_score: float
    matched_symptoms: list[str]
    recommendation: str
    explanation: str


class DiagnosisResponse(BaseModel):
    top_prediction: PredictionResult
    alternatives: list[PredictionResult]
    red_flags: list[str]
    session_id: int


class HistoryRecord(BaseModel):
    id: int
    patient_name: str
    predicted_disease: str
    probability: float
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


# ── Auth schemas ──────────────────────────────────────────────

class UserCreate(BaseModel):
    email: str = Field(max_length=255)
    password: str = Field(min_length=6)
    full_name: str = Field(default="", max_length=120)


class UserLogin(BaseModel):
    email: str
    password: str


class UserResponse(BaseModel):
    id: int
    email: str
    full_name: str
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse


# ── Email report schema ──────────────────────────────────────

class EmailReportRequest(BaseModel):
    patient: PatientInfo
    symptoms: list[SymptomInput] = Field(min_length=1)
    recipient_email: str = Field(max_length=255)

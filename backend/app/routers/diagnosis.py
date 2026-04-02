from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db
from ..services.auth import get_current_user
from ..services.email_service import send_report_email
from ..services.pdf_report import build_pdf
from ..services.prediction import predict

router = APIRouter(prefix="/diagnosis", tags=["diagnosis"])


@router.post("", response_model=schemas.DiagnosisResponse)
def create_diagnosis(
    request: schemas.DiagnosisRequest,
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(get_current_user),
):
    predictions, red_flags = predict(request.symptoms)
    if not predictions:
        raise HTTPException(status_code=404, detail="No disease profile matched the submitted symptoms.")

    top_prediction = predictions[0]
    session = models.DiagnosisSession(
        patient_name=request.patient.name,
        patient_age=request.patient.age,
        patient_gender=request.patient.gender,
        symptoms=", ".join(symptom.name for symptom in request.symptoms),
        symptom_details="; ".join(f"{symptom.name}:{symptom.severity}" for symptom in request.symptoms),
        predicted_disease=top_prediction.disease,
        probability=top_prediction.probability,
        recommendation=top_prediction.recommendation,
        user_id=current_user.id if current_user else None,
    )
    db.add(session)
    db.commit()
    db.refresh(session)

    return schemas.DiagnosisResponse(
        top_prediction=top_prediction,
        alternatives=predictions[1:4],
        red_flags=red_flags,
        session_id=session.id,
    )


@router.post("/report")
def generate_report(request: schemas.DiagnosisRequest):
    predictions, red_flags = predict(request.symptoms)
    if not predictions:
        raise HTTPException(status_code=404, detail="No disease profile matched the submitted symptoms.")

    pdf_bytes = build_pdf(request, predictions[0], red_flags)
    return StreamingResponse(
        iter([pdf_bytes]),
        media_type="application/pdf",
        headers={"Content-Disposition": "attachment; filename=diagnosis-report.pdf"},
    )


@router.post("/email-report")
def email_report(
    request: schemas.EmailReportRequest,
    db: Session = Depends(get_db),
    current_user: models.User | None = Depends(get_current_user),
):
    diagnosis_request = schemas.DiagnosisRequest(patient=request.patient, symptoms=request.symptoms)
    predictions, red_flags = predict(request.symptoms)
    if not predictions:
        raise HTTPException(status_code=404, detail="No disease profile matched the submitted symptoms.")

    top_prediction = predictions[0]

    # Persist session
    session = models.DiagnosisSession(
        patient_name=request.patient.name,
        patient_age=request.patient.age,
        patient_gender=request.patient.gender,
        symptoms=", ".join(s.name for s in request.symptoms),
        symptom_details="; ".join(f"{s.name}:{s.severity}" for s in request.symptoms),
        predicted_disease=top_prediction.disease,
        probability=top_prediction.probability,
        recommendation=top_prediction.recommendation,
        user_id=current_user.id if current_user else None,
    )
    db.add(session)
    db.commit()

    pdf_bytes = build_pdf(diagnosis_request, top_prediction, red_flags)
    send_report_email(
        recipient_email=request.recipient_email,
        patient_name=request.patient.name,
        disease=top_prediction.disease,
        pdf_bytes=pdf_bytes,
    )

    return {"detail": f"Report emailed to {request.recipient_email}"}

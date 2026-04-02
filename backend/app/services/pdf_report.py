from io import BytesIO

from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas

from ..schemas import DiagnosisRequest, PredictionResult


def build_pdf(request: DiagnosisRequest, prediction: PredictionResult, red_flags: list[str]) -> bytes:
    buffer = BytesIO()
    pdf = canvas.Canvas(buffer, pagesize=A4)
    width, height = A4
    y = height - 50

    pdf.setFont("Helvetica-Bold", 16)
    pdf.drawString(50, y, "Medical Diagnostic Expert System Report")
    y -= 30

    pdf.setFont("Helvetica", 11)
    patient = request.patient
    pdf.drawString(50, y, f"Patient: {patient.name}")
    y -= 20
    pdf.drawString(50, y, f"Age: {patient.age if patient.age is not None else 'N/A'}")
    y -= 20
    pdf.drawString(50, y, f"Gender: {patient.gender or 'N/A'}")
    y -= 30

    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, y, "Symptoms")
    y -= 20
    pdf.setFont("Helvetica", 11)
    for symptom in request.symptoms:
        pdf.drawString(70, y, f"- {symptom.name.title()} ({symptom.severity.title()})")
        y -= 18

    y -= 10
    pdf.setFont("Helvetica-Bold", 12)
    pdf.drawString(50, y, "Prediction")
    y -= 20
    pdf.setFont("Helvetica", 11)
    pdf.drawString(70, y, f"Disease: {prediction.disease}")
    y -= 18
    pdf.drawString(70, y, f"Probability: {prediction.probability}%")
    y -= 18
    pdf.drawString(70, y, f"Recommendation: {prediction.recommendation}")
    y -= 18

    if red_flags:
        y -= 10
        pdf.setFont("Helvetica-Bold", 12)
        pdf.drawString(50, y, "Red Flags")
        y -= 20
        pdf.setFont("Helvetica", 11)
        pdf.drawString(70, y, ", ".join(flag.title() for flag in red_flags))

    pdf.showPage()
    pdf.save()
    return buffer.getvalue()

# Medical Diagnostic Expert System

This project has been restructured to match the PRD as a full-stack application.

## Stack

- `frontend/`: Next.js + React + TypeScript + Tailwind CSS
- `backend/`: FastAPI + SQLite + rule-based and Decision Tree prediction
- `backend/app/services/pdf_report.py`: PDF report generation with ReportLab

## Included Features

- Symptom selection with severity levels
- Combined rule-based + ML prediction logic
- Probability score and recommendations
- SQLite diagnosis history
- PDF report endpoint
- Dashboard scaffold for past records

## Backend Run

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload
```

API docs:

- `http://127.0.0.1:8000/docs`

## Frontend Run

```bash
cd frontend
npm install
npm run dev
```

Frontend:

- `http://localhost:3000`

## Notes

- The ML model currently trains on synthetic rule-derived vectors because no real medical dataset is bundled yet.
- This keeps the architecture aligned with the PRD while leaving a clear place to plug in a real dataset later.
- The original single-file prototype is now superseded by the web app architecture.


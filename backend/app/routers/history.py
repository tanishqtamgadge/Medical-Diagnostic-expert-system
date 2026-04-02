from fastapi import APIRouter, Depends
from sqlalchemy import desc
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import DiagnosisSession, User
from ..schemas import HistoryRecord
from ..services.auth import get_current_user

router = APIRouter(prefix="/history", tags=["history"])


@router.get("", response_model=list[HistoryRecord])
def list_history(
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_current_user),
):
    query = db.query(DiagnosisSession)
    if current_user:
        query = query.filter(DiagnosisSession.user_id == current_user.id)
    sessions = query.order_by(desc(DiagnosisSession.created_at)).limit(50).all()
    return sessions

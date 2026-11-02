from fastapi import APIRouter
from fastapi.responses import FileResponse
from pydantic import BaseModel
from datetime import datetime
from backend.utils.pdf_generator import generate_ckd_report_pdf


router = APIRouter(prefix="/api", tags=["report"])

class ReportRequest(BaseModel):
    name: str
    age: int
    prediction: str
    stage: str
    risk: str


@router.post("/download-report")
def download_report(data: ReportRequest):
    report_data = {
        "name": data.name,
        "age": data.age,
        "prediction": data.prediction,
        "stage": data.stage,
        "risk": data.risk,
        "date": datetime.now().strftime("%d-%m-%Y %H:%M")
    }

    pdf_path = generate_ckd_report_pdf(report_data)

    return FileResponse(
        pdf_path,
        media_type="application/pdf",
        filename="Renalyze_CKD_Report.pdf"
    )

from fastapi import UploadFile, File, APIRouter, HTTPException, Query
from fastapi.responses import StreamingResponse

from app.services.pdf_operations import pdf_to_ppt

router = APIRouter()


@router.post("/pdf-to-ppt")
async def convert_pdf_to_ppt(file: UploadFile = File(...), keep_ratio: bool = Query(True)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")

    pdf_bytes = await file.read()
    ppt_buffer = pdf_to_ppt(pdf_bytes, keep_ratio)
    return StreamingResponse(ppt_buffer,
                             media_type="application/vnd.openxmlformats-officedocument.presentationml.presentation",
                             headers={"Content-Disposition": "attachment; filename=converted_presentation.pptx"})


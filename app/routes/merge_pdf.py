from fastapi import UploadFile, File, APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.services.pdf_operations import merge_pdfs

router = APIRouter()

@router.post("/merge-pdf")
async def merge_pdf(files: list[UploadFile] = File(...)):
    if not all(file.content_type == "application/pdf" for file in files):
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")

    pdf_files = [await file.read() for file in files]
    merged_pdf_buffer = merge_pdfs(pdf_files)
    return StreamingResponse(merged_pdf_buffer, media_type="application/pdf",
                             headers={"Content-Disposition": "attachment; filename=merged_document.pdf"})

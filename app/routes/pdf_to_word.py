from fastapi import UploadFile, File, APIRouter, HTTPException
from fastapi.responses import StreamingResponse

from app.services.pdf_operations import pdf_to_word

router = APIRouter()

@router.post("/pdf-to-word")
async def convert_pdf_to_word(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        raise HTTPException(status_code=400, detail="Invalid file type. Only PDF files are allowed.")

    pdf_bytes = await file.read()
    word_buffer = pdf_to_word(pdf_bytes)
    return StreamingResponse(word_buffer,
                             media_type="application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                             headers={"Content-Disposition": "attachment; filename=converted_document.docx"})

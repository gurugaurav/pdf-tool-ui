from fastapi import APIRouter, UploadFile, File
from app.services.pdf_operations import split_pdf_file
from fastapi.responses import StreamingResponse

from io import BytesIO
import zipfile

router = APIRouter()

@router.post("/split-pdf")
async def split_pdf(file: UploadFile = File(...)):

    pdf_parts = split_pdf_file(file)
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for filename, pdf_page in pdf_parts:
            zip_file.writestr(filename, pdf_page.read())

    zip_buffer.seek(0)

    return StreamingResponse(zip_buffer, media_type="application/zip",
                             headers={"Content-Disposition": "attachment; filename=pages.zip"})

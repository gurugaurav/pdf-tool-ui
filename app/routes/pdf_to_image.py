from fastapi import FastAPI, UploadFile, File, APIRouter
from fastapi.responses import StreamingResponse
from pdf2image import convert_from_bytes
from io import BytesIO
import zipfile

router = APIRouter()

@router.post("/pdfs-to-images")
async def pdf_to_images(file: UploadFile = File(...)):
    # Read the file into bytes
    pdf_bytes = await file.read()

    # Convert PDF to images using pdf2image
    images = convert_from_bytes(pdf_bytes)

    # Create a zip file in memory
    zip_buffer = BytesIO()
    with zipfile.ZipFile(zip_buffer, 'w', zipfile.ZIP_DEFLATED) as zip_file:
        for i, image in enumerate(images):
            img_byte_arr = BytesIO()
            image.save(img_byte_arr, format='PNG')
            img_byte_arr.seek(0)
            zip_file.writestr(f"page_{i + 1}.png", img_byte_arr.read())

    zip_buffer.seek(0)

    return StreamingResponse(zip_buffer, media_type="application/zip", headers={"Content-Disposition": "attachment; filename=images.zip"})
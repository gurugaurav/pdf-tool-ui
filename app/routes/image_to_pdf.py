from http.client import HTTPException

from fastapi import APIRouter, UploadFile, File, Response
from app.services.pdf_operations import convert_images_to_pdf
from typing import List  # Import List from typing
from PIL import Image


router = APIRouter()

@router.post("/image-to-pdf")
async def image_to_pdf(files: List[UploadFile] = File(...), orientation: str = "P", format: str = "a4",
                       margin: str = "0"):
    margin = int(margin) if margin.isdigit() else 0
    print(orientation, format, margin)

    # Validate all files are images
    for file in files:
        if not is_image(file):
            raise HTTPException(status_code=400, detail=f"File {file.filename} is not a valid image.")

    pdf_bytes = convert_images_to_pdf(files, orientation, format, margin)


    headers = {'Content-Disposition': 'inline; filename="out.pdf"'}
    return Response(pdf_bytes, headers=headers, media_type='application/pdf')


def is_image(file: UploadFile) -> bool:
    try:
        # Attempt to open the file as an image
        Image.open(file.file).verify()  # Verify the image is valid
        file.file.seek(0)  # Reset file pointer after verification
        return True
    except Exception:
        return False
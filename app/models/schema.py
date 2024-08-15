from pydantic import BaseModel
from typing import List

class ImageToPDFRequest(BaseModel):
    image_file: bytes
    filename: str

class ImageToPDFResponse(BaseModel):
    pdf_path: str

class PDFToImageRequest(BaseModel):
    pdf_file: bytes
    filename: str

class PDFToImageResponse(BaseModel):
    image_paths: List[str]

class MergePDFRequest(BaseModel):
    pdf_files: List[bytes]
    filenames: List[str]

class MergePDFResponse(BaseModel):
    merged_pdf_path: str

class SplitPDFRequest(BaseModel):
    pdf_file: bytes
    filename: str

class SplitPDFResponse(BaseModel):
    pdf_part_paths: List[str]

from fastapi import FastAPI
from app.routes import image_to_pdf, pdf_to_image, merge_pdf, split_pdf, pdf_to_pptx, pdf_to_word

app = FastAPI()

app.include_router(image_to_pdf.router)
app.include_router(pdf_to_image.router)
app.include_router(merge_pdf.router)
app.include_router(split_pdf.router)
app.include_router(pdf_to_pptx.router)
app.include_router(pdf_to_word.router)
app.include_router(merge_pdf.router)
@app.get("/")
async def root():
    return {"message": "Welcome to the PDF Service API!"}
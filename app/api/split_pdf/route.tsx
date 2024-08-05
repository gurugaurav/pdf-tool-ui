import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const POST = async (req: NextResponse, res: NextResponse) => {
  const formData = await req.formData();

  
  const file = formData.get("file") as File;
  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }


  const url = `http://127.0.0.1:8000/split-pdf`;

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });
  console.log('Response Headers:',response);

  if (response.ok) {
    // Get the Blob from the response
    const blob = await response.blob();

    // Create a new response with the Blob and appropriate headers
    const headers = new Headers();
    headers.append('Content-Disposition', 'attachment; filename="images.pdf"');
    headers.append('Content-Type', 'application/zip');

    // Return the PDF Blob as a NextResponse
    return new NextResponse(blob, { headers });
  } else {
    // Log error and return a failure response
    console.error('Error occurred:', response.statusText);
    return NextResponse.json({ message: 'Failed to fetch the PDF.', status: response.status }, { status: response.status });
  }
};
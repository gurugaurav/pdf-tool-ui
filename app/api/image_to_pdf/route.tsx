import { NextResponse } from "next/server";
import path from "path";
import { writeFile } from "fs/promises";

export const POST = async (req: NextResponse, res: NextResponse) => {
  const formData = await req.formData();

  
  const file = formData.get("file") as File;
  const pageSize = formData.get("pageSize")?.toString() || 'a4';
  const orientationParam = formData.get("orientation")?.toString().toLowerCase() || 'portrait';
  const margin = Number(formData.get("margin")) || 0;

  if (!file) {
    return NextResponse.json({ error: "No files received." }, { status: 400 });
  }

  // Validate pageSize
  const supportedPageSizes = ['a3', 'a4', 'a5', 'letter', 'legal'];
  const validPageSize = supportedPageSizes.includes(pageSize) ? pageSize : 'a4';

  // Convert orientation from 'landscape'/'portrait' to 'L'/'P'
  const orientationMapping: { [key: string]: string } = {
    'portrait': 'P',
    'landscape': 'L',
  };
  const validOrientation = orientationMapping[orientationParam] || 'L'; // Default to 'P' if invalid

  const url = `http://127.0.0.1:8000/image-to-pdf/?orientation=${validOrientation}&format=${validPageSize}&margin=${margin}`;

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
    headers.append('Content-Disposition', 'attachment; filename="test.pdf"');
    headers.append('Content-Type', 'application/pdf');

    // Return the PDF Blob as a NextResponse
    return new NextResponse(blob, { headers });
  } else {
    // Log error and return a failure response
    console.error('Error occurred:', response.statusText);
    return NextResponse.json({ message: 'Failed to fetch the PDF.', status: response.status }, { status: response.status });
  }
};
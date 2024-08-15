"use client"
import { useState, ChangeEvent, FormEvent } from 'react';
import Image from 'next/image';
import { IoCloseCircleOutline , IoAddCircleOutline } from "react-icons/io5";


const Page = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [pageSize, setPageSize] = useState<string>('A4');
  const [orientation, setOrientation] = useState<string>('L'); // Landscape by default
  const [margin, setMargin] = useState<number>(10);
  const [loading, setLoading] = useState<boolean>(false);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = event.target.files;
    if (selectedFiles) {
      const fileArray = Array.from(selectedFiles);
      setFiles(prevFiles => [...prevFiles, ...fileArray]);
      setPreviewUrls(prevUrls => [...prevUrls, ...fileArray.map(file => URL.createObjectURL(file))]);
    }
  };

  const handleDeleteImage = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
    setPreviewUrls(prevUrls => prevUrls.filter((_, i) => i !== index));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (files.length === 0) {
      alert("Please select at least one file before submitting.");
      return;
    }

    const formData = new FormData();
    files.forEach(file => formData.append('files', file));
    formData.append('pageSize', pageSize);
    formData.append('orientation', orientation);
    formData.append('margin', margin.toString());

    setLoading(true);

    try {
      const response = await fetch('/api/image_to_pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();

        // Create a URL for the Blob and trigger a download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'output.pdf'); // Set the desired filename
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);

        // Cleanup
        window.URL.revokeObjectURL(url);

        // Clear the file input
        setFiles([]);
        setPreviewUrls([]);
        (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';

        alert('File downloaded successfully!');
      } else {
        alert('Failed to upload file.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while uploading the file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-row min-h-screen bg-gray-100 p-4">
      <div className="flex flex-col items-center justify-start w-1/4 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold mb-4 text-slate-800">Image To PDF</h1>
        <form onSubmit={handleSubmit} className="w-full">
          <div className="mb-4">
            <label htmlFor="file" className="block text-sm font-medium text-gray-700">Select image Files</label>
            <input 
              type="file" 
              id="file" 
              onChange={handleFileChange} 
              multiple 
              className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="pageSize" className="block text-sm font-medium text-gray-700">Page Size</label>
            <select 
              id="pageSize" 
              value={pageSize} 
              onChange={(e) => setPageSize(e.target.value)}
              className="block w-full mt-1 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="A4">A4</option>
              <option value="Letter">Letter</option>
              <option value="Legal">Legal</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="orientation" className="block text-sm font-medium text-gray-700">Orientation</label>
            <select 
              id="orientation" 
              value={orientation} 
              onChange={(e) => setOrientation(e.target.value)}
              className="block w-full mt-1 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="L">Landscape</option>
              <option value="P">Portrait</option>
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="margin" className="block text-sm font-medium text-gray-700">Margin</label>
            <input 
              type="number" 
              id="margin" 
              value={margin} 
              onChange={(e) => setMargin(Number(e.target.value))}
              className="block w-full mt-1 text-sm text-gray-700 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>
          <button 
            type="submit" 
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            {loading ? 'Processing...' : 'Convert'}
          </button>
        </form>
      </div>
      <div className="relative grid grid-cols-3 gap-4 w-3/4 p-6 overflow-auto mt-12" style={{ maxHeight: '100vh' }}>
        <div className="absolute bottom-4 right-4 p-2 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600" onClick={() => document.getElementById('file')?.click()}>
          <IoAddCircleOutline  size={24} />
        </div>
        {previewUrls.length > 0 ? (
          previewUrls.map((url, index) => (
            <div key={index} className="flex flex-col items-center relative p-2">
              <Image
                src={url}
                alt={`Preview ${index}`} 
                className="border border-gray-300 rounded-lg mb-2" 
                width={200}
                height={400} 
                objectFit='cover' 
              />
              <div 
                className="bg-slate-300 text-white rounded-full cursor-pointer hover:bg-red-500 p-2"
                onClick={() => handleDeleteImage(index)}
              >
                <IoCloseCircleOutline  size={20} />
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 w-full col-span-3">
            <p>Please select Image</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Page;

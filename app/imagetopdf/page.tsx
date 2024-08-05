// pages/test.tsx
"use client"
import {useState, ChangeEvent, FormEvent } from 'react';

const Page = () => {
  const [file, setFile] = useState<File | null>(null);
  const [pageSize, setPageSize] = useState<string>('A4');
  const [orientation, setOrientation] = useState<string>('L'); // Landscape by default
  const [margin, setMargin] = useState<number>(10);

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
    }
  };
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      alert("Please select a file before submitting.");
      return;
    }

    const formData = new FormData();
    formData.append('file', file);
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
        setFile(null);
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4 ">
      <h1 className="text-3xl font-bold mb-4 text-slate-800	">Image To PDF</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-4">
        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">Select image File</label>
          <input 
            type="file" 
            id="file" 
            onChange={handleFileChange} 
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
            {/* Add more page sizes if needed */}
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
      {loading && (
        <div>
          <div className="loader"></div>
        </div>
      )}
    </div>
  );
};

export default Page;

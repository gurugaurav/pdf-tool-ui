"use client"
import { useState, ChangeEvent, FormEvent } from 'react';

const Page = () => {
  const [file, setFile] = useState<File | null>(null);

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
    setLoading(true);
    try {
      const response = await fetch('/api/split_pdf', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const blob = await response.blob();

        // Create a URL for the Blob and trigger a download
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'output.zip'); // Set the desired filename for the ZIP file
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);

        // Cleanup
        window.URL.revokeObjectURL(url);

        // Clear the file input
        setFile(null);
        (document.querySelector('input[type="file"]') as HTMLInputElement).value = '';
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
      <h1 className="text-3xl font-bold mb-4 text-slate-800">Split PDF</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md w-full max-w-md mt-4">
        <div className="mb-4">
          <label htmlFor="file" className="block text-sm font-medium text-gray-700">Select PDF File</label>
          <input 
            type="file" 
            id="file" 
            onChange={handleFileChange} 
            className="block w-full text-sm text-gray-700 border border-gray-300 rounded-lg cursor-pointer focus:outline-none focus:border-blue-500"
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

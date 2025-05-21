// frontend/src/components/Upload/UploadBox.jsx
import React, { useState, useRef } from 'react'; // Added useRef
import { uploadDocument, formatDocumentAndGetBlob } from '../../api'; // Corrected path for api

const UploadBox = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formattedDocUrl, setFormattedDocUrl] = useState(null);
  const fileInputRef = useRef(null); // Ref for the file input

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadedFilename(''); 
      setFormattedDocUrl(null); 
      setMessage(`Selected: ${file.name}`);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click(); // Programmatically click the hidden file input
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }
    setIsLoading(true);
    setMessage(`Uploading ${selectedFile.name}...`);
    setFormattedDocUrl(null);
    try {
      const response = await uploadDocument(selectedFile);
      setMessage(`✅ Upload successful: ${response.filename}. Ready to format.`);
      setUploadedFilename(response.filename); 
    } catch (error) {
      setMessage(`❌ Upload failed: ${error.message}`);
      setUploadedFilename('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormat = async () => {
    if (!uploadedFilename) {
      setMessage('Please upload a file first before formatting.');
      return;
    }
    setIsLoading(true);
    setMessage(`Formatting ${uploadedFilename}...`);
    setFormattedDocUrl(null);
    try {
      const blob = await formatDocumentAndGetBlob(uploadedFilename);
      const url = URL.createObjectURL(blob);
      setFormattedDocUrl(url); 
      setMessage(`✅ Formatting successful for ${uploadedFilename}!`);
    } catch (error) {
      setMessage(`❌ Formatting failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Simple spinner component for loading indication
  const Spinner = () => (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  return (
    <div className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-lg mx-auto">
      <h3 className="text-2xl font-semibold text-brand-dark mb-6 text-center">
        Upload and Format Document
      </h3>

      {/* Hidden file input, triggered by the button */}
      <input 
        type="file" 
        onChange={handleFileChange} 
        disabled={isLoading} 
        ref={fileInputRef}
        className="hidden" 
        accept=".txt,.pdf,.doc,.docx,image/*" // Specify acceptable file types
      />

      {/* Custom styled button to trigger file selection */}
      {!selectedFile && !uploadedFilename && (
        <button
          onClick={triggerFileSelect}
          disabled={isLoading}
          className="w-full bg-brand-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-150 ease-in-out flex items-center justify-center mb-4"
        >
          {isLoading ? <Spinner /> : 'Choose File'}
        </button>
      )}

      {selectedFile && !uploadedFilename && (
        <div className="text-center mb-4">
          <p className="text-slate-600 mb-2">Selected: <span className="font-medium text-brand-dark">{selectedFile.name}</span></p>
          <button
            onClick={handleUpload}
            disabled={isLoading}
            className="w-full bg-brand-secondary text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition duration-150 ease-in-out flex items-center justify-center"
          >
            {isLoading ? <><Spinner /> Uploading...</> : '1. Upload Selected File'}
          </button>
        </div>
      )}
      
      {uploadedFilename && (
         <div className="text-center mb-4">
          <p className="text-slate-600 mb-2">Uploaded: <span className="font-medium text-brand-dark">{uploadedFilename}</span></p>
          <button
            onClick={handleFormat}
            disabled={isLoading}
            className="w-full bg-brand-accent text-brand-dark font-semibold py-3 px-4 rounded-lg hover:bg-amber-500 transition duration-150 ease-in-out flex items-center justify-center"
          >
            {isLoading ? <><Spinner /> Formatting...</> : `2. Format "${uploadedFilename}"`}
          </button>
        </div>
      )}
      
      {message && (
        <p className={`mt-4 text-center text-sm font-medium ${message.includes('failed') || message.includes('❌') ? 'text-red-600' : 'text-green-600'}`}>
          {message}
        </p>
      )}

      {formattedDocUrl && (
        <div className="mt-6 text-center">
          <a 
            href={formattedDocUrl} 
            download={`${uploadedFilename.split('.')[0]}_formatted.docx`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-150 ease-in-out"
          >
            Download Formatted Document
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadBox;
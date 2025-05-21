// frontend/src/components/Upload/UploadBox.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion'; // Import motion
import { uploadDocument, formatDocumentAndGetBlob } from '../../api'; // Corrected path for api

// Simple spinner component for loading indication
const Spinner = () => (
  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
  </svg>
);

const UploadBox = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false); // Separate loading state for formatting
  const [formattedDocUrl, setFormattedDocUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadedFilename(''); 
      setFormattedDocUrl(null); 
      setMessage(`Selected: ${file.name}`);
    } else {
      setSelectedFile(null); // Clear selection if no file is chosen
      setMessage('');
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
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
    setIsFormatting(true); // Use separate loading state
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
      setIsFormatting(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }} // Adjust delay if needed based on Hero animation
      className="bg-white p-6 sm:p-8 rounded-xl shadow-2xl max-w-lg mx-auto"
    >
      <h3 className="text-2xl font-semibold text-brand-dark mb-6 text-center">
        Upload and Format Document
      </h3>

      <input 
        type="file" 
        onChange={handleFileChange} 
        disabled={isLoading || isFormatting} 
        ref={fileInputRef}
        className="hidden" 
        accept=".txt,.pdf,.doc,.docx,image/*"
      />

      {!selectedFile && !uploadedFilename && (
        <motion.button
          onClick={triggerFileSelect}
          disabled={isLoading || isFormatting}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-brand-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-150 ease-in-out flex items-center justify-center mb-4 shadow-md"
        >
          {isLoading ? <Spinner /> : 'Choose File'}
        </motion.button>
      )}

      {selectedFile && !uploadedFilename && (
        <div className="text-center mb-4">
          <p className="text-slate-600 mb-3">Selected: <span className="font-medium text-brand-dark">{selectedFile.name}</span></p>
          <motion.button
            onClick={handleUpload}
            disabled={isLoading || isFormatting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-brand-secondary text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-150 ease-in-out flex items-center justify-center shadow-md"
          >
            {isLoading ? <><Spinner /> Uploading...</> : '1. Upload Selected File'}
          </motion.button>
        </div>
      )}
      
      {uploadedFilename && (
         <div className="text-center mb-4">
          <p className="text-slate-600 mb-3">Uploaded: <span className="font-medium text-brand-dark">{uploadedFilename}</span></p>
          <motion.button
            onClick={handleFormat}
            disabled={isLoading || isFormatting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-brand-accent text-brand-dark font-semibold py-3 px-4 rounded-lg hover:bg-amber-500 transition-colors duration-150 ease-in-out flex items-center justify-center shadow-md"
          >
            {isFormatting ? <><Spinner /> Formatting...</> : `2. Format "${uploadedFilename}"`}
          </motion.button>
        </div>
      )}
      
      {message && (
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-4 text-center text-sm font-medium ${message.includes('failed') || message.includes('❌') ? 'text-red-600' : 'text-green-600'}`}
        >
          {message}
        </motion.p>
      )}

      {formattedDocUrl && (
        <motion.div 
          initial={{ opacity: 0, y:10 }}
          animate={{ opacity: 1, y:0 }}
          className="mt-6 text-center"
        >
          <a 
            href={formattedDocUrl} 
            download={`${uploadedFilename.split('.')[0]}_formatted.docx`}
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-150 ease-in-out"
          >
            Download Formatted Document
          </a>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadBox;
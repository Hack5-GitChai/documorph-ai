// frontend/src/components/Upload/UploadBox.jsx
import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { uploadDocument, formatDocumentAndGetBlob } from '../../api';
// Import icons from lucide-react
import { UploadCloud, FileText, CheckCircle, XCircle, Download, LoaderCircle } from 'lucide-react'; 

// Updated Spinner component to use lucide-react's LoaderCircle
const Spinner = ({ className = "h-5 w-5 text-white" }) => ( // Added className prop
  <LoaderCircle className={`animate-spin ${className}`} />
);

const UploadBox = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormatting, setIsFormatting] = useState(false);
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
      setSelectedFile(null);
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
      setMessage(`File uploaded: ${response.filename}. Ready to format.`);
      setUploadedFilename(response.filename); 
    } catch (error) {
      setMessage(`${error.message}`);
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
    setIsFormatting(true);
    setMessage(`Formatting ${uploadedFilename}...`);
    setFormattedDocUrl(null);
    try {
      const blob = await formatDocumentAndGetBlob(uploadedFilename);
      const url = URL.createObjectURL(blob);
      setFormattedDocUrl(url); 
      setMessage(`Formatting successful for ${uploadedFilename}!`);
    } catch (error) {
      setMessage(`${error.message}`);
    } finally {
      setIsFormatting(false);
    }
  };

  // Determine message icon and color
  let messageIcon = null;
  let messageColor = 'text-slate-600'; // Default message color
  if (message.includes('successful') || message.includes('Uploaded:') || message.includes('Selected:')) {
    messageIcon = <CheckCircle className="inline mr-2 h-5 w-5 text-green-500" />;
    messageColor = 'text-green-600';
  } else if (message.includes('failed') || message.includes('Please select')) {
    messageIcon = <XCircle className="inline mr-2 h-5 w-5 text-red-500" />;
    messageColor = 'text-red-600';
  }


  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.1 }}
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
        accept=".txt,.pdf,.doc,.docx,image/*" // Consider refining accepted types
      />

      {!selectedFile && !uploadedFilename && (
        <motion.button
          onClick={triggerFileSelect}
          disabled={isLoading || isFormatting}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-brand-primary text-white font-semibold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-150 ease-in-out flex items-center justify-center mb-4 shadow-md"
        >
          {isLoading ? <Spinner /> : <><UploadCloud className="mr-2 h-5 w-5" /> Choose File</>}
        </motion.button>
      )}

      {selectedFile && !uploadedFilename && (
        <div className="text-center mb-4">
          <p className="text-slate-600 mb-3 flex items-center justify-center">
            <FileText className="mr-2 h-5 w-5 text-slate-500" /> Selected: <span className="font-medium text-brand-dark ml-1">{selectedFile.name}</span>
          </p>
          <motion.button
            onClick={handleUpload}
            disabled={isLoading || isFormatting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-brand-secondary text-white font-semibold py-3 px-4 rounded-lg hover:bg-green-700 transition-colors duration-150 ease-in-out flex items-center justify-center shadow-md"
          >
            {isLoading ? <><Spinner /> Uploading...</> : <><UploadCloud className="mr-2 h-5 w-5" /> 1. Upload File</>}
          </motion.button>
        </div>
      )}
      
      {uploadedFilename && (
         <div className="text-center mb-4">
          <p className="text-slate-600 mb-3 flex items-center justify-center">
            <CheckCircle className="mr-2 h-5 w-5 text-green-500" /> Uploaded: <span className="font-medium text-brand-dark ml-1">{uploadedFilename}</span>
          </p>
          <motion.button
            onClick={handleFormat}
            disabled={isLoading || isFormatting}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="w-full bg-brand-accent text-brand-dark font-semibold py-3 px-4 rounded-lg hover:bg-amber-500 transition-colors duration-150 ease-in-out flex items-center justify-center shadow-md"
          >
            {isFormatting ? <><Spinner className="h-5 w-5 text-brand-dark"/> Formatting...</> : `2. Format "${uploadedFilename.substring(0,20)}${uploadedFilename.length > 20 ? '...' : ''}"`}
          </motion.button>
        </div>
      )}
      
      {message && !(message.includes('Selected:') || message.includes('Uploaded:')) && ( // Show general messages, not selection/uploaded status
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={`mt-4 text-center text-sm font-medium flex items-center justify-center ${messageColor}`}
        >
          {messageIcon} {message.replace(/✅|❌/g, '').trim()} {/* Remove emoji if icon is present */}
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
            className="inline-flex items-center justify-center bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition-colors duration-150 ease-in-out"
          >
            <Download className="mr-2 h-5 w-5" /> Download Formatted Document
          </a>
        </motion.div>
      )}
    </motion.div>
  );
};

export default UploadBox;

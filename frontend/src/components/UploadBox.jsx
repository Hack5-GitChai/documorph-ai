// frontend/src/components/UploadBox.jsx
import React, { useState } from 'react';
import { uploadDocument, formatDocumentAndGetBlob } from '../api'; // Import from our API service

const UploadBox = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadedFilename, setUploadedFilename] = useState(''); // To store the filename after successful upload
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formattedDocUrl, setFormattedDocUrl] = useState(null); // To store the URL for download link

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
    setUploadedFilename(''); // Reset if a new file is chosen
    setFormattedDocUrl(null); // Reset download link
    setMessage('');
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage('Please select a file first.');
      return;
    }

    setIsLoading(true);
    setMessage('Uploading file...');
    setFormattedDocUrl(null);


    try {
      const response = await uploadDocument(selectedFile);
      setMessage(`Upload successful: ${response.filename}. Ready to format.`);
      setUploadedFilename(response.filename); // Store the filename for the format step
    } catch (error) {
      setMessage(`Upload failed: ${error.message}`);
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
      
      // Create a URL for the Blob to make it downloadable
      const url = URL.createObjectURL(blob);
      setFormattedDocUrl(url); // Store the URL for the download link

      // Suggest a filename for download (optional, browser might use its own logic)
      // const link = document.createElement('a');
      // link.href = url;
      // link.setAttribute('download', `formatted_${uploadedFilename}.docx`); // or derive from response headers
      // document.body.appendChild(link);
      // link.click();
      // link.remove();
      // URL.revokeObjectURL(url); // Clean up

      setMessage(`Formatting successful for ${uploadedFilename}. Click below to download.`);
      
    } catch (error) {
      setMessage(`Formatting failed: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div style={{ border: '1px solid #ccc', padding: '20px', borderRadius: '8px', maxWidth: '500px', margin: '20px auto' }}>
      <h2>Upload and Format Document</h2>
      <input type="file" onChange={handleFileChange} disabled={isLoading} />
      
      <button onClick={handleUpload} disabled={isLoading || !selectedFile}>
        {isLoading && !uploadedFilename ? 'Uploading...' : '1. Upload Selected File'}
      </button>

      {uploadedFilename && (
        <button onClick={handleFormat} disabled={isLoading} style={{ marginLeft: '10px' }}>
          {isLoading && uploadedFilename ? 'Formatting...' : `2. Format "${uploadedFilename}"`}
        </button>
      )}
      
      {message && <p style={{ marginTop: '10px', color: message.includes('failed') ? 'red' : 'green' }}>{message}</p>}

      {formattedDocUrl && (
        <div style={{ marginTop: '20px' }}>
          <a 
            href={formattedDocUrl} 
            download={`${uploadedFilename.split('.')[0]}_formatted.docx`} // Suggests a download filename
            style={{
              padding: '10px 15px',
              backgroundColor: '#007bff',
              color: 'white',
              textDecoration: 'none',
              borderRadius: '5px'
            }}
          >
            Download Formatted Document
          </a>
        </div>
      )}
    </div>
  );
};

export default UploadBox;
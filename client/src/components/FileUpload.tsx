import React, { useState, useCallback } from 'react';
import { useMutation, gql } from '@apollo/client';

const UPLOAD_SCREENSHOT = gql`
  mutation UploadScreenshot($base64Image: String!) {
    uploadScreenshot(base64Image: $base64Image) {
      id
      title
      company
      date_applied
    }
  }
`;

const FileUpload: React.FC = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [file, setFile] = useState<File|null>(null);
  const [uploadScreenshot, { data, loading, error }] = useMutation(UPLOAD_SCREENSHOT, {
    refetchQueries: ['GetJobs']
  });

  const processFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64 = (ev.target?.result as string).split(',')[1];
      await uploadScreenshot({ variables: { base64Image: base64 }});
      setFile(null);
    };
    reader.readAsDataURL(file);
  };

  const onDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      if (file.type.startsWith('image/')) {
        setFile(file);
        processFile(file);
      }
    }
  }, []);

  const onDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setFile(file);
      processFile(file);
    }
  };

  return (
    <div
      className={`relative bg-white rounded-xl border border-gray-200 transition-all duration-300 
        ${isDragging ? 'ring-2 ring-blue-500' : ''}`}
    >
      <div
        className={`relative overflow-hidden rounded-xl border-2 border-dashed transition-all duration-300
          ${isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}
          ${loading ? 'opacity-50' : ''}`}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          id="fileInput"
        />
        <label 
          htmlFor="fileInput" 
          className="block cursor-pointer p-12 md:p-20 text-center"
        >
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="font-serif text-3xl text-gray-800">
              {loading ? 'Processing...' : 'Drop screenshot here'}
            </div>
            <div className="text-base text-gray-500 font-serif mt-2">
              PNG • JPG • JPEG
            </div>
          </div>
        </label>
      </div>
      
      {error && (
        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <div className="text-red-500 text-sm font-serif">
            {error.message}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileUpload;

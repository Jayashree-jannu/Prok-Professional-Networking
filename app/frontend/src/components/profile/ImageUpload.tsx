import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

interface ImageUploadProps {
  value?: File | null;
  onChange: (file: File | null) => void;
  progress?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange, progress }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setPreview(URL.createObjectURL(file));
      onChange(file);
    }
  }, [onChange]);

  React.useEffect(() => {
    if (value) {
      setPreview(URL.createObjectURL(value));
    } else {
      setPreview(null);
    }
    // Clean up preview URL
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  return (
    <div {...getRootProps()} className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition ${isDragActive ? 'border-blue-400 bg-blue-50' : 'border-gray-300 bg-gray-100'}`}>
      <input {...getInputProps()} />
      {preview ? (
        <img src={preview} alt="Preview" className="mx-auto mb-2 w-24 h-24 object-cover rounded-full border-2 border-blue-200" />
      ) : (
        <p className="text-gray-500">Drag & drop or click to select an image</p>
      )}
      {progress !== undefined && (
        <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
          <div className="bg-blue-400 h-2 rounded-full" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload; 
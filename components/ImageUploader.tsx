import React, { useCallback, useState } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';
import { fileToBase64 } from '../utils/fileUtils';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  onImageSelected: (image: ImageFile) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageSelected }) => {
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file (JPEG, PNG, WEBP)');
      return;
    }

    try {
      const base64 = await fileToBase64(file);
      const previewUrl = URL.createObjectURL(file);
      onImageSelected({
        file,
        previewUrl,
        base64,
        mimeType: file.type
      });
    } catch (error) {
      console.error('Error processing file:', error);
      alert('Failed to process image file.');
    }
  };

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [onImageSelected]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative group cursor-pointer
        flex flex-col items-center justify-center
        w-full h-80 rounded-2xl
        border-2 border-dashed transition-all duration-300
        ${isDragging 
          ? 'border-indigo-500 bg-indigo-500/10 scale-[1.02]' 
          : 'border-slate-600 hover:border-indigo-400 hover:bg-slate-800/50 bg-slate-800/20'
        }
      `}
    >
      <input
        type="file"
        accept="image/*"
        onChange={handleFileInput}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
      />
      
      <div className="flex flex-col items-center text-center p-6 space-y-4">
        <div className={`
          p-4 rounded-full transition-colors duration-300
          ${isDragging ? 'bg-indigo-500 text-white' : 'bg-slate-700 text-slate-300 group-hover:bg-slate-600'}
        `}>
          {isDragging ? <ImageIcon className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
        </div>
        
        <div className="space-y-1">
          <h3 className="text-lg font-semibold text-slate-200">
            {isDragging ? 'Drop image here' : 'Upload an image'}
          </h3>
          <p className="text-sm text-slate-400">
            Drag & drop or click to browse
          </p>
        </div>
        
        <div className="text-xs text-slate-500">
          Supports JPEG, PNG, WEBP up to 10MB
        </div>
      </div>
    </div>
  );
};

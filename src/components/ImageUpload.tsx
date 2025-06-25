import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { processImage, deleteFileFromSupabase } from '../utils/imageUtils';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  title: string;
  accept?: Record<string, string[]>;
  isLogo?: boolean;
}

export function ImageUpload({ value, onChange, title, accept = { 'image/*': [] }, isLogo = false }: ImageUploadProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    try {
      const imageUrl = await processImage(file);
      
      // Delete old image if it exists
      if (value) {
        try {
          await deleteFileFromSupabase('images', value);
        } catch (error) {
          console.error('Error deleting old image:', error);
        }
      }
      
      onChange(imageUrl);
      toast.success('Image chargée avec succès');
    } catch (error) {
      console.error('Error processing image:', error);
      toast.error('Erreur lors du traitement de l\'image');
    }
  }, [onChange, value]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept,
    maxFiles: 1,
    onDrop,
    maxSize: 10 * 1024 * 1024 // 10MB
  });

  const handleRemove = async () => {
    if (value) {
      try {
        await deleteFileFromSupabase('images', value);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    onChange('');
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">{title}</label>
      <div
        {...getRootProps()}
        className={`relative border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer
          ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-500'}`}
      >
        <input {...getInputProps()} />
        {value ? (
          <div className="relative">
            <img
              src={value}
              alt={title}
              className={`w-full ${isLogo ? 'h-20 object-contain' : 'h-32 object-cover'}`}
              style={isLogo ? { backgroundColor: 'transparent' } : undefined}
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center">
              {isDragActive ? (
                "Déposez l'image ici..."
              ) : (
                <>
                  Glissez une image ou cliquez pour sélectionner
                  <br />
                  <span className="text-xs opacity-75">
                    {accept['image/png'] ? 'Format PNG uniquement' : 'PNG, JPG, GIF acceptés'}
                    {' - Max 10MB'}
                  </span>
                </>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
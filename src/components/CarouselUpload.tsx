import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X } from 'lucide-react';
import { processImage, deleteFileFromSupabase } from '../utils/imageUtils';

interface CarouselUploadProps {
  images: string[];
  onChange: (images: string[]) => void;
}

export function CarouselUpload({ images, onChange }: CarouselUploadProps) {
  const onDrop = async (acceptedFiles: File[]) => {
    try {
      const newImageUrls = await Promise.all(
        acceptedFiles.map(file => processImage(file))
      );
      onChange([...images, ...newImageUrls]);
    } catch (error) {
      console.error('Error processing images:', error);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'image/*': [] },
    onDrop,
    multiple: true
  });

  const removeImage = async (index: number) => {
    const imageUrl = images[index];
    
    // Delete from Supabase Storage
    if (imageUrl) {
      try {
        await deleteFileFromSupabase('images', imageUrl);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }
    
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Images du carrousel
        </label>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-4 transition-colors cursor-pointer
            ${isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-500'}`}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center justify-center h-32">
            <Upload className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center">
              {isDragActive ? (
                "Déposez les images ici..."
              ) : (
                <>
                  Glissez plusieurs images ou cliquez pour sélectionner
                  <br />
                  <span className="text-xs opacity-75">
                    PNG, JPG, GIF acceptés - Sélection multiple possible
                  </span>
                </>
              )}
            </p>
          </div>
        </div>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`Image ${index + 1}`}
                className="w-full h-40 object-cover rounded-lg"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
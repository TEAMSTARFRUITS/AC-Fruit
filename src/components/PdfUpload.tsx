import React from 'react';
import { useDropzone } from 'react-dropzone';
import { FileText, X } from 'lucide-react';
import { uploadFileToSupabase, deleteFileFromSupabase } from '../utils/imageUtils';
import toast from 'react-hot-toast';

interface PdfUploadProps {
  value: string;
  onChange: (url: string) => void;
  title: string;
}

export function PdfUpload({ value, onChange, title }: PdfUploadProps) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'application/pdf': ['.pdf'] },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      try {
        if (file.size > 10 * 1024 * 1024) {
          throw new Error('Le fichier PDF ne doit pas dépasser 10MB');
        }

        const pdfUrl = await uploadFileToSupabase(file, 'documents', 'pdfs');
        
        // Delete old PDF if it exists
        if (value) {
          try {
            await deleteFileFromSupabase('documents', value);
          } catch (error) {
            console.error('Error deleting old PDF:', error);
          }
        }
        
        onChange(pdfUrl);
        toast.success('PDF chargé avec succès');
      } catch (error) {
        console.error('Error processing PDF:', error);
        toast.error(error instanceof Error ? error.message : 'Erreur lors du traitement du fichier PDF');
      }
    }
  });

  const handleRemove = async () => {
    if (value) {
      try {
        await deleteFileFromSupabase('documents', value);
      } catch (error) {
        console.error('Error deleting PDF:', error);
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
          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
            <div className="flex items-center">
              <FileText className="w-5 h-5 text-orange-600 mr-2" />
              <span className="text-sm text-gray-600">
                Fiche technique PDF
              </span>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleRemove();
              }}
              className="p-1 text-red-600 hover:bg-red-50 rounded-full"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-32">
            <FileText className="w-8 h-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 text-center">
              {isDragActive ? (
                "Déposez le fichier PDF ici..."
              ) : (
                <>
                  Glissez un fichier PDF ou cliquez pour sélectionner
                  <br />
                  <span className="text-xs opacity-75">
                    Format PDF uniquement - Max 10MB
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
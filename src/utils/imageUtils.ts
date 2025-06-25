import imageCompression from 'browser-image-compression';
import { supabase } from '../lib/supabaseClient';

export const compressImage = async (file: File): Promise<string> => {
  if (!file) return '';

  try {
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };

    const compressedFile = await imageCompression(file, options);
    return await fileToBase64(compressedFile);
  } catch (error) {
    console.error('Error compressing image:', error);
    throw error;
  }
};

export const fileToBase64 = (file: File | Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export const uploadFileToSupabase = async (file: File, bucket: string, path: string): Promise<string> => {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = path ? `${path}/${fileName}` : fileName;

    console.log(`Uploading file to Supabase: ${bucket}/${filePath}`);

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      throw new Error(`Erreur lors de l'upload: ${error.message}`);
    }

    console.log('Upload successful:', data);

    // Get public URL using getPublicUrl method
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);

    console.log('Generated public URL:', publicUrl);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file to Supabase:', error);
    throw error;
  }
};

export const deleteFileFromSupabase = async (bucket: string, path: string): Promise<void> => {
  try {
    // Extract file path from URL if it's a full URL
    let filePath = path;
    if (path.includes('/storage/v1/object/public/')) {
      const urlParts = path.split('/storage/v1/object/public/');
      if (urlParts.length > 1) {
        const pathParts = urlParts[1].split('/');
        pathParts.shift(); // Remove bucket name
        filePath = pathParts.join('/');
      }
    }

    console.log(`Deleting file from Supabase: ${bucket}/${filePath}`);

    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      // Don't throw error for delete operations to avoid blocking other operations
    } else {
      console.log('File deleted successfully');
    }
  } catch (error) {
    console.error('Error deleting file from Supabase:', error);
    // Don't throw error for delete operations
  }
};

export const processVideo = async (file: File): Promise<string> => {
  // Vérifier la taille (50MB max)
  if (file.size > 50 * 1024 * 1024) {
    throw new Error('La vidéo ne doit pas dépasser 50MB');
  }

  // Vérifier le type MIME avec plus de formats supportés
  const acceptedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi', 'video/mov'];
  if (!acceptedTypes.includes(file.type)) {
    throw new Error('Format de vidéo non supporté. Utilisez MP4, WebM, MOV ou AVI.');
  }

  // Upload to Supabase Storage and get proper public URL
  return await uploadFileToSupabase(file, 'videos', 'uploads');
};

export const processPdf = async (file: File): Promise<string> => {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('Le fichier PDF ne doit pas dépasser 10MB');
  }
  
  // Upload to Supabase Storage and get proper public URL
  return await uploadFileToSupabase(file, 'documents', 'pdfs');
};

export const processImage = async (file: File): Promise<string> => {
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('L\'image ne doit pas dépasser 10MB');
  }

  // Compress and upload to Supabase Storage
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true
  };

  const compressedFile = await imageCompression(file, options);
  return await uploadFileToSupabase(compressedFile, 'images', 'uploads');
};

// Fonction pour convertir les anciennes URLs en URLs publiques correctes
export const getCorrectPublicUrl = (url: string, bucket: string): string => {
  if (!url) return '';
  
  // Si c'est déjà une URL publique correcte, la retourner
  if (url.includes('/storage/v1/object/public/')) {
    return url;
  }
  
  // Si c'est une URL relative ou mal formée, essayer de la corriger
  if (url.startsWith('/storage/v1/')) {
    // Extraire le chemin du fichier
    const pathMatch = url.match(/\/storage\/v1\/[^/]+\/([^/]+)\/(.+)/);
    if (pathMatch) {
      const filePath = pathMatch[2];
      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);
      return publicUrl;
    }
  }
  
  // Si c'est juste un nom de fichier, construire l'URL
  if (!url.includes('http') && !url.includes('/')) {
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(`uploads/${url}`);
    return publicUrl;
  }
  
  return url;
};
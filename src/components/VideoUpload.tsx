import React, { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, Play, Youtube } from 'lucide-react';
import toast from 'react-hot-toast';
import { uploadFileToSupabase, deleteFileFromSupabase, getCorrectPublicUrl } from '../utils/imageUtils';
import type { VideoSource } from '../types/fruits';

interface VideoUploadProps {
  value: VideoSource;
  onChange: (value: VideoSource) => void;
  title: string;
}

export function VideoUpload({ value, onChange, title }: VideoUploadProps) {
  const [videoType, setVideoType] = useState<'local' | 'youtube'>(value?.type || 'local');
  const [loading, setLoading] = useState(false);

  const processVideo = async (file: File): Promise<string> => {
    // Vérifier la taille (50MB max)
    if (file.size > 50 * 1024 * 1024) {
      throw new Error('La vidéo ne doit pas dépasser 50MB');
    }

    // Vérifier le type MIME
    const acceptedTypes = ['video/mp4', 'video/webm', 'video/quicktime', 'video/avi', 'video/mov'];
    if (!acceptedTypes.includes(file.type)) {
      throw new Error('Format de vidéo non supporté. Utilisez MP4, WebM, MOV ou AVI.');
    }

    // Upload to Supabase Storage et obtenir l'URL publique correcte
    const publicUrl = await uploadFileToSupabase(file, 'videos', 'uploads');
    console.log('Video uploaded, public URL:', publicUrl);
    return publicUrl;
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'video/mp4': ['.mp4'],
      'video/webm': ['.webm'],
      'video/quicktime': ['.mov'],
      'video/avi': ['.avi']
    },
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      const file = acceptedFiles[0];
      if (!file) return;

      setLoading(true);
      try {
        const videoUrl = await processVideo(file);
        onChange({ type: 'local', url: videoUrl });
        toast.success('Vidéo chargée avec succès');
      } catch (error) {
        console.error('Error processing video:', error);
        toast.error(error instanceof Error ? error.message : 'Erreur lors du traitement de la vidéo');
      } finally {
        setLoading(false);
      }
    },
    disabled: videoType === 'youtube' || loading
  });

  const handleYoutubeUrlChange = (url: string) => {
    onChange({ type: 'youtube', url });
  };

  const getYoutubeEmbedUrl = (url: string) => {
    try {
      const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
    } catch {
      return '';
    }
  };

  const switchVideoType = async (type: 'local' | 'youtube') => {
    setVideoType(type);
    
    // Delete old video file if switching from local to youtube
    if (value?.type === 'local' && value.url && type === 'youtube') {
      try {
        await deleteFileFromSupabase('videos', value.url);
      } catch (error) {
        console.error('Error deleting old video:', error);
      }
    }
    
    onChange({ type, url: '' });
  };

  const removeVideo = async () => {
    // Delete file from Supabase Storage if it's a local video
    if (value?.type === 'local' && value.url) {
      try {
        await deleteFileFromSupabase('videos', value.url);
      } catch (error) {
        console.error('Error deleting video:', error);
      }
    }
    onChange({ type: 'local', url: '' });
  };

  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    const video = e.target as HTMLVideoElement;
    const error = video.error;
    
    console.error('Video error details:', {
      error: error,
      code: error?.code,
      message: error?.message,
      src: video.src,
      networkState: video.networkState,
      readyState: video.readyState
    });
    
    // Ne pas afficher d'erreur toast pour éviter de spammer l'utilisateur
    // L'erreur sera visible dans la console pour le debug
  };

  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
  };

  // Obtenir l'URL publique correcte pour la vidéo
  const getVideoUrl = () => {
    if (value?.type === 'local' && value.url) {
      return getCorrectPublicUrl(value.url, 'videos');
    }
    return value?.url || '';
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {title}
        </label>
        <div className="flex gap-4 mb-4">
          <button
            type="button"
            onClick={() => switchVideoType('local')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              videoType === 'local'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            disabled={loading}
          >
            <Upload className="w-4 h-4" />
            Vidéo locale
          </button>
          <button
            type="button"
            onClick={() => switchVideoType('youtube')}
            className={`flex-1 py-2 px-4 rounded-lg flex items-center justify-center gap-2 ${
              videoType === 'youtube'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 border border-gray-300'
            }`}
            disabled={loading}
          >
            <Youtube className="w-4 h-4" />
            YouTube
          </button>
        </div>
      </div>

      {videoType === 'local' ? (
        <div
          {...getRootProps()}
          className={`relative border-2 border-dashed rounded-lg p-4 transition-colors ${
            loading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
          } ${
            isDragActive ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-500'
          }`}
        >
          <input {...getInputProps()} />
          {value?.type === 'local' && value.url ? (
            <div className="relative">
              <video
                src={getVideoUrl()}
                controls
                controlsList="nodownload"
                className="w-full h-48 object-cover rounded-lg bg-black"
                preload="metadata"
                playsInline
                crossOrigin="anonymous"
                onError={handleVideoError}
                onLoadedData={handleVideoLoad}
                onCanPlay={handleVideoLoad}
              >
                <source src={getVideoUrl()} type="video/mp4" />
                <source src={getVideoUrl()} type="video/webm" />
                <source src={getVideoUrl()} type="video/quicktime" />
                Votre navigateur ne supporte pas la lecture de vidéos.
              </video>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeVideo();
                }}
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full p-1 hover:bg-red-700 transition-colors"
                disabled={loading}
              >
                <X className="w-4 h-4" />
              </button>
              <div className="absolute bottom-2 left-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                Vidéo chargée
              </div>
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
                URL: {getVideoUrl().substring(0, 30)}...
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-32">
              {loading ? (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600 mx-auto mb-2"></div>
                  <p className="text-sm text-gray-500">Upload en cours...</p>
                </div>
              ) : (
                <>
                  <Play className="w-8 h-8 text-gray-400 mb-2" />
                  <p className="text-sm text-gray-500 text-center">
                    {isDragActive ? (
                      "Déposez la vidéo ici..."
                    ) : (
                      <>
                        Glissez une vidéo ou cliquez pour sélectionner
                        <br />
                        <span className="text-xs opacity-75">
                          MP4, WebM, MOV, AVI acceptés - Max 50MB
                        </span>
                      </>
                    )}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <input
              type="url"
              value={value?.type === 'youtube' ? value.url : ''}
              onChange={(e) => handleYoutubeUrlChange(e.target.value)}
              placeholder="Collez l'URL de la vidéo YouTube (ex: https://www.youtube.com/watch?v=...)"
              className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Formats acceptés: youtube.com/watch?v=..., youtu.be/..., youtube.com/embed/...
            </p>
          </div>
          {value?.type === 'youtube' && value.url && getYoutubeEmbedUrl(value.url) && (
            <div className="relative aspect-video rounded-lg overflow-hidden bg-gray-100">
              <iframe
                src={getYoutubeEmbedUrl(value.url)}
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
                loading="lazy"
              />
            </div>
          )}
          {value?.type === 'youtube' && value.url && !getYoutubeEmbedUrl(value.url) && (
            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-sm text-yellow-800">
                URL YouTube non valide. Veuillez vérifier le format de l'URL.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
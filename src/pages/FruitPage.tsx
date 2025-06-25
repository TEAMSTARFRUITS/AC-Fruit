import React from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { FileDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useFruitStore } from '../store/fruitStore';
import { ImageCarousel } from '../components/ImageCarousel';
import { getCorrectPublicUrl } from '../utils/imageUtils';
import type { FruitCategory, FruitType } from '../types/fruits';

function FruitPage() {
  const { category, type, variety } = useParams<{ 
    category: FruitCategory;
    type?: FruitType;
    variety?: string;
  }>();
  const navigate = useNavigate();
  const { fruitData } = useFruitStore();
  
  if (!category || !fruitData[category]) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Fruit non trouvé</p>
      </div>
    );
  }

  const fruit = fruitData[category];

  // Si on affiche une variété spécifique
  if (variety || (type && !fruit.hasSubCategories)) {
    const varietyData = fruit.hasSubCategories 
      ? (fruit.varieties as Record<FruitType, Record<string, any>>)[type!]?.[variety!]
      : (fruit.varieties as Record<string, any>)[type || variety!];

    if (!varietyData) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <p className="text-xl text-gray-600">Variété non trouvée</p>
        </div>
      );
    }

    const handleDownload = () => {
      if (!varietyData.technicalSheet) return;
      
      const link = document.createElement('a');
      link.href = getCorrectPublicUrl(varietyData.technicalSheet, 'documents');
      link.download = `fiche-technique-${varietyData.name.toLowerCase()}.pdf`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    const getYoutubeEmbedUrl = (url: string) => {
      try {
        const videoId = url.match(/(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/user\/\S+|\/ytscreeningroom\?v=|\/sandalsResorts#\w\/\w\/.*\/))([^\/&\?]{10,12})/)?.[1];
        return videoId ? `https://www.youtube.com/embed/${videoId}` : '';
      } catch {
        return '';
      }
    };

    const renderVideo = () => {
      if (!varietyData.videoSource || !varietyData.videoSource.url) {
        return (
          <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
            <p className="text-gray-500">Aucune vidéo disponible</p>
          </div>
        );
      }

      if (varietyData.videoSource.type === 'youtube') {
        const embedUrl = getYoutubeEmbedUrl(varietyData.videoSource.url);
        if (!embedUrl) {
          return (
            <div className="aspect-video rounded-lg bg-gray-100 flex items-center justify-center">
              <p className="text-gray-500">URL YouTube non valide</p>
            </div>
          );
        }

        return (
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-lg">
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="lazy"
              title={`Vidéo de ${varietyData.name}`}
            />
          </div>
        );
      } else {
        // Obtenir l'URL publique correcte pour les vidéos locales
        const videoUrl = getCorrectPublicUrl(varietyData.videoSource.url, 'videos');
        console.log('Rendering video with URL:', videoUrl);

        return (
          <div className="aspect-video rounded-lg overflow-hidden bg-gray-100 shadow-lg relative">
            <video
              src={videoUrl}
              controls
              controlsList="nodownload"
              className="w-full h-full object-cover"
              preload="metadata"
              playsInline
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('Video playback error:', e);
                console.error('Video URL:', videoUrl);
                const video = e.target as HTMLVideoElement;
                const errorDiv = video.parentElement?.querySelector('.video-error');
                if (!errorDiv) {
                  const errorElement = document.createElement('div');
                  errorElement.className = 'video-error absolute inset-0 flex items-center justify-center bg-gray-100';
                  errorElement.innerHTML = '<p class="text-gray-500">Erreur de lecture de la vidéo</p>';
                  video.parentElement?.appendChild(errorElement);
                  video.style.display = 'none';
                }
              }}
              onLoadedData={() => {
                console.log('Video loaded successfully');
                const video = document.querySelector('video');
                const errorDiv = video?.parentElement?.querySelector('.video-error');
                if (errorDiv) {
                  errorDiv.remove();
                  if (video) video.style.display = 'block';
                }
              }}
            >
              <source src={videoUrl} type="video/mp4" />
              <source src={videoUrl} type="video/webm" />
              <source src={videoUrl} type="video/quicktime" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
            <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
              URL: {videoUrl.substring(0, 50)}...
            </div>
          </div>
        );
      }
    };

    return (
      <div className="p-8 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(fruit.hasSubCategories ? `/fruits/${category}/${type}` : `/fruits/${category}`)}
          className="flex items-center text-gray-600 hover:text-orange-600 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative h-96">
            <img
              src={varietyData.image}
              alt={varietyData.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
              <h1 className="text-4xl font-bold mb-2">
                {varietyData.name}
              </h1>
              {type && <p className="text-lg opacity-90 capitalize">Type: {type}</p>}
            </div>
          </div>
          
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="space-y-6">
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Description</h2>
                  <p className="text-gray-600 leading-relaxed">{varietyData.description}</p>
                </div>

                {varietyData.images && varietyData.images.length > 0 && (
                  <div>
                    <h2 className="text-2xl font-semibold mb-4">Galerie photos</h2>
                    <ImageCarousel images={varietyData.images} className="w-full" />
                  </div>
                )}
                
                <div>
                  <h2 className="text-2xl font-semibold mb-4">Documentation</h2>
                  {varietyData.technicalSheet ? (
                    <button
                      onClick={handleDownload}
                      className="inline-flex items-center px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors shadow-lg hover:shadow-xl"
                    >
                      <FileDown className="w-5 h-5 mr-2" />
                      Télécharger la fiche technique
                    </button>
                  ) : (
                    <p className="text-gray-500">Aucune fiche technique disponible</p>
                  )}
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-semibold mb-4">Vidéo de présentation</h2>
                {renderVideo()}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Si on affiche un type spécifique (jaune, blanche, etc.)
  if (type && fruit.hasSubCategories) {
    const varieties = (fruit.varieties as Record<FruitType, Record<string, any>>)[type];
    
    return (
      <div className="p-8 max-w-6xl mx-auto">
        <button
          onClick={() => navigate(`/fruits/${category}`)}
          className="flex items-center text-gray-600 hover:text-orange-600 mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Retour
        </button>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {fruit.name} <span className="text-orange-600 capitalize">- {type}</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {Object.entries(varieties || {}).map(([id, data]) => (
            <Link
              key={id}
              to={`/fruits/${category}/${type}/${id}`}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={data.image}
                  alt={data.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{data.name}</h2>
                <div className="flex items-center text-orange-600 font-medium group-hover:text-orange-700">
                  <span>Voir les détails</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  // Si on affiche la liste des types ou des variétés
  return (
    <div className="p-8 max-w-6xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-gray-600 hover:text-orange-600 mb-6 group"
      >
        <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
        Retour
      </button>

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          {fruit.name}
          {type && <span className="ml-2 text-orange-600 capitalize">- {type}</span>}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {fruit.hasSubCategories ? (
          // Afficher les types (jaune, blanche, etc.)
          ['jaune', 'blanche', 'sanguine', 'plate'].map(fruitType => (
            <Link
              key={fruitType}
              to={`/fruits/${category}/${fruitType}`}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow p-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 mb-4 capitalize">{fruitType}</h2>
              <div className="flex items-center text-orange-600 font-medium">
                <span>Voir les variétés</span>
                <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          ))
        ) : (
          // Afficher les variétés directement pour les abricots
          Object.entries(fruit.varieties as Record<string, any>).map(([id, data]) => (
            <Link
              key={id}
              to={`/fruits/${category}/${id}`}
              className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
            >
              <div className="aspect-[4/3] relative overflow-hidden">
                <img
                  src={data.image}
                  alt={data.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">{data.name}</h2>
                <div className="flex items-center text-orange-600 font-medium group-hover:text-orange-700">
                  <span>Voir les détails</span>
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

export default FruitPage;
import React from 'react';
import { FruitCard } from '../components/FruitCard';
import { useFruitStore } from '../store/fruitStore';
import { useAppearanceStore } from '../store/appearanceStore';
import { getCorrectPublicUrl } from '../utils/imageUtils';

function Home() {
  const { appearance } = useAppearanceStore();
  const { fruitData } = useFruitStore();

  // Utiliser les données des fruits depuis le store au lieu des données statiques
  const fruitCategories = Object.entries(fruitData).map(([category, fruit]) => {
    // Obtenir la première image disponible pour chaque catégorie
    let firstImage = 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80';
    
    if (fruit.hasSubCategories) {
      const varieties = fruit.varieties as Record<string, Record<string, any>>;
      const firstType = Object.values(varieties)[0];
      if (firstType && Object.keys(firstType).length > 0) {
        const firstVariety = Object.values(firstType)[0];
        if (firstVariety && firstVariety.image) {
          firstImage = firstVariety.image;
        }
      }
    } else {
      const varieties = fruit.varieties as Record<string, any>;
      if (Object.keys(varieties).length > 0) {
        const firstVariety = Object.values(varieties)[0];
        if (firstVariety && firstVariety.image) {
          firstImage = firstVariety.image;
        }
      }
    }

    return {
      category,
      name: fruit.name,
      image: firstImage
    };
  });

  // Obtenir l'URL correcte pour la vidéo d'en-tête
  const getHeaderVideoUrl = () => {
    if (appearance.headerVideo) {
      return getCorrectPublicUrl(appearance.headerVideo, 'videos');
    }
    return '';
  };

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <div className="relative h-48 md:h-72 lg:h-96 rounded-xl overflow-hidden mb-8">
          {appearance.useVideo && appearance.headerVideo ? (
            <video
              className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
              controls
              controlsList="nodownload"
              preload="metadata"
              crossOrigin="anonymous"
              onError={(e) => {
                console.error('Header video error:', e);
                console.error('Header video URL:', getHeaderVideoUrl());
              }}
              onLoadedData={() => {
                console.log('Header video loaded successfully');
              }}
            >
              <source src={getHeaderVideoUrl()} type="video/mp4" />
              <source src={getHeaderVideoUrl()} type="video/webm" />
              <source src={getHeaderVideoUrl()} type="video/quicktime" />
              Votre navigateur ne supporte pas la lecture de vidéos.
            </video>
          ) : (
            <img
              src={appearance.headerImage}
              alt="Fruits collection"
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('Header image failed to load:', appearance.headerImage);
                // Fallback vers l'image par défaut
                const target = e.target as HTMLImageElement;
                if (target.src !== 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80') {
                  target.src = 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80';
                }
              }}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent flex items-center">
            <div className="text-white p-4 md:p-8">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-2 md:mb-4">
                {appearance.headerTitle || 'Bienvenue chez AC Fruit'}
              </h1>
              <p className="text-lg md:text-xl mb-4 md:mb-6">
                {appearance.headerSubtitle || 'Découvrez nos fruits d\'exception'}
              </p>
            </div>
          </div>
          {appearance.logo && appearance.logo.trim() !== '' && (
            <div className="absolute top-4 right-4 w-20 md:w-32">
              <img 
                src={appearance.logo} 
                alt="Logo" 
                className="w-full h-auto"
                style={{ 
                  backgroundColor: 'transparent',
                  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))'
                }}
                onError={(e) => {
                  console.error('Logo failed to load in header:', appearance.logo);
                  // Masquer le logo s'il ne charge pas
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                }}
              />
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 mb-8">
          {fruitCategories.map(({ category, name, image }) => (
            <FruitCard
              key={category}
              category={category}
              name={name}
              image={image}
            />
          ))}
        </div>

        {appearance.homepageBanner && appearance.homepageBanner.trim() !== '' && (
          <div className="w-full overflow-hidden rounded-xl shadow-lg">
            <img
              src={appearance.homepageBanner}
              alt="Bannière"
              className="w-full h-auto object-cover"
              onError={(e) => {
                console.error('Homepage banner failed to load:', appearance.homepageBanner);
                // Masquer la bannière si elle ne charge pas
                const target = e.target as HTMLImageElement;
                target.parentElement!.style.display = 'none';
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
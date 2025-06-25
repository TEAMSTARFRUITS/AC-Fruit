import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { useAppearanceStore } from '../store/appearanceStore';

interface FruitCardProps {
  category: string;
  name: string;
  image: string;
  isSubCategory?: boolean;
  type?: string;
}

export function FruitCard({ category, name, image, isSubCategory = false, type }: FruitCardProps) {
  const { appearance } = useAppearanceStore();
  
  // Utiliser l'image de catégorie personnalisée si disponible, sinon utiliser l'image fournie
  const displayImage = appearance.categoryImages[category] && appearance.categoryImages[category].trim() !== '' 
    ? appearance.categoryImages[category] 
    : image;
    
  const path = type ? `/fruits/${category}/${type}` : `/fruits/${category}`;

  return (
    <Link
      to={path}
      className="group bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow"
    >
      {!isSubCategory && (
        <div className="aspect-[4/3] relative overflow-hidden">
          <img
            src={displayImage}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            onError={(e) => {
              // Fallback vers l'image par défaut en cas d'erreur
              const target = e.target as HTMLImageElement;
              if (target.src !== image) {
                target.src = image;
              }
            }}
          />
        </div>
      )}
      <div className="p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">{name}</h2>
        <div className="flex items-center text-orange-600 font-medium group-hover:text-orange-700">
          <span>Voir les variétés</span>
          <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </Link>
  );
}
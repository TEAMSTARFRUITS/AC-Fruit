import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { FruitVariety } from '../types/fruits';

interface VarietyCardProps {
  category: string;
  type?: string;
  varietyId: string;
  variety: FruitVariety;
}

export function VarietyCard({ category, type, varietyId, variety }: VarietyCardProps) {
  const path = type 
    ? `/fruits/${category}/${type}`
    : `/fruits/${category}/${varietyId}`;

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow">
      <Link
        to={path}
        className="block p-6"
      >
        <h2 className="text-2xl font-bold text-gray-900 mb-4 capitalize">
          {type}
        </h2>
        <div className="flex items-center text-orange-600 font-medium group-hover:text-orange-700">
          <span>Voir les variétés</span>
          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
        </div>
      </Link>
    </div>
  );
}
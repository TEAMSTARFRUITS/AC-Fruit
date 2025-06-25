import React, { useState } from 'react';
import { Edit2, Trash2, ArrowUpDown } from 'lucide-react';
import { useFruitStore } from '../store/fruitStore';
import type { FruitVariety } from '../types/fruits';

interface VarietyListProps {
  category: string;
  type?: string;
  onEdit: (variety: { id: string } & FruitVariety) => void;
}

export function VarietyList({ category, type, onEdit }: VarietyListProps) {
  const { fruitData, loading, error } = useFruitStore();
  const [sortByMaturity, setSortByMaturity] = useState(false);

  // Gestion des états de chargement et d'erreur
  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8 text-red-600">
        Une erreur est survenue lors du chargement des données
      </div>
    );
  }

  // Vérification de la catégorie
  if (!category || !fruitData[category]) {
    return (
      <div className="text-center py-8 text-gray-500">
        Catégorie non trouvée
      </div>
    );
  }

  const fruit = fruitData[category];

  // Récupération des variétés selon la structure
  const varieties = fruit.hasSubCategories && type
    ? (fruit.varieties as Record<string, Record<string, FruitVariety>>)[type]
    : fruit.varieties as Record<string, FruitVariety>;

  if (!varieties || Object.keys(varieties).length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucune variété disponible
      </div>
    );
  }

  const handleDelete = (varietyId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette variété ?')) {
      useFruitStore.getState().deleteVariety(category, type || null, varietyId);
    }
  };

  const formatDate = (period?: { startDay?: number; startMonth?: number; endDay?: number; endMonth?: number }) => {
    if (!period) return '';
    const formatNumber = (num?: number) => num ? num.toString().padStart(2, '0') : '00';
    return `${formatNumber(period.startDay)}/${formatNumber(period.startMonth)} au ${formatNumber(period.endDay)}/${formatNumber(period.endMonth)}`;
  };

  const sortedVarieties = Object.entries(varieties).sort(([, a], [, b]) => {
    if (!sortByMaturity) return 0;
    const aMonth = a.maturityPeriod?.startMonth || 0;
    const bMonth = b.maturityPeriod?.startMonth || 0;
    if (aMonth === bMonth) {
      const aDay = a.maturityPeriod?.startDay || 0;
      const bDay = b.maturityPeriod?.startDay || 0;
      return aDay - bDay;
    }
    return aMonth - bMonth;
  });

  return (
    <div>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setSortByMaturity(!sortByMaturity)}
          className={`flex items-center px-4 py-2 rounded-lg transition-colors ${
            sortByMaturity 
              ? 'bg-orange-600 text-white' 
              : 'bg-white text-gray-700 hover:bg-orange-50'
          }`}
        >
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Trier par maturité
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sortedVarieties.map(([id, variety]) => (
          <div key={id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={variety.image}
              alt={variety.name}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2">{variety.name}</h3>
              {variety.maturityPeriod && (
                <p className="text-sm text-orange-600 mb-2">
                  Maturité : {formatDate(variety.maturityPeriod)}
                </p>
              )}
              <p className="text-gray-600 text-sm mb-4">{variety.description}</p>
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => onEdit({ id, ...variety })}
                  className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                  title="Modifier"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(id)}
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  title="Supprimer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
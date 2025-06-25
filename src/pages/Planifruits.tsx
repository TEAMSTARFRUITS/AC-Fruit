import React from 'react';
import { Link } from 'react-router-dom';
import { usePlanifruitStore } from '../store/planifruitStore';

export default function Planifruits() {
  const { planifruits } = usePlanifruitStore();

  // Grouper les planifruits par catégorie
  const groupedPlanifruits = planifruits.reduce((acc, planifruit) => {
    const key = planifruit.type 
      ? `${planifruit.category}-${planifruit.type}`
      : planifruit.category;
    
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(planifruit);
    return acc;
  }, {} as Record<string, typeof planifruits>);

  return (
    <div className="min-h-screen p-4 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Planifruits</h1>
        
        <div className="space-y-8">
          {Object.entries(groupedPlanifruits).map(([key, items]) => {
            const planifruit = items[0];
            const title = planifruit.type 
              ? `${planifruit.category} - ${planifruit.type}`
              : planifruit.category;

            return (
              <Link
                key={key}
                to={`/planifruits/${planifruit.category}${planifruit.type ? `/${planifruit.type}` : ''}`}
                className="block bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <div className="aspect-[16/9] relative">
                  <img
                    src={planifruit.image}
                    alt={title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-6">
                  <h2 className="text-2xl font-bold text-gray-900 capitalize">
                    {title}
                  </h2>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
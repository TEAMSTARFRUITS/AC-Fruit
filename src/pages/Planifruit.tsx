import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Download, ArrowLeft } from 'lucide-react';
import { usePlanifruitStore } from '../store/planifruitStore';

export default function Planifruit() {
  const { category, type } = useParams<{ category: string; type?: string }>();
  const { planifruits } = usePlanifruitStore();

  // Si nous sommes sur la page principale des planifruits
  if (!category) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Planifruits</h1>
          
          {planifruits.length === 0 ? (
            <div className="text-center text-gray-500 py-8">
              Aucun planifruit disponible pour le moment
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {planifruits.map((planifruit) => (
                <Link
                  key={planifruit.id}
                  to={`/planifruits/${planifruit.category}${planifruit.type ? `/${planifruit.type}` : ''}`}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                >
                  <div className="aspect-[4/3] relative overflow-hidden">
                    <img
                      src={planifruit.image}
                      alt={`Planifruit ${planifruit.category} ${planifruit.type || ''}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2 capitalize">
                      {planifruit.category} {planifruit.type && `- ${planifruit.type}`}
                    </h2>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // Si nous sommes sur une page spécifique de planifruit
  const planifruit = planifruits.find(p => 
    p.category === category && (!type || p.type === type)
  );

  if (!planifruit) {
    return (
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <Link
            to="/planifruits"
            className="flex items-center text-gray-600 hover:text-orange-600 mb-8 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Retour aux planifruits
          </Link>
          <div className="bg-white rounded-xl shadow-lg p-6 text-center text-gray-500">
            Aucun planifruit disponible pour cette catégorie
          </div>
        </div>
      </div>
    );
  }

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = planifruit.image;
    link.download = `planifruit-${category}${type ? `-${type}` : ''}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="p-8">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/planifruits"
          className="flex items-center text-gray-600 hover:text-orange-600 mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
          Retour aux planifruits
        </Link>

        <h1 className="text-3xl font-bold text-gray-900 mb-8 capitalize">
          Planifruit {planifruit.category} {planifruit.type && `- ${planifruit.type}`}
        </h1>

        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="relative">
            <img
              src={planifruit.image}
              alt={`Planifruit ${planifruit.category} ${planifruit.type || ''}`}
              className="w-full h-auto"
            />
            <button
              onClick={handleDownload}
              className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-3 hover:bg-gray-100 transition-colors"
              title="Télécharger l'image"
            >
              <Download className="w-6 h-6 text-gray-700" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
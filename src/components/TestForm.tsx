import React, { useState } from 'react';
import { insertData } from '../lib/insert';
import toast from 'react-hot-toast';

export default function TestForm() {
  const [nom, setNom] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await insertData('fruits', {
        category: 'abricots',
        name: nom,
        description: 'Description test',
        image: 'https://images.unsplash.com/photo-1595411425732-e46469c14b8c'
      });
      
      setNom('');
      toast.success('Fruit ajouté avec succès !');
    } catch (error) {
      toast.error('Erreur lors de l\'ajout du fruit');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-sm mx-auto p-4 space-y-4">
      <div>
        <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
          Nom du fruit
        </label>
        <input
          id="nom"
          type="text"
          value={nom}
          onChange={e => setNom(e.target.value)}
          placeholder="Entrez le nom du fruit"
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>
      
      <button
        type="submit"
        disabled={loading}
        className="w-full px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-300 flex items-center justify-center"
      >
        {loading ? 'Ajout en cours...' : 'Ajouter le fruit'}
      </button>
    </form>
  );
}
import React, { useState } from 'react';
import { Save, X } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { usePlanifruitStore } from '../store/planifruitStore';
import toast from 'react-hot-toast';
import type { Planifruit } from '../types/planifruits';

interface PlanifruitFormProps {
  planifruit?: Planifruit;
  onClose: () => void;
}

export function PlanifruitForm({ planifruit, onClose }: PlanifruitFormProps) {
  const [formState, setFormState] = useState<Partial<Planifruit>>({
    category: planifruit?.category || '',
    type: planifruit?.type || '',
    image: planifruit?.image || '',
  });
  const [loading, setLoading] = useState(false);
  const { addPlanifruit, updatePlanifruit } = usePlanifruitStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formState.category) {
      toast.error('Veuillez sélectionner une catégorie');
      return;
    }

    if ((formState.category === 'peches' || formState.category === 'nectarines') && !formState.type) {
      toast.error('Veuillez sélectionner un type');
      return;
    }

    if (!formState.image) {
      toast.error('Veuillez ajouter une image');
      return;
    }

    setLoading(true);
    try {
      if (planifruit) {
        await updatePlanifruit(planifruit.id, formState);
        toast.success('Planifruit mis à jour avec succès');
      } else {
        await addPlanifruit({
          category: formState.category!,
          type: formState.type,
          image: formState.image!
        });
        toast.success('Planifruit ajouté avec succès');
      }
      onClose();
    } catch (error) {
      console.error('Error saving planifruit:', error);
      toast.error('Une erreur est survenue lors de l\'enregistrement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {planifruit ? 'Modifier le Planifruit' : 'Nouveau Planifruit'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catégorie <span className="text-red-500">*</span>
          </label>
          <select
            value={formState.category}
            onChange={(e) => setFormState(prev => ({ ...prev, category: e.target.value, type: '' }))}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          >
            <option value="">Sélectionner une catégorie</option>
            <option value="abricots">Abricots</option>
            <option value="peches">Pêches</option>
            <option value="nectarines">Nectarines</option>
          </select>
        </div>

        {(formState.category === 'peches' || formState.category === 'nectarines') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Type <span className="text-red-500">*</span>
            </label>
            <select
              value={formState.type}
              onChange={(e) => setFormState(prev => ({ ...prev, type: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              required
            >
              <option value="">Sélectionner un type</option>
              <option value="jaune">Jaune</option>
              <option value="blanche">Blanche</option>
              <option value="sanguine">Sanguine</option>
              <option value="plate">Plate</option>
            </select>
          </div>
        )}

        <ImageUpload
          value={formState.image || ''}
          onChange={(value) => setFormState(prev => ({ ...prev, image: value }))}
          title="Image du Planifruit *"
        />

        <div className="flex justify-end space-x-3 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-300 flex items-center"
          >
            <Save className="w-4 h-4 mr-2" />
            {loading ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </form>
    </div>
  );
}
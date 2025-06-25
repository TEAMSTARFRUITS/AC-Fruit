import React, { useState } from 'react';
import { useFruitStore } from '../../store/fruitStore';
import { ImageUpload } from '../ImageUpload';
import { PdfUpload } from '../PdfUpload';
import { CarouselUpload } from '../CarouselUpload';
import { VideoUpload } from '../VideoUpload';
import { Save, X } from 'lucide-react';
import toast from 'react-hot-toast';
import type { FruitVariety } from '../../types/fruits';

interface VarietyFormProps {
  category: string;
  type?: string;
  editingVariety?: { id: string } & FruitVariety;
  onClose: () => void;
}

export function VarietyForm({ category, type, editingVariety, onClose }: VarietyFormProps) {
  const { addVariety, updateVariety } = useFruitStore();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState<FruitVariety>({
    name: editingVariety?.name || '',
    description: editingVariety?.description || '',
    image: editingVariety?.image || '',
    technicalSheet: editingVariety?.technicalSheet || '',
    videoUrl: editingVariety?.videoUrl || '',
    videoSource: editingVariety?.videoSource || { type: 'local', url: '' },
    images: editingVariety?.images || [],
    maturityPeriod: editingVariety?.maturityPeriod || {
      startDay: 1,
      startMonth: 1,
      endDay: 31,
      endMonth: 12
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.name || !formState.description || !formState.image) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      if (editingVariety) {
        updateVariety(category, type || null, editingVariety.id, formState);
        toast.success('Variété mise à jour avec succès');
      } else {
        const id = Date.now().toString();
        addVariety(category, type || null, { ...formState, id });
        toast.success('Variété ajoutée avec succès');
      }
      onClose();
    } catch (error) {
      console.error('Error saving variety:', error);
      toast.error('Erreur lors de l\'enregistrement de la variété');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">
          {editingVariety ? 'Modifier la variété' : 'Nouvelle variété'}
        </h2>
        <button
          type="button"
          onClick={onClose}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nom <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formState.name}
          onChange={(e) => setFormState(prev => ({ ...prev, name: e.target.value }))}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Description <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formState.description}
          onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
          className="w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          rows={4}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Début de maturité
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="1"
              max="31"
              value={formState.maturityPeriod?.startDay}
              onChange={(e) => setFormState(prev => ({
                ...prev,
                maturityPeriod: {
                  ...prev.maturityPeriod!,
                  startDay: parseInt(e.target.value)
                }
              }))}
              className="rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              placeholder="Jour"
            />
            <input
              type="number"
              min="1"
              max="12"
              value={formState.maturityPeriod?.startMonth}
              onChange={(e) => setFormState(prev => ({
                ...prev,
                maturityPeriod: {
                  ...prev.maturityPeriod!,
                  startMonth: parseInt(e.target.value)
                }
              }))}
              className="rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              placeholder="Mois"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fin de maturité
          </label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="number"
              min="1"
              max="31"
              value={formState.maturityPeriod?.endDay}
              onChange={(e) => setFormState(prev => ({
                ...prev,
                maturityPeriod: {
                  ...prev.maturityPeriod!,
                  endDay: parseInt(e.target.value)
                }
              }))}
              className="rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              placeholder="Jour"
            />
            <input
              type="number"
              min="1"
              max="12"
              value={formState.maturityPeriod?.endMonth}
              onChange={(e) => setFormState(prev => ({
                ...prev,
                maturityPeriod: {
                  ...prev.maturityPeriod!,
                  endMonth: parseInt(e.target.value)
                }
              }))}
              className="rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              placeholder="Mois"
            />
          </div>
        </div>
      </div>

      <ImageUpload
        value={formState.image}
        onChange={(value) => setFormState(prev => ({ ...prev, image: value }))}
        title="Image principale *"
      />

      <CarouselUpload
        images={formState.images || []}
        onChange={(images) => setFormState(prev => ({ ...prev, images }))}
      />

      <VideoUpload
        value={formState.videoSource || { type: 'local', url: '' }}
        onChange={(value) => setFormState(prev => ({ ...prev, videoSource: value }))}
        title="Vidéo de présentation"
      />

      <PdfUpload
        value={formState.technicalSheet}
        onChange={(value) => setFormState(prev => ({ ...prev, technicalSheet: value }))}
        title="Fiche technique (PDF)"
      />

      <div className="flex justify-end space-x-3">
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
  );
}
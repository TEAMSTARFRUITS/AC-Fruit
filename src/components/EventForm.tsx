import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { useEventStore } from '../store/eventStore';
import toast from 'react-hot-toast';
import type { Event } from '../types/events';

interface EventFormProps {
  event?: Event;
  onClose: () => void;
}

export function EventForm({ event, onClose }: EventFormProps) {
  const [formState, setFormState] = useState<Partial<Event>>({
    title: event?.title || '',
    description: event?.description || '',
    startDate: event?.startDate || '',
    endDate: event?.endDate || '',
    image: event?.image || '',
    location: event?.location || '',
    published: event?.published ?? true,
  });
  const [loading, setLoading] = useState(false);
  const { addEvent, updateEvent } = useEventStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.startDate || !formState.endDate || !formState.location) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (new Date(formState.endDate!) < new Date(formState.startDate!)) {
      toast.error('La date de fin doit être postérieure à la date de début');
      return;
    }

    setLoading(true);
    try {
      if (event) {
        await updateEvent(event.id, formState);
        toast.success('Événement mis à jour avec succès');
      } else {
        await addEvent({
          title: formState.title!,
          description: formState.description!,
          startDate: formState.startDate!,
          endDate: formState.endDate!,
          image: formState.image!,
          location: formState.location!,
          published: formState.published!
        });
        toast.success('Événement ajouté avec succès');
      }
      onClose();
    } catch (error) {
      toast.error('Une erreur est survenue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Titre <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formState.title}
          onChange={(e) => setFormState(prev => ({ ...prev, title: e.target.value }))}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          value={formState.description}
          onChange={(e) => setFormState(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Lieu <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          value={formState.location}
          onChange={(e) => setFormState(prev => ({ ...prev, location: e.target.value }))}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date de début <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formState.startDate}
            onChange={(e) => setFormState(prev => ({ ...prev, startDate: e.target.value }))}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Date de fin <span className="text-red-500">*</span>
          </label>
          <input
            type="date"
            value={formState.endDate}
            onChange={(e) => setFormState(prev => ({ ...prev, endDate: e.target.value }))}
            className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            required
          />
        </div>
      </div>

      <ImageUpload
        value={formState.image || ''}
        onChange={(value) => setFormState(prev => ({ ...prev, image: value }))}
        title="Image de l'événement"
      />

      <div className="flex items-center">
        <input
          type="checkbox"
          id="published"
          checked={formState.published}
          onChange={(e) => setFormState(prev => ({ ...prev, published: e.target.checked }))}
          className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
        />
        <label htmlFor="published" className="ml-2 text-sm text-gray-700">
          Publier l'événement
        </label>
      </div>

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
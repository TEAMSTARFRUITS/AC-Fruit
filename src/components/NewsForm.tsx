import React, { useState } from 'react';
import { Save } from 'lucide-react';
import { ImageUpload } from './ImageUpload';
import { useNewsStore } from '../store/newsStore';
import toast from 'react-hot-toast';
import type { NewsArticle } from '../types/news';

interface NewsFormProps {
  article?: NewsArticle;
  onClose: () => void;
}

export function NewsForm({ article, onClose }: NewsFormProps) {
  const [formState, setFormState] = useState<Partial<NewsArticle>>({
    title: article?.title || '',
    content: article?.content || '',
    image: article?.image || '',
    published: article?.published ?? true,
  });
  const [loading, setLoading] = useState(false);
  const { addArticle, updateArticle } = useNewsStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.content || !formState.image) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    setLoading(true);
    try {
      if (article) {
        await updateArticle(article.id, formState);
        toast.success('Article mis à jour avec succès');
      } else {
        await addArticle({
          title: formState.title!,
          content: formState.content!,
          image: formState.image!,
          published: formState.published!,
          date: new Date().toISOString()
        });
        toast.success('Article ajouté avec succès');
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
          Contenu <span className="text-red-500">*</span>
        </label>
        <textarea
          value={formState.content}
          onChange={(e) => setFormState(prev => ({ ...prev, content: e.target.value }))}
          rows={6}
          className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
          required
        />
      </div>

      <ImageUpload
        value={formState.image || ''}
        onChange={(value) => setFormState(prev => ({ ...prev, image: value }))}
        title="Image de l'article *"
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
          Publier l'article
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
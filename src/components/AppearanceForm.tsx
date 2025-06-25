import React, { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAppearanceStore } from '../store/appearanceStore';
import { ImageUpload } from './ImageUpload';
import { VideoUpload } from './VideoUpload';

export function AppearanceForm() {
  const { appearance, updateAppearance } = useAppearanceStore();
  const [loading, setLoading] = useState(false);
  const [formState, setFormState] = useState({
    headerImage: appearance.headerImage,
    headerVideo: appearance.headerVideo,
    useVideo: appearance.useVideo,
    headerTitle: appearance.headerTitle,
    headerSubtitle: appearance.headerSubtitle,
    logo: appearance.logo,
    categoryImages: { ...appearance.categoryImages },
    categoryIcons: { ...appearance.categoryIcons },
    homepageBanner: appearance.homepageBanner,
    companyName: appearance.companyName,
    address: appearance.address,
    phone: appearance.phone,
    email: appearance.email,
    website: appearance.website,
    socialMedia: { ...appearance.socialMedia },
    mapsEmbedUrl: appearance.mapsEmbedUrl
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await updateAppearance(formState);
      toast.success('Apparence mise à jour avec succès');
    } catch (error) {
      toast.error('Erreur lors de la mise à jour de l\'apparence');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-6">En-tête</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Titre de l'en-tête
            </label>
            <input
              type="text"
              value={formState.headerTitle}
              onChange={(e) => setFormState(prev => ({ ...prev, headerTitle: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Sous-titre de l'en-tête
            </label>
            <input
              type="text"
              value={formState.headerSubtitle}
              onChange={(e) => setFormState(prev => ({ ...prev, headerSubtitle: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="useVideo"
              checked={formState.useVideo}
              onChange={(e) => setFormState(prev => ({ ...prev, useVideo: e.target.checked }))}
              className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
            />
            <label htmlFor="useVideo" className="text-sm font-medium text-gray-700">
              Utiliser une vidéo plutôt qu'une image
            </label>
          </div>

          {formState.useVideo ? (
            <VideoUpload
              value={{ type: 'local', url: formState.headerVideo }}
              onChange={(value) => setFormState(prev => ({ ...prev, headerVideo: value.url }))}
              title="Vidéo d'arrière-plan"
            />
          ) : (
            <ImageUpload
              value={formState.headerImage}
              onChange={(value) => setFormState(prev => ({ ...prev, headerImage: value }))}
              title="Image d'arrière-plan"
            />
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-6">Logo</h2>
        <ImageUpload
          value={formState.logo}
          onChange={(value) => setFormState(prev => ({ ...prev, logo: value }))}
          title="Logo (PNG transparent recommandé)"
          accept={{ 'image/png': ['.png'] }}
          isLogo
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-6">Images des catégories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(formState.categoryImages).map(([category, image]) => (
            <ImageUpload
              key={category}
              value={image}
              onChange={(value) => setFormState(prev => ({
                ...prev,
                categoryImages: {
                  ...prev.categoryImages,
                  [category]: value
                }
              }))}
              title={`Image ${category}`}
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-6">Pictogrammes des catégories</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Object.entries(formState.categoryIcons).map(([category, icon]) => (
            <ImageUpload
              key={category}
              value={icon}
              onChange={(value) => setFormState(prev => ({
                ...prev,
                categoryIcons: {
                  ...prev.categoryIcons,
                  [category]: value
                }
              }))}
              title={`Pictogramme ${category}`}
              accept={{ 'image/png': ['.png'] }}
              isLogo
            />
          ))}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-6">Bannière page d'accueil</h2>
        <ImageUpload
          value={formState.homepageBanner}
          onChange={(value) => setFormState(prev => ({ ...prev, homepageBanner: value }))}
          title="Bannière (image responsive recommandée)"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-semibold mb-6">Informations de contact</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              value={formState.companyName}
              onChange={(e) => setFormState(prev => ({ ...prev, companyName: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Adresse postale
            </label>
            <textarea
              value={formState.address}
              onChange={(e) => setFormState(prev => ({ ...prev, address: e.target.value }))}
              rows={3}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Numéro de téléphone
            </label>
            <input
              type="tel"
              value={formState.phone}
              onChange={(e) => setFormState(prev => ({ ...prev, phone: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Adresse e-mail
            </label>
            <input
              type="email"
              value={formState.email}
              onChange={(e) => setFormState(prev => ({ ...prev, email: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Site internet
            </label>
            <input
              type="url"
              value={formState.website}
              onChange={(e) => setFormState(prev => ({ ...prev, website: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              placeholder="https://"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Réseaux sociaux
            </label>
            <div className="space-y-3">
              {Object.entries(formState.socialMedia).map(([platform, url]) => (
                <div key={platform}>
                  <label className="block text-sm font-medium text-gray-600 capitalize">
                    {platform}
                  </label>
                  <input
                    type="url"
                    value={url}
                    onChange={(e) => setFormState(prev => ({
                      ...prev,
                      socialMedia: {
                        ...prev.socialMedia,
                        [platform]: e.target.value
                      }
                    }))}
                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                    placeholder="https://"
                  />
                </div>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              URL d'intégration Google Maps
            </label>
            <input
              type="url"
              value={formState.mapsEmbedUrl}
              onChange={(e) => setFormState(prev => ({ ...prev, mapsEmbedUrl: e.target.value }))}
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
              placeholder="https://www.google.com/maps/embed?..."
            />
            <p className="mt-1 text-sm text-gray-500">
              Collez ici l'URL d'intégration de Google Maps (iframe src)
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-orange-300 flex items-center"
        >
          <Save className="w-4 h-4 mr-2" />
          {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
        </button>
      </div>
    </form>
  );
}
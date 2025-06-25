import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { LogOut, Plus, Calendar as CalendarIcon, Palette, ExternalLink, Newspaper, CalendarDays, Table, Database } from 'lucide-react';
import toast from 'react-hot-toast';
import { VarietyForm } from '../components/VarietyForm';
import { VarietyList } from '../components/VarietyList';
import { EventForm } from '../components/EventForm';
import { AppearanceForm } from '../components/AppearanceForm';
import { NewsForm } from '../components/NewsForm';
import { PlanifruitForm } from '../components/PlanifruitForm';
import { SupabaseConnectionTest } from '../components/SupabaseConnectionTest';
import { useNewsStore } from '../store/newsStore';
import { useEventStore } from '../store/eventStore';
import { usePlanifruitStore } from '../store/planifruitStore';
import type { FruitVariety } from '../types/fruits';
import type { NewsArticle } from '../types/news';
import type { Event } from '../types/events';
import type { Planifruit } from '../types/planifruits';

type AdminSection = 'varieties' | 'events' | 'appearance' | 'news' | 'planifruits' | 'database';

export default function AdminDashboard() {
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string>('');
  const [showVarietyForm, setShowVarietyForm] = useState(false);
  const [showNewsForm, setShowNewsForm] = useState(false);
  const [showEventForm, setShowEventForm] = useState(false);
  const [showPlanifruitForm, setShowPlanifruitForm] = useState(false);
  const [editingVariety, setEditingVariety] = useState<({ id: string } & FruitVariety) | null>(null);
  const [editingArticle, setEditingArticle] = useState<NewsArticle | null>(null);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingPlanifruit, setEditingPlanifruit] = useState<Planifruit | null>(null);
  const [activeSection, setActiveSection] = useState<AdminSection>('varieties');
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { articles, deleteArticle, togglePublished: toggleArticlePublished } = useNewsStore();
  const { events, deleteEvent, togglePublished: toggleEventPublished } = useEventStore();
  const { planifruits, deletePlanifruit } = usePlanifruitStore();

  const handleSignOut = () => {
    signOut();
    navigate('/admin');
    toast.success('Déconnexion réussie');
  };

  const handleViewApp = () => {
    navigate('/');
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCategory(e.target.value);
    setSelectedType('');
    setShowVarietyForm(false);
    setEditingVariety(null);
  };

  const handleTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedType(e.target.value);
    setShowVarietyForm(false);
    setEditingVariety(null);
  };

  const handleEditVariety = (variety: { id: string } & FruitVariety) => {
    setEditingVariety(variety);
    setShowVarietyForm(true);
  };

  const handleDeleteArticle = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet article ?')) {
      deleteArticle(id);
      toast.success('Article supprimé avec succès');
    }
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet événement ?')) {
      deleteEvent(id);
      toast.success('Événement supprimé avec succès');
    }
  };

  const handleDeletePlanifruit = (id: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce planifruit ?')) {
      deletePlanifruit(id);
      toast.success('Planifruit supprimé avec succès');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Administration AC Fruit</h1>
          <div className="flex gap-4">
            <button
              onClick={handleViewApp}
              className="flex items-center px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700"
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              Voir l'application
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Déconnexion
            </button>
          </div>
        </div>

        <div className="flex gap-4 mb-6 flex-wrap">
          <button
            onClick={() => setActiveSection('varieties')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
              activeSection === 'varieties'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            <Plus className="w-5 h-5" />
            Gestion des variétés
          </button>
          <button
            onClick={() => setActiveSection('news')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
              activeSection === 'news'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            <Newspaper className="w-5 h-5" />
            Actualités
          </button>
          <button
            onClick={() => setActiveSection('events')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
              activeSection === 'events'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            <CalendarDays className="w-5 h-5" />
            Événements
          </button>
          <button
            onClick={() => setActiveSection('planifruits')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
              activeSection === 'planifruits'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            <Table className="w-5 h-5" />
            Planifruits
          </button>
          <button
            onClick={() => setActiveSection('appearance')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
              activeSection === 'appearance'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            <Palette className="w-5 h-5" />
            Apparence
          </button>
          <button
            onClick={() => setActiveSection('database')}
            className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 ${
              activeSection === 'database'
                ? 'bg-orange-600 text-white'
                : 'bg-white text-gray-700 hover:bg-orange-50'
            }`}
          >
            <Database className="w-5 h-5" />
            Base de données
          </button>
        </div>

        {activeSection === 'database' && (
          <SupabaseConnectionTest />
        )}

        {activeSection === 'varieties' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex gap-4 mb-6">
              <select
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="flex-1 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
              >
                <option value="">Sélectionner une espèce</option>
                <option value="abricots">Abricots</option>
                <option value="peches">Pêches</option>
                <option value="nectarines">Nectarines</option>
              </select>

              {selectedCategory && (selectedCategory === 'peches' || selectedCategory === 'nectarines') && (
                <select
                  value={selectedType}
                  onChange={handleTypeChange}
                  className="flex-1 rounded-lg border-gray-300 focus:border-orange-500 focus:ring-orange-500"
                >
                  <option value="">Sélectionner un type</option>
                  <option value="jaune">Jaune</option>
                  <option value="blanche">Blanche</option>
                  <option value="sanguine">Sanguine</option>
                  <option value="plate">Plate</option>
                </select>
              )}

              <button
                onClick={() => {
                  setShowVarietyForm(true);
                  setEditingVariety(null);
                }}
                disabled={!selectedCategory || (selectedCategory !== 'abricots' && !selectedType)}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvelle variété
              </button>
            </div>

            {selectedCategory && (!selectedCategory || selectedType || selectedCategory === 'abricots') && (
              <VarietyList
                category={selectedCategory}
                type={selectedType}
                onEdit={handleEditVariety}
              />
            )}

            {showVarietyForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <VarietyForm
                    category={selectedCategory}
                    type={selectedType}
                    editingVariety={editingVariety || undefined}
                    onClose={() => {
                      setShowVarietyForm(false);
                      setEditingVariety(null);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'news' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestion des actualités</h2>
              <button
                onClick={() => {
                  setShowNewsForm(true);
                  setEditingArticle(null);
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel article
              </button>
            </div>

            <div className="space-y-4">
              {articles.map((article) => (
                <div
                  key={article.id}
                  className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={article.image}
                      alt={article.title}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium">{article.title}</h3>
                      <p className="text-sm text-gray-500">
                        {new Date(article.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleArticlePublished(article.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        article.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {article.published ? 'Publié' : 'Non publié'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingArticle(article);
                        setShowNewsForm(true);
                      }}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteArticle(article.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showNewsForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <NewsForm
                    article={editingArticle || undefined}
                    onClose={() => {
                      setShowNewsForm(false);
                      setEditingArticle(null);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'events' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestion des événements</h2>
              <button
                onClick={() => {
                  setShowEventForm(true);
                  setEditingEvent(null);
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouvel événement
              </button>
            </div>

            <div className="space-y-4">
              {events.map((event) => (
                <div
                  key={event.id}
                  className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    {event.image && (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    <div>
                      <h3 className="font-medium">{event.title}</h3>
                      <p className="text-sm text-gray-500">
                        Du {new Date(event.startDate).toLocaleDateString()} au{' '}
                        {new Date(event.endDate).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleEventPublished(event.id)}
                      className={`px-3 py-1 rounded-full text-sm ${
                        event.published
                          ? 'bg-green-100 text-green-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {event.published ? 'Publié' : 'Non publié'}
                    </button>
                    <button
                      onClick={() => {
                        setEditingEvent(event);
                        setShowEventForm(true);
                      }}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showEventForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <EventForm
                    event={editingEvent || undefined}
                    onClose={() => {
                      setShowEventForm(false);
                      setEditingEvent(null);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'planifruits' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Gestion des Planifruits</h2>
              <button
                onClick={() => {
                  setShowPlanifruitForm(true);
                  setEditingPlanifruit(null);
                }}
                className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nouveau Planifruit
              </button>
            </div>

            <div className="space-y-4">
              {planifruits.map((planifruit) => (
                <div
                  key={planifruit.id}
                  className="bg-gray-50 rounded-lg p-4 flex items-center justify-between"
                >
                  <div className="flex items-center space-x-4">
                    <img
                      src={planifruit.image}
                      alt={`Planifruit ${planifruit.category} ${planifruit.type || ''}`}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div>
                      <h3 className="font-medium capitalize">
                        {planifruit.category} {planifruit.type && `- ${planifruit.type}`}
                      </h3>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        setEditingPlanifruit(planifruit);
                        setShowPlanifruitForm(true);
                      }}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded-lg"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleDeletePlanifruit(planifruit.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                    >
                      <LogOut className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {showPlanifruitForm && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                <div className="bg-white rounded-xl shadow-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                  <PlanifruitForm
                    planifruit={editingPlanifruit || undefined}
                    onClose={() => {
                      setShowPlanifruitForm(false);
                      setEditingPlanifruit(null);
                    }}
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {activeSection === 'appearance' && (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <AppearanceForm />
          </div>
        )}
      </div>
    </div>
  );
}
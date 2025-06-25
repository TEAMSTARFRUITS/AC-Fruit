import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppearanceProvider } from './contexts/AppearanceContext';
import { ErrorBoundary } from './components/ErrorBoundary';
import Sidebar from './components/Sidebar';
import Home from './pages/Home';
import News from './pages/News';
import Events from './pages/Events';
import Calendar from './pages/Calendar';
import Contact from './pages/Contact';
import FruitPage from './pages/FruitPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Planifruits from './pages/Planifruits';
import Planifruit from './pages/Planifruit';
import { Menu } from 'lucide-react';

// Import des stores pour charger les données
import { useFruitStore } from './store/fruitStore';
import { useNewsStore } from './store/newsStore';
import { useEventStore } from './store/eventStore';
import { usePlanifruitStore } from './store/planifruitStore';
import { useAppearanceStore } from './store/appearanceStore';

// Vérification des variables d'environnement
const checkEnvironmentVariables = () => {
  const missingVars = [];
  if (!import.meta.env.VITE_SUPABASE_URL) missingVars.push('VITE_SUPABASE_URL');
  if (!import.meta.env.VITE_SUPABASE_ANON_KEY) missingVars.push('VITE_SUPABASE_ANON_KEY');
  
  if (missingVars.length > 0) {
    console.error(`Missing environment variables: ${missingVars.join(', ')}`);
    return false;
  }
  return true;
};

export default function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [envError, setEnvError] = useState(false);

  useEffect(() => {
    const isValid = checkEnvironmentVariables();
    setEnvError(!isValid);
  }, []);

  if (envError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Erreur de configuration
          </h1>
          <p className="text-gray-600">
            Variables d'environnement Supabase manquantes. Veuillez vérifier votre configuration.
          </p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <AuthProvider>
        <AppearanceProvider>
          <Router>
            <AppContent isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Toaster position="top-right" />
          </Router>
        </AppearanceProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

// Move PrivateRoute inside the AuthProvider context
function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin" />;
  }

  return <>{children}</>;
}

// Move the main content into a separate component inside the AuthProvider context
function AppContent({ isSidebarOpen, setIsSidebarOpen }: { isSidebarOpen: boolean; setIsSidebarOpen: (isOpen: boolean) => void }) {
  const { user } = useAuth();
  const [dataLoaded, setDataLoaded] = useState(false);
  
  // Charger les données au démarrage
  const { loadFruits } = useFruitStore();
  const { loadArticles } = useNewsStore();
  const { loadEvents } = useEventStore();
  const { loadPlanifruits } = usePlanifruitStore();
  const { loadAppearance } = useAppearanceStore();

  useEffect(() => {
    // Charger toutes les données au démarrage
    const loadData = async () => {
      try {
        console.log('Loading initial data...');
        await Promise.all([
          loadFruits(),
          loadArticles(),
          loadEvents(),
          loadPlanifruits(),
          loadAppearance()
        ]);
        console.log('All data loaded successfully');
        setDataLoaded(true);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setDataLoaded(true); // Continuer même en cas d'erreur
      }
    };

    loadData();
  }, [loadFruits, loadArticles, loadEvents, loadPlanifruits, loadAppearance]);

  // Afficher un loader pendant le chargement des données
  if (!dataLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Chargement des données...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <Routes>
        <Route
          path="/admin/*"
          element={
            <Routes>
              <Route path="/" element={<AdminLogin />} />
              <Route
                path="/dashboard/*"
                element={
                  <PrivateRoute>
                    <AdminDashboard />
                  </PrivateRoute>
                }
              />
            </Routes>
          }
        />
        <Route
          path="/*"
          element={
            <>
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>

              {isSidebarOpen && (
                <div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                  onClick={() => setIsSidebarOpen(false)}
                />
              )}

              <div
                className={`fixed inset-y-0 left-0 z-40 transform lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out ${
                  isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
              >
                <Sidebar onClose={() => setIsSidebarOpen(false)} />
              </div>

              <main className="flex-1 overflow-y-auto pt-16 lg:pt-0">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/actualites" element={<News />} />
                  <Route path="/evenements" element={<Events />} />
                  {user && <Route path="/calendar" element={<Calendar />} />}
                  <Route path="/contact" element={<Contact />} />
                  <Route path="/fruits/:category" element={<FruitPage />} />
                  <Route path="/fruits/:category/:type" element={<FruitPage />} />
                  <Route path="/fruits/:category/:type/:variety" element={<FruitPage />} />
                  <Route path="/planifruits" element={<Planifruits />} />
                  <Route path="/planifruits/:category" element={<Planifruit />} />
                  <Route path="/planifruits/:category/:type" element={<Planifruit />} />
                </Routes>
              </main>
            </>
          }
        />
      </Routes>
    </div>
  );
}
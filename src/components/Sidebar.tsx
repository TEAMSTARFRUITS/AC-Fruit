import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAppearanceStore } from '../store/appearanceStore';
import { useAuth } from '../contexts/AuthContext';
import { SearchBar } from './SearchBar';
import { 
  Home,
  ChevronDown,
  ChevronRight,
  Calendar,
  Settings,
  LogIn,
  X,
  Newspaper,
  CalendarDays,
  Phone,
  Table
} from 'lucide-react';

interface MenuItem {
  name: string;
  path: string;
  icon?: React.ReactNode;
  subItems?: MenuItem[];
  adminOnly?: boolean;
}

interface SidebarProps {
  onClose?: () => void;
}

function Sidebar({ onClose }: SidebarProps) {
  const [expandedItems, setExpandedItems] = React.useState<string[]>([]);
  const { appearance } = useAppearanceStore();
  const { user } = useAuth();

  const menuItems: MenuItem[] = [
    {
      name: 'Accueil',
      path: '/',
      icon: <Home className="w-5 h-5" />
    },
    {
      name: 'Actualités',
      path: '/actualites',
      icon: <Newspaper className="w-5 h-5" />
    },
    {
      name: 'Événements',
      path: '/evenements',
      icon: <CalendarDays className="w-5 h-5" />
    },
    {
      name: 'Abricots',
      path: '/fruits/abricots',
      icon: appearance.categoryIcons.abricots ? (
        <img src={appearance.categoryIcons.abricots} alt="Abricots" className="w-5 h-5" />
      ) : null
    },
    {
      name: 'Pêches',
      path: '/fruits/peches',
      icon: appearance.categoryIcons.peches ? (
        <img src={appearance.categoryIcons.peches} alt="Pêches" className="w-5 h-5" />
      ) : null,
      subItems: [
        { name: 'Jaune', path: '/fruits/peches/jaune' },
        { name: 'Blanche', path: '/fruits/peches/blanche' },
        { name: 'Sanguine', path: '/fruits/peches/sanguine' },
        { name: 'Plate', path: '/fruits/peches/plate' }
      ]
    },
    {
      name: 'Nectarines',
      path: '/fruits/nectarines',
      icon: appearance.categoryIcons.nectarines ? (
        <img src={appearance.categoryIcons.nectarines} alt="Nectarines" className="w-5 h-5" />
      ) : null,
      subItems: [
        { name: 'Jaune', path: '/fruits/nectarines/jaune' },
        { name: 'Blanche', path: '/fruits/nectarines/blanche' },
        { name: 'Sanguine', path: '/fruits/nectarines/sanguine' },
        { name: 'Plate', path: '/fruits/nectarines/plate' }
      ]
    },
    {
      name: 'Planifruits',
      path: '/planifruits',
      icon: <Table className="w-5 h-5" />,
      subItems: [
        { 
          name: 'Abricots', 
          path: '/planifruits/abricots' 
        },
        { 
          name: 'Pêches', 
          path: '/planifruits/peches',
          subItems: [
            { name: 'Jaune', path: '/planifruits/peches/jaune' },
            { name: 'Blanche', path: '/planifruits/peches/blanche' },
            { name: 'Sanguine', path: '/planifruits/peches/sanguine' },
            { name: 'Plate', path: '/planifruits/peches/plate' }
          ]
        },
        { 
          name: 'Nectarines', 
          path: '/planifruits/nectarines',
          subItems: [
            { name: 'Jaune', path: '/planifruits/nectarines/jaune' },
            { name: 'Blanche', path: '/planifruits/nectarines/blanche' },
            { name: 'Sanguine', path: '/planifruits/nectarines/sanguine' },
            { name: 'Plate', path: '/planifruits/nectarines/plate' }
          ]
        }
      ]
    },
    {
      name: 'Calendrier',
      path: '/calendar',
      icon: <Calendar className="w-5 h-5" />,
      adminOnly: true
    },
    {
      name: 'Contact',
      path: '/contact',
      icon: <Phone className="w-5 h-5" />
    }
  ];

  const toggleExpand = (itemName: string) => {
    setExpandedItems(prev =>
      prev.includes(itemName)
        ? prev.filter(item => item !== itemName)
        : [...prev, itemName]
    );
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    // Ne pas afficher les éléments adminOnly si l'utilisateur n'est pas connecté
    if (item.adminOnly && !user) {
      return null;
    }

    const hasSubItems = item.subItems && item.subItems.length > 0;
    const isExpanded = expandedItems.includes(item.name);

    return (
      <div key={item.path} className="w-full">
        <NavLink
          to={hasSubItems ? '#' : item.path}
          onClick={(e) => {
            if (hasSubItems) {
              e.preventDefault();
              toggleExpand(item.name);
            } else if (onClose) {
              onClose();
            }
          }}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 text-gray-700 hover:bg-orange-50 hover:text-orange-600 ${
              isActive && !hasSubItems ? 'bg-orange-50 text-orange-600 font-medium' : ''
            } ${level > 0 ? 'pl-8' : ''}`
          }
        >
          {item.icon && <span className="mr-3">{item.icon}</span>}
          <span className="flex-1">{item.name}</span>
          {hasSubItems && (
            <span className="ml-auto">
              {isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          )}
        </NavLink>
        {hasSubItems && isExpanded && (
          <div className="ml-4 border-l border-gray-200">
            {item.subItems.map(subItem => renderMenuItem(subItem, level + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-64 bg-white shadow-lg flex flex-col h-full">
      <div className="p-4 border-b">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center justify-center flex-1">
            {appearance.logo && appearance.logo.trim() !== '' ? (
              <img 
                src={appearance.logo} 
                alt="AC Fruit" 
                className="h-12 w-auto object-contain"
                style={{ backgroundColor: 'transparent' }}
                onError={(e) => {
                  console.error('Logo failed to load:', appearance.logo);
                  // Fallback vers le texte si l'image ne charge pas
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const fallback = target.nextElementSibling as HTMLElement;
                  if (fallback) {
                    fallback.style.display = 'block';
                  }
                }}
              />
            ) : null}
            <h1 
              className="text-2xl font-bold text-orange-600"
              style={{ 
                display: appearance.logo && appearance.logo.trim() !== '' ? 'none' : 'block' 
              }}
            >
              AC Fruit
            </h1>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              className="lg:hidden p-2 text-gray-500 hover:text-gray-700"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        <SearchBar />
      </div>
      
      <nav className="flex-1 overflow-y-auto py-4">
        {menuItems.map(item => renderMenuItem(item))}
      </nav>
      
      <div className="border-t p-4">
        <NavLink
          to={user ? "/admin/dashboard" : "/admin"}
          onClick={onClose}
          className={({ isActive }) =>
            `flex items-center px-4 py-2 rounded-lg ${
              isActive 
                ? 'bg-orange-600 text-white' 
                : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
            }`
          }
        >
          {user ? (
            <>
              <Settings className="w-5 h-5 mr-3" />
              <span>Administration</span>
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5 mr-3" />
              <span>Connexion Admin</span>
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
}

export default Sidebar;
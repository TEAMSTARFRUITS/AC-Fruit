import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFruitStore } from '../store/fruitStore';
import type { FruitCategory, FruitType, FruitVariety } from '../types/fruits';

interface SearchResult {
  id: string;
  name: string;
  category: FruitCategory;
  type?: FruitType;
  description: string;
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const { fruitData } = useFruitStore();
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const searchVarieties = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const normalizedQuery = searchQuery.toLowerCase();

    Object.entries(fruitData).forEach(([category, fruit]) => {
      if (fruit.hasSubCategories) {
        Object.entries(fruit.varieties as Record<FruitType, Record<string, FruitVariety>>).forEach(([type, varieties]) => {
          Object.entries(varieties).forEach(([id, variety]) => {
            if (
              variety.name.toLowerCase().includes(normalizedQuery) ||
              variety.description.toLowerCase().includes(normalizedQuery)
            ) {
              searchResults.push({
                id,
                name: variety.name,
                category: category as FruitCategory,
                type: type as FruitType,
                description: variety.description
              });
            }
          });
        });
      } else {
        Object.entries(fruit.varieties as Record<string, FruitVariety>).forEach(([id, variety]) => {
          if (
            variety.name.toLowerCase().includes(normalizedQuery) ||
            variety.description.toLowerCase().includes(normalizedQuery)
          ) {
            searchResults.push({
              id,
              name: variety.name,
              category: category as FruitCategory,
              description: variety.description
            });
          }
        });
      }
    });

    setResults(searchResults);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    searchVarieties(value);
    setIsOpen(true);
  };

  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setIsOpen(false);
  };

  const getVarietyPath = (result: SearchResult) => {
    if (result.type) {
      return `/fruits/${result.category}/${result.type}/${result.id}`;
    }
    return `/fruits/${result.category}/${result.id}`;
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={handleSearch}
          placeholder="Rechercher une variété..."
          className="w-full px-4 py-2 pl-10 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
        />
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {results.map((result) => (
            <Link
              key={`${result.category}-${result.type || ''}-${result.id}`}
              to={getVarietyPath(result)}
              className="block p-4 hover:bg-orange-50 border-b border-gray-100 last:border-0"
              onClick={() => setIsOpen(false)}
            >
              <div className="flex flex-col">
                <span className="font-medium text-gray-900">{result.name}</span>
                <span className="text-sm text-gray-500">
                  {result.category} {result.type ? `- ${result.type}` : ''}
                </span>
                <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                  {result.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}

      {isOpen && query && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 text-center text-gray-500">
          Aucun résultat trouvé
        </div>
      )}
    </div>
  );
}
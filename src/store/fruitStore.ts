import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import type { FruitCategory, FruitType, FruitVariety, Fruit } from '../types/fruits';

interface FruitState {
  fruitData: Record<FruitCategory, Fruit>;
  loading: boolean;
  error: string | null;
  loadFruits: () => Promise<void>;
  addVariety: (category: FruitCategory, type: FruitType | null, variety: FruitVariety & { id: string }) => Promise<void>;
  updateVariety: (category: FruitCategory, type: FruitType | null, varietyId: string, variety: FruitVariety) => Promise<void>;
  deleteVariety: (category: FruitCategory, type: FruitType | null, varietyId: string) => Promise<void>;
}

const initialFruitData: Record<FruitCategory, Fruit> = {
  abricots: {
    name: 'Abricots',
    hasSubCategories: false,
    varieties: {}
  },
  peches: {
    name: 'Pêches',
    hasSubCategories: true,
    varieties: {
      jaune: {},
      blanche: {},
      sanguine: {},
      plate: {}
    }
  },
  nectarines: {
    name: 'Nectarines',
    hasSubCategories: true,
    varieties: {
      jaune: {},
      blanche: {},
      sanguine: {},
      plate: {}
    }
  }
};

export const useFruitStore = create<FruitState>((set, get) => ({
  fruitData: initialFruitData,
  loading: false,
  error: null,

  loadFruits: async () => {
    set({ loading: true, error: null });
    try {
      console.log('Loading fruits from Supabase...');
      const { data, error } = await supabase
        .from('fruits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Supabase error loading fruits:', error);
        throw error;
      }

      console.log('Fruits data loaded:', data);

      // Réinitialiser avec la structure de base
      const newFruitData = JSON.parse(JSON.stringify(initialFruitData));

      // Ajouter les fruits de la base de données
      data?.forEach((fruit) => {
        const variety: FruitVariety = {
          name: fruit.name,
          image: fruit.image,
          images: fruit.images || [],
          description: fruit.description,
          technicalSheet: fruit.technical_sheet || '',
          videoUrl: fruit.video_url || '',
          videoSource: fruit.video_url ? 
            (fruit.video_url.includes('youtube.com') || fruit.video_url.includes('youtu.be') ? 
              { type: 'youtube', url: fruit.video_url } : 
              { type: 'local', url: fruit.video_url }
            ) : 
            { type: 'local', url: '' },
          maturityPeriod: fruit.maturity_start_day && fruit.maturity_start_month && fruit.maturity_end_day && fruit.maturity_end_month ? {
            startDay: fruit.maturity_start_day,
            startMonth: fruit.maturity_start_month,
            endDay: fruit.maturity_end_day,
            endMonth: fruit.maturity_end_month
          } : undefined
        };

        const category = fruit.category as FruitCategory;
        if (fruit.type) {
          const type = fruit.type as FruitType;
          const varieties = newFruitData[category].varieties as Record<FruitType, Record<string, FruitVariety>>;
          if (varieties[type]) {
            varieties[type][fruit.id] = variety;
          }
        } else {
          const varieties = newFruitData[category].varieties as Record<string, FruitVariety>;
          varieties[fruit.id] = variety;
        }
      });

      console.log('Processed fruit data:', newFruitData);
      set({ fruitData: newFruitData, loading: false });
    } catch (error) {
      console.error('Error loading fruits:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur de chargement', loading: false });
      // En cas d'erreur, garder la structure de base
      set({ fruitData: initialFruitData });
    }
  },

  addVariety: async (category, type, variety) => {
    set({ loading: true, error: null });
    try {
      const insertData = {
        category,
        type,
        name: variety.name,
        description: variety.description,
        image: variety.image,
        images: variety.images || [],
        technical_sheet: variety.technicalSheet || null,
        video_url: variety.videoSource?.url || null,
        maturity_start_day: variety.maturityPeriod?.startDay || null,
        maturity_start_month: variety.maturityPeriod?.startMonth || null,
        maturity_end_day: variety.maturityPeriod?.endDay || null,
        maturity_end_month: variety.maturityPeriod?.endMonth || null
      };

      const { data, error } = await supabase
        .from('fruits')
        .insert(insertData)
        .select()
        .single();

      if (error) throw error;

      // Mettre à jour le store local
      const newData = { ...get().fruitData };
      if (type) {
        const varieties = newData[category].varieties as Record<FruitType, Record<string, FruitVariety>>;
        varieties[type][data.id] = variety;
      } else {
        const varieties = newData[category].varieties as Record<string, FruitVariety>;
        varieties[data.id] = variety;
      }
      set({ fruitData: newData, loading: false });
    } catch (error) {
      console.error('Error adding variety:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur d\'ajout', loading: false });
      throw error;
    }
  },

  updateVariety: async (category, type, varietyId, variety) => {
    set({ loading: true, error: null });
    try {
      const updateData = {
        name: variety.name,
        description: variety.description,
        image: variety.image,
        images: variety.images || [],
        technical_sheet: variety.technicalSheet || null,
        video_url: variety.videoSource?.url || null,
        maturity_start_day: variety.maturityPeriod?.startDay || null,
        maturity_start_month: variety.maturityPeriod?.startMonth || null,
        maturity_end_day: variety.maturityPeriod?.endDay || null,
        maturity_end_month: variety.maturityPeriod?.endMonth || null
      };

      const { error } = await supabase
        .from('fruits')
        .update(updateData)
        .eq('id', varietyId);

      if (error) throw error;

      // Mettre à jour le store local
      const newData = { ...get().fruitData };
      if (type) {
        const varieties = newData[category].varieties as Record<FruitType, Record<string, FruitVariety>>;
        varieties[type][varietyId] = variety;
      } else {
        const varieties = newData[category].varieties as Record<string, FruitVariety>;
        varieties[varietyId] = variety;
      }
      set({ fruitData: newData, loading: false });
    } catch (error) {
      console.error('Error updating variety:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour', loading: false });
      throw error;
    }
  },

  deleteVariety: async (category, type, varietyId) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('fruits')
        .delete()
        .eq('id', varietyId);

      if (error) throw error;

      // Mettre à jour le store local
      const newData = { ...get().fruitData };
      if (type) {
        const varieties = newData[category].varieties as Record<FruitType, Record<string, FruitVariety>>;
        delete varieties[type][varietyId];
      } else {
        const varieties = newData[category].varieties as Record<string, FruitVariety>;
        delete varieties[varietyId];
      }
      set({ fruitData: newData, loading: false });
    } catch (error) {
      console.error('Error deleting variety:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur de suppression', loading: false });
      throw error;
    }
  }
}));
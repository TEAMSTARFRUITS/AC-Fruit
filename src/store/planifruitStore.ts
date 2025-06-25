import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import type { Planifruit } from '../types/planifruits';

interface PlanifruitState {
  planifruits: Planifruit[];
  loading: boolean;
  error: string | null;
  loadPlanifruits: () => Promise<void>;
  addPlanifruit: (planifruit: Omit<Planifruit, 'id'>) => Promise<void>;
  updatePlanifruit: (id: string, planifruit: Partial<Planifruit>) => Promise<void>;
  deletePlanifruit: (id: string) => Promise<void>;
}

export const usePlanifruitStore = create<PlanifruitState>((set) => ({
  planifruits: [],
  loading: false,
  error: null,

  loadPlanifruits: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('planifruits')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const planifruits: Planifruit[] = data?.map(item => ({
        id: item.id,
        category: item.category,
        type: item.type || undefined,
        image: item.image,
        created_at: item.created_at || undefined,
        updated_at: item.updated_at || undefined
      })) || [];

      set({ planifruits, loading: false });
    } catch (error) {
      console.error('Error loading planifruits:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur de chargement', loading: false });
    }
  },

  addPlanifruit: async (planifruit) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('planifruits')
        .insert({
          category: planifruit.category,
          type: planifruit.type || null,
          image: planifruit.image
        })
        .select()
        .single();

      if (error) throw error;

      const newPlanifruit: Planifruit = {
        id: data.id,
        category: data.category,
        type: data.type || undefined,
        image: data.image,
        created_at: data.created_at || undefined,
        updated_at: data.updated_at || undefined
      };

      set(state => ({
        planifruits: [newPlanifruit, ...state.planifruits],
        loading: false
      }));
    } catch (error) {
      console.error('Error adding planifruit:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur d\'ajout', loading: false });
      throw error;
    }
  },

  updatePlanifruit: async (id, planifruit) => {
    set({ loading: true, error: null });
    try {
      const updateData: any = {};
      if (planifruit.category !== undefined) updateData.category = planifruit.category;
      if (planifruit.type !== undefined) updateData.type = planifruit.type;
      if (planifruit.image !== undefined) updateData.image = planifruit.image;

      const { error } = await supabase
        .from('planifruits')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        planifruits: state.planifruits.map(p => p.id === id ? { ...p, ...planifruit } : p),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating planifruit:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour', loading: false });
      throw error;
    }
  },

  deletePlanifruit: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('planifruits')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        planifruits: state.planifruits.filter(p => p.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting planifruit:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur de suppression', loading: false });
      throw error;
    }
  }
}));
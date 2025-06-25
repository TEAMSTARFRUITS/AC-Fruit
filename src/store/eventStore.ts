import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import type { Event } from '../types/events';

interface EventState {
  events: Event[];
  loading: boolean;
  error: string | null;
  loadEvents: () => Promise<void>;
  addEvent: (event: Omit<Event, 'id'>) => Promise<void>;
  updateEvent: (id: string, event: Partial<Event>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  togglePublished: (id: string) => Promise<void>;
}

export const useEventStore = create<EventState>((set, get) => ({
  events: [],
  loading: false,
  error: null,

  loadEvents: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('start_date', { ascending: true });

      if (error) throw error;

      const events: Event[] = data?.map(item => ({
        id: item.id,
        title: item.title,
        description: item.description || '',
        startDate: item.start_date,
        endDate: item.end_date,
        image: item.image || '',
        location: item.location,
        published: item.published
      })) || [];

      set({ events, loading: false });
    } catch (error) {
      console.error('Error loading events:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur de chargement', loading: false });
    }
  },

  addEvent: async (event) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('events')
        .insert({
          title: event.title,
          description: event.description,
          start_date: event.startDate,
          end_date: event.endDate,
          image: event.image,
          location: event.location,
          published: event.published
        })
        .select()
        .single();

      if (error) throw error;

      const newEvent: Event = {
        id: data.id,
        title: data.title,
        description: data.description || '',
        startDate: data.start_date,
        endDate: data.end_date,
        image: data.image || '',
        location: data.location,
        published: data.published
      };

      set(state => ({
        events: [...state.events, newEvent],
        loading: false
      }));
    } catch (error) {
      console.error('Error adding event:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur d\'ajout', loading: false });
      throw error;
    }
  },

  updateEvent: async (id, event) => {
    set({ loading: true, error: null });
    try {
      const updateData: any = {};
      if (event.title !== undefined) updateData.title = event.title;
      if (event.description !== undefined) updateData.description = event.description;
      if (event.startDate !== undefined) updateData.start_date = event.startDate;
      if (event.endDate !== undefined) updateData.end_date = event.endDate;
      if (event.image !== undefined) updateData.image = event.image;
      if (event.location !== undefined) updateData.location = event.location;
      if (event.published !== undefined) updateData.published = event.published;

      const { error } = await supabase
        .from('events')
        .update(updateData)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        events: state.events.map(e => e.id === id ? { ...e, ...event } : e),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating event:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour', loading: false });
      throw error;
    }
  },

  deleteEvent: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        events: state.events.filter(e => e.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting event:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur de suppression', loading: false });
      throw error;
    }
  },

  togglePublished: async (id) => {
    const event = get().events.find(e => e.id === id);
    if (!event) return;

    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('events')
        .update({ published: !event.published })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        events: state.events.map(e => 
          e.id === id ? { ...e, published: !e.published } : e
        ),
        loading: false
      }));
    } catch (error) {
      console.error('Error toggling published:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour', loading: false });
      throw error;
    }
  }
}));
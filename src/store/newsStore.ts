import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';
import type { NewsArticle } from '../types/news';

interface NewsState {
  articles: NewsArticle[];
  loading: boolean;
  error: string | null;
  loadArticles: () => Promise<void>;
  addArticle: (article: Omit<NewsArticle, 'id'>) => Promise<void>;
  updateArticle: (id: string, article: Partial<NewsArticle>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  togglePublished: (id: string) => Promise<void>;
}

export const useNewsStore = create<NewsState>((set, get) => ({
  articles: [],
  loading: false,
  error: null,

  loadArticles: async () => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const articles: NewsArticle[] = data?.map(item => ({
        id: item.id,
        title: item.title,
        content: item.content,
        image: item.image,
        published: item.published,
        date: item.created_at || new Date().toISOString()
      })) || [];

      set({ articles, loading: false });
    } catch (error) {
      console.error('Error loading articles:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur de chargement', loading: false });
    }
  },

  addArticle: async (article) => {
    set({ loading: true, error: null });
    try {
      const { data, error } = await supabase
        .from('news')
        .insert({
          title: article.title,
          content: article.content,
          image: article.image,
          published: article.published
        })
        .select()
        .single();

      if (error) throw error;

      const newArticle: NewsArticle = {
        id: data.id,
        title: data.title,
        content: data.content,
        image: data.image,
        published: data.published,
        date: data.created_at || new Date().toISOString()
      };

      set(state => ({
        articles: [newArticle, ...state.articles],
        loading: false
      }));
    } catch (error) {
      console.error('Error adding article:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur d\'ajout', loading: false });
      throw error;
    }
  },

  updateArticle: async (id, article) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('news')
        .update(article)
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        articles: state.articles.map(a => a.id === id ? { ...a, ...article } : a),
        loading: false
      }));
    } catch (error) {
      console.error('Error updating article:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour', loading: false });
      throw error;
    }
  },

  deleteArticle: async (id) => {
    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        articles: state.articles.filter(a => a.id !== id),
        loading: false
      }));
    } catch (error) {
      console.error('Error deleting article:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur de suppression', loading: false });
      throw error;
    }
  },

  togglePublished: async (id) => {
    const article = get().articles.find(a => a.id === id);
    if (!article) return;

    set({ loading: true, error: null });
    try {
      const { error } = await supabase
        .from('news')
        .update({ published: !article.published })
        .eq('id', id);

      if (error) throw error;

      set(state => ({
        articles: state.articles.map(a => 
          a.id === id ? { ...a, published: !a.published } : a
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
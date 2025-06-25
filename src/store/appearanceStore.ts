import { create } from 'zustand';
import { supabase } from '../lib/supabaseClient';

interface SocialMedia {
  instagram: string;
  linkedin: string;
  youtube: string;
  facebook: string;
}

interface Appearance {
  headerImage: string;
  headerVideo: string;
  useVideo: boolean;
  headerTitle: string;
  headerSubtitle: string;
  logo: string;
  categoryImages: Record<string, string>;
  categoryIcons: Record<string, string>;
  homepageBanner: string;
  companyName: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  socialMedia: SocialMedia;
  mapsEmbedUrl: string;
}

interface AppearanceState {
  appearance: Appearance;
  loading: boolean;
  error: string | null;
  loadAppearance: () => Promise<void>;
  updateAppearance: (newAppearance: Partial<Appearance>) => Promise<void>;
}

const defaultAppearance: Appearance = {
  headerImage: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&q=80',
  headerVideo: '',
  useVideo: false,
  headerTitle: 'Bienvenue chez AC Fruit',
  headerSubtitle: 'Découvrez nos fruits d\'exception',
  logo: '',
  categoryImages: {
    abricots: '',
    peches: '',
    nectarines: ''
  },
  categoryIcons: {
    abricots: '',
    peches: '',
    nectarines: ''
  },
  homepageBanner: '',
  companyName: '',
  address: '',
  phone: '',
  email: '',
  website: '',
  socialMedia: {
    instagram: '',
    linkedin: '',
    youtube: '',
    facebook: ''
  },
  mapsEmbedUrl: ''
};

export const useAppearanceStore = create<AppearanceState>((set, get) => ({
  appearance: defaultAppearance,
  loading: false,
  error: null,

  loadAppearance: async () => {
    set({ loading: true, error: null });
    try {
      console.log('Loading appearance from Supabase...');
      const { data, error } = await supabase
        .from('appearance')
        .select('*')
        .limit(1)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Error loading appearance:', error);
        throw error;
      }

      if (data) {
        console.log('Appearance data loaded:', data);
        const appearance: Appearance = {
          headerImage: data.header_image || defaultAppearance.headerImage,
          headerVideo: data.header_video || '',
          useVideo: data.use_video || false,
          headerTitle: data.header_title || defaultAppearance.headerTitle,
          headerSubtitle: data.header_subtitle || defaultAppearance.headerSubtitle,
          logo: data.logo || '',
          categoryImages: data.category_images || defaultAppearance.categoryImages,
          categoryIcons: data.category_icons || defaultAppearance.categoryIcons,
          homepageBanner: data.homepage_banner || '',
          companyName: data.company_name || '',
          address: data.address || '',
          phone: data.phone || '',
          email: data.email || '',
          website: data.website || '',
          socialMedia: data.social_media || defaultAppearance.socialMedia,
          mapsEmbedUrl: data.maps_embed_url || ''
        };
        console.log('Processed appearance:', appearance);
        set({ appearance, loading: false });
      } else {
        console.log('No appearance data found, using defaults');
        set({ appearance: defaultAppearance, loading: false });
      }
    } catch (error) {
      console.error('Error loading appearance:', error);
      set({ 
        error: error instanceof Error ? error.message : 'Erreur de chargement', 
        loading: false,
        appearance: defaultAppearance // Utiliser les valeurs par défaut en cas d'erreur
      });
    }
  },

  updateAppearance: async (newAppearance) => {
    set({ loading: true, error: null });
    try {
      const currentAppearance = get().appearance;
      const updatedAppearance = { ...currentAppearance, ...newAppearance };

      const updateData = {
        header_image: updatedAppearance.headerImage,
        header_video: updatedAppearance.headerVideo || null,
        use_video: updatedAppearance.useVideo,
        header_title: updatedAppearance.headerTitle,
        header_subtitle: updatedAppearance.headerSubtitle,
        logo: updatedAppearance.logo || null,
        category_images: updatedAppearance.categoryImages,
        category_icons: updatedAppearance.categoryIcons,
        homepage_banner: updatedAppearance.homepageBanner || null,
        company_name: updatedAppearance.companyName || null,
        address: updatedAppearance.address || null,
        phone: updatedAppearance.phone || null,
        email: updatedAppearance.email || null,
        website: updatedAppearance.website || null,
        social_media: updatedAppearance.socialMedia,
        maps_embed_url: updatedAppearance.mapsEmbedUrl || null
      };

      // Vérifier s'il existe déjà un enregistrement
      const { data: existing } = await supabase
        .from('appearance')
        .select('id')
        .limit(1)
        .single();

      if (existing) {
        // Mettre à jour l'enregistrement existant
        const { error } = await supabase
          .from('appearance')
          .update(updateData)
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        // Créer un nouvel enregistrement
        const { error } = await supabase
          .from('appearance')
          .insert(updateData);

        if (error) throw error;
      }

      set({ appearance: updatedAppearance, loading: false });
    } catch (error) {
      console.error('Error updating appearance:', error);
      set({ error: error instanceof Error ? error.message : 'Erreur de mise à jour', loading: false });
      throw error;
    }
  }
}));
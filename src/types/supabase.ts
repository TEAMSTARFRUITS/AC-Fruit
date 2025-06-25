export interface Database {
  public: {
    Tables: {
      fruits: {
        Row: {
          id: string;
          category: string;
          type: string | null;
          name: string;
          description: string;
          image: string;
          images: string[] | null;
          technical_sheet: string | null;
          video_url: string | null;
          maturity_start_day: number | null;
          maturity_start_month: number | null;
          maturity_end_day: number | null;
          maturity_end_month: number | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          category: string;
          type?: string | null;
          name: string;
          description: string;
          image: string;
          images?: string[] | null;
          technical_sheet?: string | null;
          video_url?: string | null;
          maturity_start_day?: number | null;
          maturity_start_month?: number | null;
          maturity_end_day?: number | null;
          maturity_end_month?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          category?: string;
          type?: string | null;
          name?: string;
          description?: string;
          image?: string;
          images?: string[] | null;
          technical_sheet?: string | null;
          video_url?: string | null;
          maturity_start_day?: number | null;
          maturity_start_month?: number | null;
          maturity_end_day?: number | null;
          maturity_end_month?: number | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      news: {
        Row: {
          id: string;
          title: string;
          content: string;
          image: string;
          published: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          content: string;
          image: string;
          published?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          content?: string;
          image?: string;
          published?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      events: {
        Row: {
          id: string;
          title: string;
          description: string | null;
          start_date: string;
          end_date: string;
          image: string | null;
          location: string;
          published: boolean;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          title: string;
          description?: string | null;
          start_date: string;
          end_date: string;
          image?: string | null;
          location: string;
          published?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string | null;
          start_date?: string;
          end_date?: string;
          image?: string | null;
          location?: string;
          published?: boolean;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
      appearance: {
        Row: {
          id: string;
          header_image: string;
          header_video: string | null;
          use_video: boolean;
          header_title: string;
          header_subtitle: string;
          logo: string | null;
          category_images: Record<string, string>;
          category_icons: Record<string, string>;
          homepage_banner: string | null;
          company_name: string | null;
          address: string | null;
          phone: string | null;
          email: string | null;
          website: string | null;
          social_media: {
            instagram: string;
            linkedin: string;
            youtube: string;
            facebook: string;
          } | null;
          maps_embed_url: string | null;
          created_at: string | null;
          updated_at: string | null;
        };
        Insert: {
          id?: string;
          header_image: string;
          header_video?: string | null;
          use_video?: boolean;
          header_title: string;
          header_subtitle: string;
          logo?: string | null;
          category_images?: Record<string, string>;
          category_icons?: Record<string, string>;
          homepage_banner?: string | null;
          company_name?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          social_media?: {
            instagram: string;
            linkedin: string;
            youtube: string;
            facebook: string;
          } | null;
          maps_embed_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
        Update: {
          id?: string;
          header_image?: string;
          header_video?: string | null;
          use_video?: boolean;
          header_title?: string;
          header_subtitle?: string;
          logo?: string | null;
          category_images?: Record<string, string>;
          category_icons?: Record<string, string>;
          homepage_banner?: string | null;
          company_name?: string | null;
          address?: string | null;
          phone?: string | null;
          email?: string | null;
          website?: string | null;
          social_media?: {
            instagram: string;
            linkedin: string;
            youtube: string;
            facebook: string;
          } | null;
          maps_embed_url?: string | null;
          created_at?: string | null;
          updated_at?: string | null;
        };
      };
    };
  };
}
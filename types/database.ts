export interface Database {
  public: {
    Tables: {
      albums: {
        Row: {
          id: string
          created_at: string
          title: string
          artist: string
          description: string
          price: number
          cover_image_url: string | null
          file_path: string
          r2_url: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          artist: string
          description: string
          price: number
          cover_image_url?: string | null
          file_path: string
          r2_url?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          artist?: string
          description?: string
          price?: number
          cover_image_url?: string | null
          file_path?: string
          r2_url?: string | null
        }
      }
      tracks: {
        Row: {
          id: string
          created_at: string
          album_id: string
          title: string
          description: string | null
          track_number: number
          r2_url: string
        }
        Insert: {
          id?: string
          created_at?: string
          album_id: string
          title: string
          description?: string | null
          track_number: number
          r2_url: string
        }
        Update: {
          id?: string
          created_at?: string
          album_id?: string
          title?: string
          description?: string | null
          track_number?: number
          r2_url?: string
        }
      }
      purchases: {
        Row: {
          id: string
          created_at: string
          user_id: string
          album_id: string
          stripe_payment_intent_id: string
          amount: number
        }
        Insert: {
          id?: string
          created_at?: string
          user_id: string
          album_id: string
          stripe_payment_intent_id: string
          amount: number
        }
        Update: {
          id?: string
          created_at?: string
          user_id?: string
          album_id?: string
          stripe_payment_intent_id?: string
          amount?: number
        }
      }
      gallery_images: {
        Row: {
          id: string
          created_at: string
          title: string
          description: string | null
          image_url: string
          display_order: number
        }
        Insert: {
          id?: string
          created_at?: string
          title: string
          description?: string | null
          image_url: string
          display_order?: number
        }
        Update: {
          id?: string
          created_at?: string
          title?: string
          description?: string | null
          image_url?: string
          display_order?: number
        }
      }
    }
  }
}

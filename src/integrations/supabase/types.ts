export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      activities: {
        Row: {
          category: string
          city: string | null
          created_at: string
          description: string
          duration: string | null
          featured: boolean | null
          group_size: string | null
          id: string
          image: string
          location_id: string | null
          max_age: number | null
          min_age: number | null
          organizer_id: string | null
          price: number | null
          rating: number | null
          review_count: number | null
          schedule: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
          city?: string | null
          created_at?: string
          description: string
          duration?: string | null
          featured?: boolean | null
          group_size?: string | null
          id?: string
          image: string
          location_id?: string | null
          max_age?: number | null
          min_age?: number | null
          organizer_id?: string | null
          price?: number | null
          rating?: number | null
          review_count?: number | null
          schedule?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
          city?: string | null
          created_at?: string
          description?: string
          duration?: string | null
          featured?: boolean | null
          group_size?: string | null
          id?: string
          image?: string
          location_id?: string | null
          max_age?: number | null
          min_age?: number | null
          organizer_id?: string | null
          price?: number | null
          rating?: number | null
          review_count?: number | null
          schedule?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "activities_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "activity_locations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activities_organizer_id_fkey"
            columns: ["organizer_id"]
            isOneToOne: false
            referencedRelation: "activity_organizers"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_bookings: {
        Row: {
          activity_id: string
          booking_date: string
          created_at: string
          email: string
          first_name: string
          id: string
          last_name: string
          notes: string | null
          package_id: string | null
          phone: string
          price: number
          receipt: string | null
          status: string
          user_id: string | null
          variant_id: string | null
        }
        Insert: {
          activity_id: string
          booking_date?: string
          created_at?: string
          email: string
          first_name: string
          id?: string
          last_name: string
          notes?: string | null
          package_id?: string | null
          phone: string
          price: number
          receipt?: string | null
          status?: string
          user_id?: string | null
          variant_id?: string | null
        }
        Update: {
          activity_id?: string
          booking_date?: string
          created_at?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          notes?: string | null
          package_id?: string | null
          phone?: string
          price?: number
          receipt?: string | null
          status?: string
          user_id?: string | null
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_bookings_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_bookings_package_id_fkey"
            columns: ["package_id"]
            isOneToOne: false
            referencedRelation: "activity_packages"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_bookings_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "activity_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_expectations: {
        Row: {
          activity_id: string
          created_at: string
          description: string
          id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          description: string
          id?: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          description?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_expectations_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_images: {
        Row: {
          activity_id: string
          alt_text: string | null
          created_at: string | null
          display_order: number
          id: string
          image_url: string
        }
        Insert: {
          activity_id: string
          alt_text?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          image_url: string
        }
        Update: {
          activity_id?: string
          alt_text?: string | null
          created_at?: string | null
          display_order?: number
          id?: string
          image_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_images_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_locations: {
        Row: {
          address: string
          city: string | null
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
        }
        Insert: {
          address: string
          city?: string | null
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          name: string
        }
        Update: {
          address?: string
          city?: string | null
          created_at?: string
          id?: string
          latitude?: number
          longitude?: number
          name?: string
        }
        Relationships: []
      }
      activity_organizers: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      activity_packages: {
        Row: {
          activity_id: string
          created_at: string
          description: string | null
          id: string
          max_participants: number | null
          name: string
          price: number
        }
        Insert: {
          activity_id: string
          created_at?: string
          description?: string | null
          id?: string
          max_participants?: number | null
          name: string
          price: number
        }
        Update: {
          activity_id?: string
          created_at?: string
          description?: string | null
          id?: string
          max_participants?: number | null
          name?: string
          price?: number
        }
        Relationships: [
          {
            foreignKeyName: "activity_packages_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_requirements: {
        Row: {
          activity_id: string
          created_at: string
          description: string
          id: string
        }
        Insert: {
          activity_id: string
          created_at?: string
          description: string
          id?: string
        }
        Update: {
          activity_id?: string
          created_at?: string
          description?: string
          id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_requirements_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_reviews: {
        Row: {
          activity_id: string
          comment: string | null
          created_at: string
          id: string
          rating: number
          review_date: string
          reviewer_name: string
          user_id: string | null
        }
        Insert: {
          activity_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          review_date?: string
          reviewer_name: string
          user_id?: string | null
        }
        Update: {
          activity_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          review_date?: string
          reviewer_name?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_reviews_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
        ]
      }
      activity_variants: {
        Row: {
          activity_id: string
          created_at: string
          description: string | null
          id: string
          location_id: string | null
          name: string
          price_adjustment: number | null
        }
        Insert: {
          activity_id: string
          created_at?: string
          description?: string | null
          id?: string
          location_id?: string | null
          name: string
          price_adjustment?: number | null
        }
        Update: {
          activity_id?: string
          created_at?: string
          description?: string | null
          id?: string
          location_id?: string | null
          name?: string
          price_adjustment?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "activity_variants_activity_id_fkey"
            columns: ["activity_id"]
            isOneToOne: false
            referencedRelation: "activities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "activity_variants_location_id_fkey"
            columns: ["location_id"]
            isOneToOne: false
            referencedRelation: "activity_locations"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          email: string | null
          first_name: string | null
          id: string
          last_name: string | null
          phone: string | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          email?: string | null
          first_name?: string | null
          id: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          email?: string | null
          first_name?: string | null
          id?: string
          last_name?: string | null
          phone?: string | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

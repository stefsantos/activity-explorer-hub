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
          price: number
          rating: number | null
          review_count: number | null
          schedule: string | null
          title: string
          updated_at: string
        }
        Insert: {
          category: string
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
          price: number
          rating?: number | null
          review_count?: number | null
          schedule?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          category?: string
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
          price?: number
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
          package_id: string | null
          phone: string
          price: number
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
          package_id?: string | null
          phone: string
          price: number
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
          package_id?: string | null
          phone?: string
          price?: number
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
      activity_locations: {
        Row: {
          address: string
          created_at: string
          id: string
          latitude: number
          longitude: number
          name: string
        }
        Insert: {
          address: string
          created_at?: string
          id?: string
          latitude: number
          longitude: number
          name: string
        }
        Update: {
          address?: string
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
        }
        Insert: {
          activity_id: string
          comment?: string | null
          created_at?: string
          id?: string
          rating: number
          review_date?: string
          reviewer_name: string
        }
        Update: {
          activity_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          rating?: number
          review_date?: string
          reviewer_name?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

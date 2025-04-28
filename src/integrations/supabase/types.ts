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
      bookings: {
        Row: {
          booking_date: string
          booking_time: string | null
          created_at: string | null
          fuel_type: string[] | null
          id: string
          station_id: string
          status: string
          time_slot_id: string
          user_id: string
          vehicle_id: string
        }
        Insert: {
          booking_date: string
          booking_time?: string | null
          created_at?: string | null
          fuel_type?: string[] | null
          id?: string
          station_id: string
          status?: string
          time_slot_id: string
          user_id: string
          vehicle_id: string
        }
        Update: {
          booking_date?: string
          booking_time?: string | null
          created_at?: string | null
          fuel_type?: string[] | null
          id?: string
          station_id?: string
          status?: string
          time_slot_id?: string
          user_id?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_time_slot_id_fkey"
            columns: ["time_slot_id"]
            isOneToOne: false
            referencedRelation: "time_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "bookings_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          first_name: string | null
          id: number
          last_name: string | null
          phone: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: never
          last_name?: string | null
          phone?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          first_name?: string | null
          id?: never
          last_name?: string | null
          phone?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      stations: {
        Row: {
          address: string
          city: string
          closing_time: string
          created_at: string | null
          created_by: string | null
          distance: number | null
          fuel_types: string[] | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          opening_time: string
          pincode: number | null
          rating: number | null
          state: string
        }
        Insert: {
          address: string
          city: string
          closing_time: string
          created_at?: string | null
          created_by?: string | null
          distance?: number | null
          fuel_types?: string[] | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          opening_time: string
          pincode?: number | null
          rating?: number | null
          state: string
        }
        Update: {
          address?: string
          city?: string
          closing_time?: string
          created_at?: string | null
          created_by?: string | null
          distance?: number | null
          fuel_types?: string[] | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          opening_time?: string
          pincode?: number | null
          rating?: number | null
          state?: string
        }
        Relationships: []
      }
      time_slots: {
        Row: {
          created_at: string | null
          date: string | null
          id: string
          is_available: boolean | null
          station_id: string
          time: string | null
        }
        Insert: {
          created_at?: string | null
          date?: string | null
          id?: string
          is_available?: boolean | null
          station_id: string
          time?: string | null
        }
        Update: {
          created_at?: string | null
          date?: string | null
          id?: string
          is_available?: boolean | null
          station_id?: string
          time?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "time_slots_station_id_fkey"
            columns: ["station_id"]
            isOneToOne: false
            referencedRelation: "stations"
            referencedColumns: ["id"]
          },
        ]
      }
      updated_at: {
        Row: {
          created_at: string
          id: number
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      vehicles: {
        Row: {
          cng_capacity: number | null
          created_at: string | null
          fuel_type: string | null
          id: string
          license_plate: string | null
          made: string | null
          make: string
          model: string
          name: string | null
          reg_number: string | null
          updated_at: string | null
          user_id: string
          year: number | null
        }
        Insert: {
          cng_capacity?: number | null
          created_at?: string | null
          fuel_type?: string | null
          id?: string
          license_plate?: string | null
          made?: string | null
          make: string
          model: string
          name?: string | null
          reg_number?: string | null
          updated_at?: string | null
          user_id: string
          year?: number | null
        }
        Update: {
          cng_capacity?: number | null
          created_at?: string | null
          fuel_type?: string | null
          id?: string
          license_plate?: string | null
          made?: string | null
          make?: string
          model?: string
          name?: string | null
          reg_number?: string | null
          updated_at?: string | null
          user_id?: string
          year?: number | null
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

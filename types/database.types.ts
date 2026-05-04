export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      event_day_members: {
        Row: {
          created_at: string
          event_day_id: string
          member_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          event_day_id: string
          member_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          event_day_id?: string
          member_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_day_members_event_day_id_fkey"
            columns: ["event_day_id"]
            isOneToOne: false
            referencedRelation: "event_days"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "event_day_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      event_days: {
        Row: {
          created_at: string
          date: string
          day_number: number
          event_id: string
          id: string
          updated_at: string
          venue: string | null
        }
        Insert: {
          created_at?: string
          date: string
          day_number: number
          event_id: string
          id?: string
          updated_at?: string
          venue?: string | null
        }
        Update: {
          created_at?: string
          date?: string
          day_number?: number
          event_id?: string
          id?: string
          updated_at?: string
          venue?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "event_days_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      event_slots: {
        Row: {
          created_at: string
          ends_at: string
          event_day_id: string
          id: string
          slot_number: number
          starts_at: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          ends_at: string
          event_day_id: string
          id?: string
          slot_number: number
          starts_at: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          ends_at?: string
          event_day_id?: string
          id?: string
          slot_number?: number
          starts_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "event_slots_event_day_id_fkey"
            columns: ["event_day_id"]
            isOneToOne: false
            referencedRelation: "event_days"
            referencedColumns: ["id"]
          },
        ]
      }
      events: {
        Row: {
          cd_type: string
          created_at: string
          format: string
          fortune_url: string | null
          id: string
          release_id: string
          unit_price: number
          updated_at: string
        }
        Insert: {
          cd_type: string
          created_at?: string
          format: string
          fortune_url?: string | null
          id?: string
          release_id: string
          unit_price: number
          updated_at?: string
        }
        Update: {
          cd_type?: string
          created_at?: string
          format?: string
          fortune_url?: string | null
          id?: string
          release_id?: string
          unit_price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "events_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      members: {
        Row: {
          birthday: string | null
          created_at: string
          generation: number
          id: string
          name: string
          updated_at: string
        }
        Insert: {
          birthday?: string | null
          created_at?: string
          generation: number
          id?: string
          name: string
          updated_at?: string
        }
        Update: {
          birthday?: string | null
          created_at?: string
          generation?: number
          id?: string
          name?: string
          updated_at?: string
        }
        Relationships: []
      }
      release_centers: {
        Row: {
          center_order: number
          created_at: string
          member_id: string
          release_id: string
          updated_at: string
        }
        Insert: {
          center_order: number
          created_at?: string
          member_id: string
          release_id: string
          updated_at?: string
        }
        Update: {
          center_order?: number
          created_at?: string
          member_id?: string
          release_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "release_centers_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "release_centers_release_id_fkey"
            columns: ["release_id"]
            isOneToOne: false
            referencedRelation: "releases"
            referencedColumns: ["id"]
          },
        ]
      }
      // MANUAL: 以下のテーブルは手動追加。db-reset 後に supabase gen types で再生成すること
      registrations: {
        Row: {
          id: string
          user_id: string
          reception_round_id: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reception_round_id: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reception_round_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "registrations_reception_round_id_fkey"
            columns: ["reception_round_id"]
            isOneToOne: false
            referencedRelation: "reception_rounds"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_items: {
        Row: {
          id: string
          registration_id: string
          event_slot_id: string
          member_id: string
          applied_count: number
          created_at: string
        }
        Insert: {
          id?: string
          registration_id: string
          event_slot_id: string
          member_id: string
          applied_count: number
          created_at?: string
        }
        Update: {
          id?: string
          registration_id?: string
          event_slot_id?: string
          member_id?: string
          applied_count?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "registration_items_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      registration_rates: {
        Row: {
          id: string
          registration_id: string
          member_id: string
          expected_win_rate: number
          created_at: string
        }
        Insert: {
          id?: string
          registration_id: string
          member_id: string
          expected_win_rate: number
          created_at?: string
        }
        Update: {
          id?: string
          registration_id?: string
          member_id?: string
          expected_win_rate?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "registration_rates_registration_id_fkey"
            columns: ["registration_id"]
            isOneToOne: false
            referencedRelation: "registrations"
            referencedColumns: ["id"]
          },
        ]
      }
      reception_rounds: {
        Row: {
          id: string
          event_id: string
          round_number: number
          start_at: string
          end_at: string
          max_applications: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          event_id: string
          round_number: number
          start_at: string
          end_at: string
          max_applications: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          event_id?: string
          round_number?: number
          start_at?: string
          end_at?: string
          max_applications?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reception_rounds_event_id_fkey"
            columns: ["event_id"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["id"]
          },
        ]
      }
      reception_round_targets: {
        Row: {
          reception_round_id: string
          event_day_id: string
          is_final_round: boolean
          created_at: string
        }
        Insert: {
          reception_round_id: string
          event_day_id: string
          is_final_round?: boolean
          created_at?: string
        }
        Update: {
          reception_round_id?: string
          event_day_id?: string
          is_final_round?: boolean
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reception_round_targets_reception_round_id_fkey"
            columns: ["reception_round_id"]
            isOneToOne: false
            referencedRelation: "reception_rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reception_round_targets_event_day_id_fkey"
            columns: ["event_day_id"]
            isOneToOne: false
            referencedRelation: "event_days"
            referencedColumns: ["id"]
          },
        ]
      }
      round_applications: {
        Row: {
          id: string
          user_id: string
          reception_round_id: string
          event_slot_id: string
          member_id: string
          applied_count: number
          won_count: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          reception_round_id: string
          event_slot_id: string
          member_id: string
          applied_count: number
          won_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          reception_round_id?: string
          event_slot_id?: string
          member_id?: string
          applied_count?: number
          won_count?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "round_applications_reception_round_id_fkey"
            columns: ["reception_round_id"]
            isOneToOne: false
            referencedRelation: "reception_rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "round_applications_event_slot_id_fkey"
            columns: ["event_slot_id"]
            isOneToOne: false
            referencedRelation: "event_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "round_applications_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      round_application_rates: {
        Row: {
          user_id: string
          reception_round_id: string
          member_id: string
          expected_win_rate: number
          created_at: string
        }
        Insert: {
          user_id: string
          reception_round_id: string
          member_id: string
          expected_win_rate: number
          created_at?: string
        }
        Update: {
          user_id?: string
          reception_round_id?: string
          member_id?: string
          expected_win_rate?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "round_application_rates_reception_round_id_fkey"
            columns: ["reception_round_id"]
            isOneToOne: false
            referencedRelation: "reception_rounds"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "round_application_rates_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      user_oshi_members: {
        Row: {
          user_id: string
          member_id: string
          display_order: number
          created_at: string
        }
        Insert: {
          user_id: string
          member_id: string
          display_order?: number
          created_at?: string
        }
        Update: {
          user_id?: string
          member_id?: string
          display_order?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_oshi_members_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      attendance_records: {
        Row: {
          id: string
          user_id: string
          event_slot_id: string
          member_id: string
          status: string
          memo: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          event_slot_id: string
          member_id: string
          status: string
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          event_slot_id?: string
          member_id?: string
          status?: string
          memo?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "attendance_records_event_slot_id_fkey"
            columns: ["event_slot_id"]
            isOneToOne: false
            referencedRelation: "event_slots"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "attendance_records_member_id_fkey"
            columns: ["member_id"]
            isOneToOne: false
            referencedRelation: "members"
            referencedColumns: ["id"]
          },
        ]
      }
      releases: {
        Row: {
          created_at: string
          id: string
          number: number
          release_date: string | null
          release_type: string
          title: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          number: number
          release_date?: string | null
          release_type: string
          title: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          number?: number
          release_date?: string | null
          release_type?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
    }
    // MANUAL: ビューの型定義
    Views: {
      v_participation_status: {
        Row: {
          user_id: string
          event_id: string
          event_day_id: string
          slot_number: number
          event_slot_id: string
          member_id: string
          status: string
          total_applied: number
          total_won: number
          pending_count: number
        }
        Relationships: []
      }
      v_user_release_summary: {
        Row: {
          user_id: string
          release_id: string
          total_applied: number
          total_won: number
          total_cost: number
          used_serials: number
          pending_serials: number
        }
        Relationships: []
      }
    }
    Functions: {
      get_slot_popularity: {
        Args: {
          p_event_id: string
          p_member_id: string
        }
        Returns: {
          event_slot_id: string
          event_day_id: string
          slot_number: number
          popularity_level: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const


export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
    
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.4"
  }
  public: {
    Tables: {
      profiles: {
      Row: {
        id: string; // uuid
        credits: number;
      };
      Insert: {
        id: string;
        credits?: number;
      };
      Update: {
        id?: string;
        credits?: number;
      };
      Relationships: [
        {
          foreignKeyName: "profiles_id_fkey",
          columns: ["id"],
          isOneToOne: true,
          referencedRelation: "users",
          referencedColumns: ["id"],
        }
      ];
    };
      languages: {
        Row: {
          id: number
          name: string
        }
        Insert: {
          id?: number
          name: string
        }
        Update: {
          id?: number
          name?: string
        }
        Relationships: []
      }
      usercources: {
        Row: {
          id: number;
          user_id: string;
          course: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          course?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          course?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "usercources_user_id_fkey",
            columns: ["user_id"],
            isOneToOne: false,
            referencedRelation: "users",
            referencedColumns: ["id"],
          },
        ];
      }
      course_topics: {
          Row: {
            id: number;
            user_id: string;
            course_id: number;
            topic_name: string;
            language: string;
          };
          Insert: {
            id?: number;
            user_id: string;
            course_id: number;
            topic_name: string;
          };
          Update: {
            id?: number;
            user_id?: string;
            course_id?: number;
            topic_name?: string;
          };
          Relationships: [
            {
              foreignKeyName: "course_topics_user_id_fkey",
              columns: ["user_id"],
              isOneToOne: false,
              referencedRelation: "users",
              referencedColumns: ["id"],
            },
            {
              foreignKeyName: "course_topics_course_id_fkey",
              columns: ["course_id"],
              isOneToOne: false,
              referencedRelation: "usercources",
              referencedColumns: ["id"],
            },
          ];
      }
      topic_subtopics: {
        Row: {
          id: number;
          user_id: string;
          topic_id: number;
          subtopic_name: string;
          documentation: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          topic_id: number;
          subtopic_name: string;
          documentation?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          topic_id?: number;
          subtopic_name?: string;
          documentation?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "topic_subtopics_user_id_fkey",
            columns: ["user_id"],
            isOneToOne: false,
            referencedRelation: "users",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "topic_subtopics_topic_id_fkey",
            columns: ["topic_id"],
            isOneToOne: false,
            referencedRelation: "course_topics",
            referencedColumns: ["id"],
          },
        ];
      }
      subtopic_questions: {
        Row: {
          id: number;
          user_id: string;
          subtopic_id: number;
          question_text: string;
          hint: string | null;
          solution: string | null;
        };
        Insert: {
          id?: number;
          user_id: string;
          subtopic_id: number;
          question_text: string;
          hint?: string | null;
          solution?: string | null;
        };
        Update: {
          id?: number;
          user_id?: string;
          subtopic_id?: number;
          question_text?: string;
          hint?: string | null;
          solution?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "subtopic_questions_user_id_fkey",
            columns: ["user_id"],
            isOneToOne: false,
            referencedRelation: "users",
            referencedColumns: ["id"],
          },
          {
            foreignKeyName: "subtopic_questions_subtopic_id_fkey",
            columns: ["subtopic_id"],
            isOneToOne: false,
            referencedRelation: "topic_subtopics",
            referencedColumns: ["id"],
          },
        ];
      }

      questions: {
        Row: {
          hint: string | null
          id: number
          question: string | null
          solution: string | null
          topic_id: number | null
        }
        Insert: {
          hint?: string | null
          id?: number
          question?: string | null
          solution?: string | null
          topic_id?: number | null
        }
        Update: {
          hint?: string | null
          id?: number
          question?: string | null
          solution?: string | null
          topic_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "questions_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          documentation: string | null
          id: number
          language_id: number | null
          name: string
        }
        Insert: {
          documentation?: string | null
          id?: number
          language_id?: number | null
          name: string
        }
        Update: {
          documentation?: string | null
          id?: number
          language_id?: number | null
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "topics_language_id_fkey"
            columns: ["language_id"]
            isOneToOne: false
            referencedRelation: "languages"
            referencedColumns: ["id"]
          },
        ]
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
  public: {
    Enums: {},
  },
} as const

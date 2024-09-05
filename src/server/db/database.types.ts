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
      fr_extract_epic_context_dataset: {
        Row: {
          created_at: string
          epic_context_result: string | null
          epic_name_input: string | null
          id: number
          original_text_input: string | null
        }
        Insert: {
          created_at?: string
          epic_context_result?: string | null
          epic_name_input?: string | null
          id?: number
          original_text_input?: string | null
        }
        Update: {
          created_at?: string
          epic_context_result?: string | null
          epic_name_input?: string | null
          id?: number
          original_text_input?: string | null
        }
        Relationships: []
      }
      fr_extract_epics_dataset: {
        Row: {
          created_at: string
          epics: string[] | null
          id: number
          original_input: string | null
        }
        Insert: {
          created_at?: string
          epics?: string[] | null
          id?: number
          original_input?: string | null
        }
        Update: {
          created_at?: string
          epics?: string[] | null
          id?: number
          original_input?: string | null
        }
        Relationships: []
      }
      fr_extract_features_dataset: {
        Row: {
          created_at: string
          epic_context_input: string | null
          epic_name_input: string | null
          features_json_result: Json | null
          id: number
        }
        Insert: {
          created_at?: string
          epic_context_input?: string | null
          epic_name_input?: string | null
          features_json_result?: Json | null
          id?: number
        }
        Update: {
          created_at?: string
          epic_context_input?: string | null
          epic_name_input?: string | null
          features_json_result?: Json | null
          id?: number
        }
        Relationships: []
      }
      fr_extract_tasks_dataset: {
        Row: {
          created_at: string
          epic_context_input: string | null
          feature_name_input: string | null
          id: number
          tasks_json_result: Json | null
        }
        Insert: {
          created_at?: string
          epic_context_input?: string | null
          feature_name_input?: string | null
          id?: number
          tasks_json_result?: Json | null
        }
        Update: {
          created_at?: string
          epic_context_input?: string | null
          feature_name_input?: string | null
          id?: number
          tasks_json_result?: Json | null
        }
        Relationships: []
      }
      fr_projects: {
        Row: {
          created_at: string
          epics: Json | null
          estimate_matrix: Json | null
          id: number
          name: string | null
          original_input: string | null
        }
        Insert: {
          created_at?: string
          epics?: Json | null
          estimate_matrix?: Json | null
          id?: number
          name?: string | null
          original_input?: string | null
        }
        Update: {
          created_at?: string
          epics?: Json | null
          estimate_matrix?: Json | null
          id?: number
          name?: string | null
          original_input?: string | null
        }
        Relationships: []
      }
      mock_data: {
        Row: {
          created_at: string
          description: string | null
          id: number
          proto_json: Json | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          proto_json?: Json | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          proto_json?: Json | null
        }
        Relationships: []
      }
      processed_files: {
        Row: {
          created_at: string
          id: number
          name: string | null
          original_url: string | null
          processed_url: string | null
          token_length: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          original_url?: string | null
          processed_url?: string | null
          token_length?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          original_url?: string | null
          processed_url?: string | null
          token_length?: number | null
        }
        Relationships: []
      }
      public_processed_files: {
        Row: {
          created_at: string
          id: number
          name: string | null
          token_length: number | null
        }
        Insert: {
          created_at?: string
          id?: number
          name?: string | null
          token_length?: number | null
        }
        Update: {
          created_at?: string
          id?: number
          name?: string | null
          token_length?: number | null
        }
        Relationships: []
      }
      resume_diagnosis_dataset: {
        Row: {
          created_at: string
          id: number
          is_eval: boolean | null
          nth_edu: string | null
          nth_exp: string | null
          nth_location: string | null
          nth_other: string | null
          nth_stack: string | null
          nth_tools: string | null
          req_edu: string | null
          req_exp: string | null
          req_location: string | null
          req_other: string | null
          req_stack: string | null
          req_tools: string | null
        }
        Insert: {
          created_at?: string
          id?: number
          is_eval?: boolean | null
          nth_edu?: string | null
          nth_exp?: string | null
          nth_location?: string | null
          nth_other?: string | null
          nth_stack?: string | null
          nth_tools?: string | null
          req_edu?: string | null
          req_exp?: string | null
          req_location?: string | null
          req_other?: string | null
          req_stack?: string | null
          req_tools?: string | null
        }
        Update: {
          created_at?: string
          id?: number
          is_eval?: boolean | null
          nth_edu?: string | null
          nth_exp?: string | null
          nth_location?: string | null
          nth_other?: string | null
          nth_stack?: string | null
          nth_tools?: string | null
          req_edu?: string | null
          req_exp?: string | null
          req_location?: string | null
          req_other?: string | null
          req_stack?: string | null
          req_tools?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      hnswhandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      ivfflathandler: {
        Args: {
          "": unknown
        }
        Returns: unknown
      }
      kw_match_documents: {
        Args: {
          query_text: string
          match_count: number
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      match_documents: {
        Args: {
          query_embedding: string
          match_count?: number
          filter?: Json
        }
        Returns: {
          id: number
          content: string
          metadata: Json
          similarity: number
        }[]
      }
      vector_avg: {
        Args: {
          "": number[]
        }
        Returns: string
      }
      vector_dims: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_norm: {
        Args: {
          "": string
        }
        Returns: number
      }
      vector_out: {
        Args: {
          "": string
        }
        Returns: unknown
      }
      vector_send: {
        Args: {
          "": string
        }
        Returns: string
      }
      vector_typmod_in: {
        Args: {
          "": unknown[]
        }
        Returns: number
      }
    }
    Enums: {
      estimateColumnType: "REGULAR" | "MULTIPLIER"
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

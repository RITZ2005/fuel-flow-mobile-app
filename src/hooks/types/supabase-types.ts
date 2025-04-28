
import { PostgrestError } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Define valid table names from the Database type
export type ValidTableName = keyof Database['public']['Tables'];
export type TableRow<T extends ValidTableName> = Database['public']['Tables'][T]['Row'];

export interface UseSupabaseCrudOptions {
  select?: string;
  userId?: string | null;
  initialFetch?: boolean;
}

export interface UseSupabaseCrudReturn<T> {
  data: T[] | null;
  loading: boolean;
  error: PostgrestError | Error | null;
  fetch: () => Promise<void>;
  create: (data: Omit<T, 'id'>) => Promise<{ data: T[] | null; error: PostgrestError | Error | null }>;
  update: (id: string, data: Partial<T>) => Promise<{ data: T[] | null; error: PostgrestError | Error | null }>;
  remove: (id: string) => Promise<{ error: PostgrestError | Error | null }>;
}

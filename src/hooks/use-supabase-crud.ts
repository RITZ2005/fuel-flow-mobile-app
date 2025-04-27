import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

// Define valid table names from the Database type
type ValidTableName = keyof Database['public']['Tables'];
type TableRow<T extends ValidTableName> = Database['public']['Tables'][T]['Row'];

interface UseSupabaseCrudOptions {
  select?: string;
  userId?: string | null;
  initialFetch?: boolean;
}

interface UseSupabaseCrudReturn<T> {
  data: T[] | null;
  loading: boolean;
  error: PostgrestError | Error | null;
  fetch: () => Promise<void>;
  create: (data: Omit<T, 'id'>) => Promise<{ data: T[] | null; error: PostgrestError | Error | null }>;
  update: (id: string, data: Partial<T>) => Promise<{ data: T[] | null; error: PostgrestError | Error | null }>;
  remove: (id: string) => Promise<{ error: PostgrestError | Error | null }>;
}

export function useSupabaseCrud<T extends { id: string }>(
  table: ValidTableName,
  options: UseSupabaseCrudOptions = {}
): UseSupabaseCrudReturn<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(options.initialFetch !== false);
  const [error, setError] = useState<PostgrestError | Error | null>(null);
  const { toast } = useToast();

  const { select = '*', userId = null } = options;

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Create a basic query without type complexity
      const queryBuilder = supabase.from(table).select(select);
      
      // Conditionally apply the user_id filter
      const { data: result, error: supabaseError } = userId !== null && userId !== undefined 
        ? await queryBuilder.eq('user_id', userId)
        : await queryBuilder;
      
      if (supabaseError) {
        setError(supabaseError);
        console.error(`Error fetching ${table}:`, supabaseError);
        toast({
          variant: "destructive",
          title: `Error Loading Data`,
          description: supabaseError.message || `Failed to load ${String(table)}`
        });
      } else {
        // Cast the result with a more direct approach to avoid deep type instantiation
        setData(result as any);
      }
    } catch (err: any) {
      setError(err);
      console.error(`Exception in fetch ${String(table)}:`, err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || `An unexpected error occurred while fetching ${String(table)}`
      });
    } finally {
      setLoading(false);
    }
  }, [table, select, userId, toast]);

  useEffect(() => {
    if (options.initialFetch !== false) {
      fetch();
    }
  }, [fetch, options.initialFetch]);

  const create = async (newData: Omit<T, 'id'>) => {
    try {
      const { data: result, error: supabaseError } = await supabase
        .from(table)
        .insert(newData)
        .select();
      
      if (supabaseError) {
        console.error(`Error creating ${table}:`, supabaseError);
        toast({
          variant: "destructive",
          title: "Error",
          description: supabaseError.message || `Failed to create new ${String(table).slice(0, -1)}`
        });
        return { data: null, error: supabaseError };
      }
      
      setData(prev => {
        const newArray = [...(prev || [])];
        if (result) {
          newArray.push(...(result as unknown as T[]));
        }
        return newArray;
      });
      
      toast({
        title: "Success",
        description: `${String(table).charAt(0).toUpperCase() + String(table).slice(1, -1)} created successfully`
      });
      
      return { data: result as unknown as T[] | null, error: null };
    } catch (err: any) {
      console.error(`Exception in create ${String(table)}:`, err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || `An unexpected error occurred`
      });
      return { data: null, error: err };
    }
  };

  const update = async (id: string, updateData: Partial<T>) => {
    try {
      const { data: result, error: supabaseError } = await supabase
        .from(table)
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (supabaseError) {
        console.error(`Error updating ${table}:`, supabaseError);
        toast({
          variant: "destructive",
          title: "Error",
          description: supabaseError.message || `Failed to update ${String(table).slice(0, -1)}`
        });
        return { data: null, error: supabaseError };
      }
      
      setData(prevData => {
        if (!prevData) return prevData;
        return prevData.map(item => (item.id === id ? { ...item, ...updateData } : item));
      });
      
      toast({
        title: "Success",
        description: `${String(table).charAt(0).toUpperCase() + String(table).slice(1, -1)} updated successfully`
      });
      
      return { data: result as unknown as T[] | null, error: null };
    } catch (err: any) {
      console.error(`Exception in update ${String(table)}:`, err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || `An unexpected error occurred`
      });
      return { data: null, error: err };
    }
  };

  const remove = async (id: string) => {
    try {
      const { error: supabaseError } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (supabaseError) {
        console.error(`Error deleting ${table}:`, supabaseError);
        toast({
          variant: "destructive",
          title: "Error",
          description: supabaseError.message || `Failed to delete ${String(table).slice(0, -1)}`
        });
        return { error: supabaseError };
      }
      
      setData(prevData => {
        if (!prevData) return prevData;
        return prevData.filter(item => item.id !== id);
      });
      
      toast({
        title: "Success",
        description: `${String(table).charAt(0).toUpperCase() + String(table).slice(1, -1)} deleted successfully`
      });
      
      return { error: null };
    } catch (err: any) {
      console.error(`Exception in delete ${String(table)}:`, err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || `An unexpected error occurred`
      });
      return { error: err };
    }
  };

  return {
    data,
    loading,
    error,
    fetch,
    create,
    update,
    remove
  };
}

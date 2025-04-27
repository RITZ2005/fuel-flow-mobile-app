
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { useToast } from './use-toast';
import { Database } from '@/integrations/supabase/types';

// Define valid table names from the Database type
type ValidTableName = keyof Database['public']['Tables'];

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

  const fetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cast table to string to make TypeScript happy with the Supabase API
      const tableStr = table as string;
      
      let query = supabase.from(tableStr).select(select);
      
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data: result, error: supabaseError } = await query;
      
      if (supabaseError) {
        setError(supabaseError);
        console.error(`Error fetching ${tableStr}:`, supabaseError);
        toast({
          variant: "destructive",
          title: `Error Loading Data`,
          description: supabaseError.message || `Failed to load ${tableStr}`
        });
      } else {
        setData(result as unknown as T[]);
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
  };

  const create = async (newData: Omit<T, 'id'>) => {
    try {
      // Cast table to string to make TypeScript happy with the Supabase API
      const tableStr = table as string;
      
      const { data: result, error: supabaseError } = await supabase
        .from(tableStr)
        .insert(newData)
        .select();
      
      if (supabaseError) {
        console.error(`Error creating ${tableStr}:`, supabaseError);
        toast({
          variant: "destructive",
          title: "Error",
          description: supabaseError.message || `Failed to create new ${String(tableStr).slice(0, -1)}`
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
        description: `${String(tableStr).charAt(0).toUpperCase() + String(tableStr).slice(1, -1)} created successfully`
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
      // Cast table to string to make TypeScript happy with the Supabase API
      const tableStr = table as string;
      
      const { data: result, error: supabaseError } = await supabase
        .from(tableStr)
        .update(updateData)
        .eq('id', id)
        .select();
      
      if (supabaseError) {
        console.error(`Error updating ${tableStr}:`, supabaseError);
        toast({
          variant: "destructive",
          title: "Error",
          description: supabaseError.message || `Failed to update ${String(tableStr).slice(0, -1)}`
        });
        return { data: null, error: supabaseError };
      }
      
      setData(prevData => {
        if (!prevData) return prevData;
        return prevData.map(item => (item.id === id ? { ...item, ...updateData } : item));
      });
      
      toast({
        title: "Success",
        description: `${String(tableStr).charAt(0).toUpperCase() + String(tableStr).slice(1, -1)} updated successfully`
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
      // Cast table to string to make TypeScript happy with the Supabase API
      const tableStr = table as string;
      
      const { error: supabaseError } = await supabase
        .from(tableStr)
        .delete()
        .eq('id', id);
      
      if (supabaseError) {
        console.error(`Error deleting ${tableStr}:`, supabaseError);
        toast({
          variant: "destructive",
          title: "Error",
          description: supabaseError.message || `Failed to delete ${String(tableStr).slice(0, -1)}`
        });
        return { error: supabaseError };
      }
      
      setData(prevData => {
        if (!prevData) return prevData;
        return prevData.filter(item => item.id !== id);
      });
      
      toast({
        title: "Success",
        description: `${String(tableStr).charAt(0).toUpperCase() + String(tableStr).slice(1, -1)} deleted successfully`
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

  // Initial fetch if initialFetch is true
  if (options.initialFetch !== false) {
    fetch();
  }

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

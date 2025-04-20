
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { useToast } from './use-toast';
import { Tables } from '@/integrations/supabase/types';

// Define valid table names as a union type
type TableName = 'stations' | 'time_slots' | 'vehicles' | 'bookings' | 'profiles' | 'updated_at';

// Simplified return type with explicit any to avoid excessive type instantiation
interface SupabaseHookReturn<T> {
  data: T[] | null;
  loading: boolean;
  error: PostgrestError | Error | null;
  fetch: () => Promise<void>;
  create: (data: any) => Promise<{ data: any; error: PostgrestError | Error | null }>;
  update: (id: string, data: any) => Promise<{ data: any; error: PostgrestError | Error | null }>;
  remove: (id: string) => Promise<{ error: PostgrestError | Error | null }>;
}

export function useSupabase<T>(
  table: TableName,
  options: {
    select?: string;
    userId?: string | null;
    initialFetch?: boolean;
  } = {}
): SupabaseHookReturn<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(options.initialFetch !== false);
  const [error, setError] = useState<PostgrestError | Error | null>(null);
  const { toast } = useToast();

  const { select = '*', userId = null, initialFetch = true } = options;

  const fetch = async () => {
    try {
      setLoading(true);
      setError(null);
      
      let query = supabase.from(table).select(select);
      
      // Filter by user_id if provided
      if (userId) {
        query = query.eq('user_id', userId);
      }
      
      const { data: result, error: supabaseError } = await query;
      
      if (supabaseError) {
        setError(supabaseError);
        console.error(`Error fetching ${table}:`, supabaseError);
        toast({
          variant: "destructive",
          title: `Error Loading Data`,
          description: supabaseError.message || `Failed to load ${table}`
        });
      } else {
        setData(result as T[]);
      }
    } catch (err: any) {
      setError(err);
      console.error(`Exception in fetch ${table}:`, err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || `An unexpected error occurred while fetching ${table}`
      });
    } finally {
      setLoading(false);
    }
  };

  const create = async (newData: any) => {
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
          description: supabaseError.message || `Failed to create new ${table.slice(0, -1)}`
        });
        return { data: null, error: supabaseError };
      }
      
      // Update local data state
      setData(prev => prev ? [...prev, ...result as T[]] : result as T[]);
      
      toast({
        title: "Success",
        description: `${table.charAt(0).toUpperCase() + table.slice(1, -1)} created successfully`
      });
      
      return { data: result, error: null };
    } catch (err: any) {
      console.error(`Exception in create ${table}:`, err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || `An unexpected error occurred`
      });
      return { data: null, error: err };
    }
  };

  const update = async (id: string, updateData: any) => {
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
          description: supabaseError.message || `Failed to update ${table.slice(0, -1)}`
        });
        return { data: null, error: supabaseError };
      }
      
      // Update local data state
      setData(prev => 
        prev ? prev.map(item => (item as any).id === id ? { ...item, ...updateData } : item) : prev
      );
      
      toast({
        title: "Success",
        description: `${table.charAt(0).toUpperCase() + table.slice(1, -1)} updated successfully`
      });
      
      return { data: result, error: null };
    } catch (err: any) {
      console.error(`Exception in update ${table}:`, err);
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
          description: supabaseError.message || `Failed to delete ${table.slice(0, -1)}`
        });
        return { error: supabaseError };
      }
      
      // Update local data state
      setData(prev => prev ? prev.filter(item => (item as any).id !== id) : prev);
      
      toast({
        title: "Success",
        description: `${table.charAt(0).toUpperCase() + table.slice(1, -1)} deleted successfully`
      });
      
      return { error: null };
    } catch (err: any) {
      console.error(`Exception in delete ${table}:`, err);
      toast({
        variant: "destructive",
        title: "Error",
        description: err.message || `An unexpected error occurred`
      });
      return { error: err };
    }
  };

  // Fetch data on initial render if initialFetch is true
  if (initialFetch && !data && !loading) {
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

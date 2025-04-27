
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { useToast } from './use-toast';

// Define valid table names as a union type
type TableName = 'stations' | 'time_slots' | 'vehicles' | 'bookings' | 'profiles' | 'updated_at';

// Generic type for the data
type SupabaseData = Record<string, any>;

// Interface for the hook return value with simplified types
interface SupabaseHookReturn {
  data: SupabaseData[] | null;
  loading: boolean;
  error: PostgrestError | Error | null;
  fetch: () => Promise<void>;
  create: (data: SupabaseData) => Promise<{ data: any; error: PostgrestError | Error | null }>;
  update: (id: string, data: SupabaseData) => Promise<{ data: any; error: PostgrestError | Error | null }>;
  remove: (id: string) => Promise<{ error: PostgrestError | Error | null }>;
}

export function useSupabase(
  table: TableName,
  options: {
    select?: string;
    userId?: string | null;
    initialFetch?: boolean;
  } = {}
): SupabaseHookReturn {
  const [data, setData] = useState<SupabaseData[] | null>(null);
  const [loading, setLoading] = useState<boolean>(options.initialFetch !== false);
  const [error, setError] = useState<PostgrestError | Error | null>(null);
  const { toast } = useToast();

  const { select = '*', userId = null, initialFetch = true } = options;

  // Fetch function
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
        setData(result);
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

  // Create function
  const create = async (newData: SupabaseData) => {
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
      setData(prev => prev ? [...prev, ...result] : result);
      
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

  // Update function
  const update = async (id: string, updateData: SupabaseData) => {
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
      if (data) {
        setData(data.map(item => (item.id === id ? { ...item, ...updateData } : item)));
      }
      
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

  // Remove function
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
      if (data) {
        setData(data.filter(item => item.id !== id));
      }
      
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

  // Use useEffect for initial fetch to avoid potential infinite loops
  useEffect(() => {
    if (initialFetch && !data && !error) {
      fetch();
    }
  }, []);

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

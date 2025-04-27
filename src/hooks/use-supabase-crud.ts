
import { useState, useEffect, useCallback } from 'react';
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

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fix: Use a string literal for the table name, not as ValidTableName
      const { data: result, error: supabaseError } = await supabase
        .from(table)
        .select(select)
        .conditionalFilter('user_id', userId);
      
      if (supabaseError) {
        setError(supabaseError);
        console.error(`Error fetching ${table}:`, supabaseError);
        toast({
          variant: "destructive",
          title: `Error Loading Data`,
          description: supabaseError.message || `Failed to load ${String(table)}`
        });
      } else {
        // Properly cast the result to avoid type errors
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

// Helper extension for the Supabase QueryBuilder
declare global {
  interface PostgrestFilterBuilder<T> {
    conditionalFilter: (column: string, value: any) => PostgrestFilterBuilder<T>;
  }
}

// Add a conditional filter method to the Supabase QueryBuilder prototype
if (typeof window !== 'undefined') {
  const originalFrom = supabase.from.bind(supabase);
  
  supabase.from = function(table) {
    const builder = originalFrom(table);
    
    if (builder && typeof builder === 'object') {
      const originalSelect = builder.select.bind(builder);
      
      builder.select = function(columns) {
        const filterBuilder = originalSelect(columns);
        
        if (filterBuilder && typeof filterBuilder === 'object' && !filterBuilder.conditionalFilter) {
          filterBuilder.conditionalFilter = function(column, value) {
            if (value !== undefined && value !== null) {
              return this.eq(column, value);
            }
            return this;
          };
        }
        
        return filterBuilder;
      };
    }
    
    return builder;
  };
}

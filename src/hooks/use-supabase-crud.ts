
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from './use-toast';
import { ValidTableName, UseSupabaseCrudOptions, UseSupabaseCrudReturn } from './types/supabase-types';
import { createRecord, updateRecord, removeRecord } from './utils/supabase-operations';

export function useSupabaseCrud<T extends { id: string }>(
  table: ValidTableName,
  options: UseSupabaseCrudOptions = {}
): UseSupabaseCrudReturn<T> {
  const [data, setData] = useState<T[] | null>(null);
  const [loading, setLoading] = useState<boolean>(options.initialFetch !== false);
  const [error, setError] = useState<any>(null);
  const { toast } = useToast();

  const { select = '*', userId = null } = options;

  const fetch = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      let query = supabase.from(table).select(select);
      
      if (userId !== null && userId !== undefined) {
        query = query.eq('user_id', userId);
      }
      
      const { data: result, error: supabaseError } = await query.order('created_at', { ascending: false });
      
      if (supabaseError) {
        setError(supabaseError);
        console.error(`Error fetching ${table}:`, supabaseError);
        toast({
          variant: "destructive",
          title: `Error Loading Data`,
          description: supabaseError.message || `Failed to load ${String(table)}`
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
        description: err.message || `An unexpected error occurred`
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
    const result = await createRecord<T>(table, newData, toast);
    if (result.data) {
      setData(prev => {
        const newArray = [...(prev || [])];
        newArray.unshift(...result.data!);
        return newArray;
      });
    }
    return result;
  };

  const update = async (id: string, updateData: Partial<T>) => {
    const result = await updateRecord<T>(table, id, updateData, toast);
    if (result.data) {
      setData(prevData => {
        if (!prevData) return prevData;
        return prevData.map(item => (item.id === id ? { ...item, ...updateData } : item));
      });
    }
    return result;
  };

  const remove = async (id: string) => {
    const result = await removeRecord(table, id, toast);
    if (!result.error) {
      setData(prevData => {
        if (!prevData) return prevData;
        return prevData.filter(item => item.id !== id);
      });
    }
    return result;
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

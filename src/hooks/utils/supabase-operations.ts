
import { PostgrestError } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { ValidTableName, TableRow } from '../types/supabase-types';
import { useToast } from '../use-toast';

export const createRecord = async <T extends { id: string }>(
  table: ValidTableName,
  data: Omit<T, 'id'>,
  toast: ReturnType<typeof useToast>['toast']
) => {
  try {
    const { data: result, error: supabaseError } = await supabase
      .from(table)
      .insert(data)
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

export const updateRecord = async <T extends { id: string }>(
  table: ValidTableName,
  id: string,
  updateData: Partial<T>,
  toast: ReturnType<typeof useToast>['toast']
) => {
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

export const removeRecord = async (
  table: ValidTableName,
  id: string,
  toast: ReturnType<typeof useToast>['toast']
) => {
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

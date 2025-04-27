
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Database } from '@/integrations/supabase/types';

// Define valid table names from the Database type
type ValidTableName = keyof Database['public']['Tables'];
type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseSupabaseRealtimeProps {
  table: ValidTableName;
  event?: RealtimeEvent;
  schema?: string;
  filter?: string;
}

export function useSupabaseRealtime<T extends { id: string }>(props: UseSupabaseRealtimeProps) {
  const { table, event = '*', schema = 'public', filter } = props;
  const [data, setData] = useState<T | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    // Cast table to string to make TypeScript happy with the Supabase API
    const tableStr = table as string;
    
    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event, schema, table: tableStr, filter },
        (payload) => {
          console.log('Realtime update received:', payload);
          setData(payload.new as T);
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status: ${status}`);
      });

    setChannel(channel);

    return () => {
      supabase.removeChannel(channel);
    };
  }, [table, event, schema, filter]);

  return { data, channel };
}

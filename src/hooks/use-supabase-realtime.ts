
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';
import { Tables } from '@/integrations/supabase/types';

type TableName = keyof Tables<'public'>;
type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseSupabaseRealtimeProps {
  table: TableName;
  event?: RealtimeEvent;
  schema?: string;
  filter?: string;
}

export function useSupabaseRealtime<T extends { id: string }>(props: UseSupabaseRealtimeProps) {
  const { table, event = '*', schema = 'public', filter } = props;
  const [data, setData] = useState<T | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    const channel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event, schema, table, filter },
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

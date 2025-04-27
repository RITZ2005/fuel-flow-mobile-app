
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RealtimeChannel } from '@supabase/supabase-js';

type RealtimeEvent = 'INSERT' | 'UPDATE' | 'DELETE' | '*';

interface UseSupabaseRealtimeProps {
  table: string;
  event?: RealtimeEvent;
  schema?: string;
  filter?: string;
}

export function useSupabaseRealtime<T = any>({
  table,
  event = '*',
  schema = 'public',
  filter
}: UseSupabaseRealtimeProps) {
  const [data, setData] = useState<T | null>(null);
  const [channel, setChannel] = useState<RealtimeChannel | null>(null);

  useEffect(() => {
    // Setup the realtime subscription
    const realtimeChannel = supabase.channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event,
          schema,
          table,
          filter
        },
        (payload) => {
          console.log('Realtime update received:', payload);
          setData(payload.new as T);
        }
      )
      .subscribe((status) => {
        console.log(`Realtime subscription status: ${status}`);
      });

    setChannel(realtimeChannel);

    // Cleanup function
    return () => {
      if (realtimeChannel) {
        supabase.removeChannel(realtimeChannel);
      }
    };
  }, [table, event, schema, filter]);

  return { data, channel };
}

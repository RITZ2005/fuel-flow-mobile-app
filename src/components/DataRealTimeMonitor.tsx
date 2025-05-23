
import React, { useEffect, useState } from 'react';
import { Database } from '@/integrations/supabase/types';
import { useSupabase, useSupabaseRealtime } from '@/hooks/use-supabase';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

// Define valid table names from the Database type
type ValidTableName = keyof Database['public']['Tables'];

interface DataRealTimeMonitorProps {
  table: ValidTableName;
  title: string;
  maxItems?: number;
}

export const DataRealTimeMonitor = <T extends { id: string }>({
  table,
  title,
  maxItems = 5
}: DataRealTimeMonitorProps) => {
  const { data: items, loading, error, fetch } = useSupabase<T>(table);
  const [lastUpdate, setLastUpdate] = useState<string | null>(null);
  
  const { data: realtimeData } = useSupabaseRealtime<T>({
    table,
    event: '*'
  });
  
  // Use useEffect to handle realtime updates
  useEffect(() => {
    if (realtimeData) {
      setLastUpdate(new Date().toLocaleTimeString());
      fetch(); // This will cause a refetch of the data when we get a realtime update
    }
  }, [realtimeData, fetch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-40">
        <Loader2 className="w-8 h-8 animate-spin text-cng-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4 border border-red-300 rounded-md">
        Error loading data: {error.message}
      </div>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">{title}</h3>
        {lastUpdate && (
          <Badge variant="outline" className="text-xs">
            Last update: {lastUpdate}
          </Badge>
        )}
      </div>
      
      {items && items.length > 0 ? (
        <div className="space-y-2 max-h-60 overflow-auto">
          {items.slice(0, maxItems).map((item) => (
            <div key={item.id} className="p-2 border rounded bg-slate-50">
              <div className="flex justify-between">
                <div className="font-medium">
                  {/* Use optional chaining and type checking for safe property access */}
                  {('name' in item ? String(item.name) : item.id.substring(0, 8))}
                </div>
                <div className="text-xs text-slate-500">ID: {item.id.substring(0, 8)}</div>
              </div>
              <div className="text-sm text-slate-600 mt-1">
                {Object.keys(item).slice(0, 3).map(key => {
                  if (key !== 'id' && key !== 'name') {
                    const value = typeof item[key as keyof T] === 'object' 
                      ? JSON.stringify(item[key as keyof T]).substring(0, 50) 
                      : String(item[key as keyof T]).substring(0, 50);
                    return (
                      <div key={key} className="text-xs">
                        <span className="font-medium">{key}:</span> {value}
                      </div>
                    );
                  }
                  return null;
                })}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-5 text-slate-500">No data available</div>
      )}
    </Card>
  );
};

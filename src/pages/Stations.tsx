
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import StationCard from '@/components/stations/StationCard';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

type Station = {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  open_time: string;
  close_time: string;
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
};

const Stations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [stations, setStations] = useState<Station[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const { data, error } = await supabase
          .from('stations')
          .select('*');
        
        if (error) {
          console.error('Error fetching stations:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load stations",
          });
        } else {
          setStations(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStations();
  }, [toast]);
  
  // Filter stations based on search query
  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.city.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Convert time format (for display)
  const formatTime = (timeStr: string) => {
    try {
      const [hours, minutes] = timeStr.split(':');
      const hour = parseInt(hours);
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const hour12 = hour % 12 || 12;
      return `${hour12}:${minutes} ${ampm}`;
    } catch (e) {
      return timeStr;
    }
  };
  
  // Calculate distance (mock for now, would use geolocation in a real app)
  const getDistance = (lat1: number | null, lon1: number | null) => {
    if (!lat1 || !lon1) return 'Unknown';
    // Mock distance for now
    return `${(Math.random() * 10).toFixed(1)} km`;
  };
  
  // Calculate available slots (mock, would fetch from time_slots table in a real implementation)
  const getAvailableSlots = () => {
    return Math.floor(Math.random() * 6); // 0-5 slots
  };
  
  return (
    <MobileLayout title="Nearby Stations">
      <div className="pt-2 pb-6">
        <div className="flex items-center bg-white rounded-lg border border-slate-200 mb-4 overflow-hidden">
          <div className="pl-3">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Search stations..."
            className="flex-1 py-3 px-2 focus:outline-none text-sm"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="p-3">
            <Filter size={18} className="text-slate-400" />
          </button>
        </div>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center text-sm text-slate-500">
            <MapPin size={14} className="mr-1" />
            <span>Showing stations near your location</span>
          </div>
          <button className="text-cng-secondary text-sm font-medium">View Map</button>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cng-primary"></div>
          </div>
        ) : filteredStations.length > 0 ? (
          filteredStations.map(station => (
            <StationCard 
              key={station.id}
              id={station.id}
              name={station.name}
              address={`${station.address}, ${station.city}`}
              distance={getDistance(station.latitude, station.longitude)}
              rating={station.rating || 0}
              openTime={formatTime(station.open_time)}
              closeTime={formatTime(station.close_time)}
              availableSlots={getAvailableSlots()}
            />
          ))
        ) : (
          <div className="card flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <MapPin size={32} className="text-slate-400" />
            </div>
            <h3 className="font-medium mb-2">No stations found</h3>
            <p className="text-slate-500 text-sm">
              {searchQuery 
                ? `No stations matching "${searchQuery}"` 
                : "No stations available in your area"}
            </p>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Stations;

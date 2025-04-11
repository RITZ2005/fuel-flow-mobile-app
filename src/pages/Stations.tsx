
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import StationCard from '@/components/stations/StationCard';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Station = Database['public']['Tables']['stations']['Row'];

const Stations = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const { data, error } = await supabase
          .from('stations')
          .select('*');
        
        if (error) {
          console.error('Error fetching stations:', error);
        } else if (data) {
          setStations(data);
          setFilteredStations(data);
        }
      } catch (error) {
        console.error('Error in fetchStations:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStations();
  }, []);
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === '') {
      setFilteredStations(stations);
    } else {
      const filtered = stations.filter(
        station => 
          station.name.toLowerCase().includes(query) ||
          station.address.toLowerCase().includes(query) ||
          station.city.toLowerCase().includes(query)
      );
      setFilteredStations(filtered);
    }
  };
  
  return (
    <MobileLayout>
      <div className="pt-2 pb-6">
        {/* Search Bar */}
        <div className="relative mb-4">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search className="w-5 h-5 text-gray-400" />
          </div>
          <input
            type="search"
            placeholder="Search stations..."
            className="block w-full p-3 pl-10 text-sm border border-gray-300 rounded-md bg-white focus:ring-cng-primary focus:border-cng-primary"
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        
        {/* Filter Options */}
        <div className="flex justify-end items-center mb-4">
          <button className="btn-secondary flex items-center text-sm">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </button>
        </div>
        
        {/* Stations List */}
        {isLoading ? (
          <div className="text-center">Loading stations...</div>
        ) : filteredStations.length > 0 ? (
          filteredStations.map(station => (
            <StationCard
              key={station.id}
              id={station.id}
              name={station.name}
              address={station.address}
              city={station.city}
              rating={station.rating || 0}
              openTime={station.open_time}
              closeTime={station.close_time}
            />
          ))
        ) : (
          <div className="text-center">No stations found.</div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Stations;

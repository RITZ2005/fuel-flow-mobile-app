import React, { useEffect, useState } from 'react';
import { MapPin, Search, Star } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import AppLayout from '@/components/layout/AppLayout';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Tables } from '@/integrations/supabase/types';

type Station = Tables<'stations'>;

const StationCard = ({ 
  id, 
  name, 
  address, 
  location, 
  rating 
}: { 
  id: string; 
  name: string; 
  address: string; 
  location: string; 
  rating: number;
}) => {
  const navigate = useNavigate();
  
  return (
    <div 
      className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3 cursor-pointer hover:shadow-md transition-shadow"
      onClick={() => navigate(`/book-slot/${id}`)}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-medium text-gray-900">{name}</h3>
          <div className="flex items-center text-sm text-gray-500 mt-1">
            <MapPin size={14} className="mr-1" />
            <span>{address}</span>
          </div>
          <div className="text-xs text-gray-400 mt-1">{location}</div>
        </div>
        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded">
          <Star size={14} className="text-yellow-500 mr-1" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
      </div>
      <div className="mt-3 flex justify-between items-center">
        <div className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded">
          Open Now
        </div>
        <button 
          className="text-sm text-cng-primary font-medium"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/book-slot/${id}`);
          }}
        >
          Book Slot
        </button>
      </div>
    </div>
  );
};

const StationSkeleton = () => (
  <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 mb-3">
    <div className="flex justify-between items-start">
      <div className="w-full">
        <Skeleton className="h-5 w-3/4 mb-2" />
        <Skeleton className="h-4 w-full mb-1" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-6 w-12 rounded" />
    </div>
    <div className="mt-3 flex justify-between items-center">
      <Skeleton className="h-6 w-20 rounded" />
      <Skeleton className="h-6 w-24 rounded" />
    </div>
  </div>
);

const Stations = () => {
  const [stations, setStations] = useState<Station[]>([]);
  const [filteredStations, setFilteredStations] = useState<Station[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchStations = async () => {
      try {
        const { data, error } = await supabase
          .from('stations')
          .select('*')
          .order('name');
          
        if (error) {
          throw error;
        }
        
        setStations(data || []);
        setFilteredStations(data || []);
      } catch (error) {
        console.error('Error fetching stations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchStations();
  }, []);
  
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredStations(stations);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const filtered = stations.filter(station => 
      station.name.toLowerCase().includes(query) || 
      station.address.toLowerCase().includes(query) ||
      station.city.toLowerCase().includes(query) ||
      station.state.toLowerCase().includes(query)
    );
    
    setFilteredStations(filtered);
  }, [searchQuery, stations]);
  
  return (
    <AppLayout title="CNG Stations" showBackButton={false}>
      <div className="px-4 py-3">
        <div className="relative mb-4">
          <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
          <Input
            type="text"
            placeholder="Search stations by name or location"
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        {loading ? (
          <>
            <StationSkeleton />
            <StationSkeleton />
            <StationSkeleton />
          </>
        ) : filteredStations.length > 0 ? (
          filteredStations.map(station => (
            <StationCard
              key={station.id}
              id={station.id}
              name={station.name}
              address={station.address}
              location={`${station.city}, ${station.state}`}
              rating={station.rating || 0}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">No stations found matching your search.</p>
          </div>
        )}
      </div>
    </AppLayout>
  );
};

export default Stations;

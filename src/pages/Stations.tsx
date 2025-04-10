
import React, { useState } from 'react';
import { Search, MapPin, Filter } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import StationCard from '@/components/stations/StationCard';

const Stations = () => {
  const [searchQuery, setSearchQuery] = useState('');
  
  // Mock stations data
  const [stations] = useState([
    {
      id: '1',
      name: 'CNG Central Station',
      address: '123 Main St, City',
      distance: '2.5 km',
      rating: 4.7,
      openTime: '06:00 AM',
      closeTime: '10:00 PM',
      availableSlots: 5,
    },
    {
      id: '2',
      name: 'Green Fuel Station',
      address: '456 Park Ave, City',
      distance: '3.8 km',
      rating: 4.5,
      openTime: '07:00 AM',
      closeTime: '11:00 PM',
      availableSlots: 3,
    },
    {
      id: '3',
      name: 'EcoFill CNG Station',
      address: '789 Lake Rd, City',
      distance: '4.2 km',
      rating: 4.2,
      openTime: '05:30 AM',
      closeTime: '09:30 PM',
      availableSlots: 0,
    },
  ]);
  
  // Filter stations based on search query
  const filteredStations = stations.filter(station => 
    station.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    station.address.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
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
        
        {filteredStations.length > 0 ? (
          filteredStations.map(station => (
            <StationCard 
              key={station.id}
              id={station.id}
              name={station.name}
              address={station.address}
              distance={station.distance}
              rating={station.rating}
              openTime={station.openTime}
              closeTime={station.closeTime}
              availableSlots={station.availableSlots}
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

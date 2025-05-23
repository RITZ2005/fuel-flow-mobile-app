
import React from 'react';
import { MapPin, Star, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import StationMap from './StationMap';

interface StationCardProps {
  id: string;
  name: string;
  address: string;
  city?: string;          
  state?: string;
  distance?: string;      
  rating: number;
  openTime?: string;      
  closeTime?: string;     
  availableSlots?: number;
  location?: string;
  latitude?: number;
  longitude?: number;
}

const StationCard = ({
  id,
  name,
  address,
  city,
  state,
  distance = "1 km",
  rating,
  openTime = "08:00",
  closeTime = "20:00",
  availableSlots = 5,
  location,
  latitude,
  longitude
}: StationCardProps) => {
  const navigate = useNavigate();
  
  const displayLocation = location || (city && state ? `${city}, ${state}` : city || '');
  
  return (
    <div className="card mb-4 animate-slide-up">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center text-slate-500 text-sm mt-1">
            <MapPin size={14} className="mr-1" />
            <span>{address}</span>
          </div>
          {displayLocation && (
            <div className="text-xs text-slate-400 mt-1">{displayLocation}</div>
          )}
        </div>
        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
          <Star size={14} className="text-yellow-500 mr-1" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
      </div>
      
      {latitude && longitude && (
        <div className="mt-4">
          <StationMap latitude={latitude} longitude={longitude} />
        </div>
      )}
      
      <div className="flex items-center mt-3 text-sm text-slate-500">
        <Clock size={14} className="mr-1" />
        <span>{openTime} - {closeTime}</span>
        <span className="mx-2">•</span>
        <span>{distance} away</span>
      </div>
      
      <div className="flex justify-between items-center mt-4 pt-3 border-t border-slate-100">
        <div>
          <div className="text-sm font-medium">
            {availableSlots > 0 ? (
              <span className="text-cng-primary">{availableSlots} slots available</span>
            ) : (
              <span className="text-red-500">No slots available</span>
            )}
          </div>
        </div>
        
        <button 
          className="btn-primary text-sm py-2 flex items-center"
          onClick={() => navigate(`/book-slot/${id}`)}
          disabled={availableSlots <= 0}
        >
          Book Slot
          <ArrowRight size={16} className="ml-1" />
        </button>
      </div>
    </div>
  );
};

export default StationCard;

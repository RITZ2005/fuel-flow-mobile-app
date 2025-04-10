
import React from 'react';
import { MapPin, Star, Clock, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface StationCardProps {
  id: string;
  name: string;
  address: string;
  distance: string;
  rating: number;
  openTime: string;
  closeTime: string;
  availableSlots: number;
}

const StationCard = ({
  id,
  name,
  address,
  distance,
  rating,
  openTime,
  closeTime,
  availableSlots,
}: StationCardProps) => {
  const navigate = useNavigate();
  
  return (
    <div className="card mb-4 animate-slide-up">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="font-semibold text-lg">{name}</h3>
          <div className="flex items-center text-slate-500 text-sm mt-1">
            <MapPin size={14} className="mr-1" />
            <span>{address}</span>
          </div>
        </div>
        <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
          <Star size={14} className="text-yellow-500 mr-1" />
          <span className="text-sm font-medium">{rating.toFixed(1)}</span>
        </div>
      </div>
      
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

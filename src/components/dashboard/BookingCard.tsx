
import React from 'react';
import { CalendarClock, MapPin, Clock, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface BookingCardProps {
  id: string;
  stationName: string;
  stationAddress: string;
  date: string;
  time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
  onCancel?: (id: string) => void;
}

const BookingCard = ({ 
  id, 
  stationName, 
  stationAddress, 
  date, 
  time, 
  status,
  onCancel 
}: BookingCardProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const getStatusColor = () => {
    switch(status) {
      case 'upcoming': return 'bg-blue-100 text-blue-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-slate-100 text-slate-800';
    }
  };
  
  const handleCancel = () => {
    if (onCancel) {
      onCancel(id);
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been successfully cancelled",
      });
    }
  };

  return (
    <div className="card mb-4 animate-slide-up">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{stationName}</h3>
          <div className="flex items-center text-slate-500 text-sm mt-1">
            <MapPin size={14} className="mr-1" />
            <span>{stationAddress}</span>
          </div>
        </div>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </div>
      </div>
      
      <div className="flex items-center justify-between mt-4">
        <div className="flex items-center">
          <CalendarClock size={16} className="text-slate-500 mr-1.5" />
          <span className="text-slate-600 text-sm">{date}</span>
        </div>
        <div className="flex items-center">
          <Clock size={16} className="text-slate-500 mr-1.5" />
          <span className="text-slate-600 text-sm">{time}</span>
        </div>
      </div>
      
      {status === 'upcoming' && (
        <div className="flex justify-between mt-4 pt-3 border-t border-slate-100">
          <button 
            className="btn-outline text-sm py-2"
            onClick={() => navigate(`/booking-details/${id}`)}
          >
            View Details
          </button>
          <button 
            className="flex items-center text-sm text-red-500"
            onClick={handleCancel}
          >
            <X size={16} className="mr-1" />
            Cancel
          </button>
        </div>
      )}
    </div>
  );
};

export default BookingCard;

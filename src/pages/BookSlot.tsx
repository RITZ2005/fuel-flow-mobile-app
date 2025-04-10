
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Calendar, Clock, Check, Car } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import TimeSlotSelector from '@/components/booking/TimeSlotSelector';
import { useToast } from '@/hooks/use-toast';

const BookSlot = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock station data - in real app, fetch this based on stationId
  const [station] = useState({
    id: stationId || '1',
    name: 'CNG Central Station',
    address: '123 Main St, City',
    rating: 4.7,
    openTime: '06:00 AM',
    closeTime: '10:00 PM',
  });
  
  // Create state for booking form
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState('1');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Mock vehicles data
  const [vehicles] = useState([
    { id: '1', name: 'Honda Civic CNG', plate: 'ABC-123' },
    { id: '2', name: 'Toyota Corolla', plate: 'XYZ-789' },
  ]);
  
  // Create some mock time slots
  const [timeSlots] = useState(
    Array(8).fill(0).map((_, index) => {
      const hour = 8 + Math.floor(index / 2);
      const minute = (index % 2) * 30;
      const time = `${hour}:${minute === 0 ? '00' : minute} ${hour >= 12 ? 'PM' : 'AM'}`;
      
      return {
        id: `slot-${index + 1}`,
        time,
        available: Math.random() > 0.3 // Randomly make some slots unavailable
      };
    })
  );
  
  // Get possible dates (today and next 6 days)
  const dateOptions = Array(7).fill(0).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });
  
  const handleBookSlot = () => {
    if (!selectedSlot) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a time slot',
      });
      return;
    }
    
    setLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      toast({
        title: 'Booking Successful',
        description: 'Your slot has been booked successfully',
      });
      navigate('/bookings');
    }, 1500);
  };
  
  return (
    <MobileLayout hideNavBar>
      <div className="pb-6">
        <div className="flex items-center mb-6">
          <button 
            className="mr-3 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-sm"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={18} />
          </button>
          <h1 className="text-xl font-semibold">Book a Slot</h1>
        </div>
        
        <div className="card mb-6">
          <h2 className="font-semibold text-lg mb-2">{station.name}</h2>
          <div className="flex items-center text-sm text-slate-500 mb-2">
            <MapPin size={14} className="mr-1" />
            <span>{station.address}</span>
          </div>
          <div className="flex items-center text-sm">
            <div className="flex items-center bg-yellow-50 px-2 py-1 rounded-full">
              <Star size={14} className="text-yellow-500 mr-1" />
              <span className="font-medium">{station.rating.toFixed(1)}</span>
            </div>
            <div className="flex items-center ml-3">
              <Clock size={14} className="text-slate-500 mr-1" />
              <span className="text-slate-500">{station.openTime} - {station.closeTime}</span>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-medium mb-3">Select Date</h3>
          <div className="flex overflow-x-auto pb-2 -mx-1">
            {dateOptions.map((date, index) => {
              const isSelected = date.toDateString() === selectedDate.toDateString();
              const isToday = date.toDateString() === new Date().toDateString();
              
              return (
                <button
                  key={index}
                  className={`flex flex-col items-center justify-center p-2 min-w-[4rem] mx-1 rounded-lg transition-colors ${
                    isSelected 
                      ? 'bg-cng-primary text-white' 
                      : 'bg-white border border-slate-200'
                  }`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="text-xs font-medium mb-1">
                    {date.toLocaleDateString('en-US', { weekday: 'short' })}
                  </span>
                  <span className="text-lg font-semibold">
                    {date.getDate()}
                  </span>
                  {isToday && (
                    <span className={`text-xs ${isSelected ? 'text-white' : 'text-cng-primary'}`}>
                      Today
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
        
        <TimeSlotSelector 
          date={selectedDate}
          slots={timeSlots}
          selectedSlot={selectedSlot}
          onSelectSlot={setSelectedSlot}
        />
        
        <div className="mb-6">
          <h3 className="font-medium mb-3">Select Vehicle</h3>
          <div className="space-y-2">
            {vehicles.map(vehicle => (
              <button
                key={vehicle.id}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  selectedVehicle === vehicle.id 
                    ? 'border-cng-primary bg-cng-light' 
                    : 'border-slate-200 bg-white'
                }`}
                onClick={() => setSelectedVehicle(vehicle.id)}
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                    <Car size={20} className="text-slate-500" />
                  </div>
                  <div className="text-left">
                    <div className="font-medium">{vehicle.name}</div>
                    <div className="text-sm text-slate-500">{vehicle.plate}</div>
                  </div>
                </div>
                
                {selectedVehicle === vehicle.id && (
                  <div className="w-6 h-6 rounded-full bg-cng-primary flex items-center justify-center">
                    <Check size={14} className="text-white" />
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>
        
        <button 
          className="btn-primary w-full flex justify-center items-center"
          onClick={handleBookSlot}
          disabled={!selectedSlot || loading}
        >
          {loading ? (
            <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : null}
          Confirm Booking
        </button>
      </div>
    </MobileLayout>
  );
};

export default BookSlot;


import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Calendar, Clock, Check, Car } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import TimeSlotSelector from '@/components/booking/TimeSlotSelector';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const BookSlot = () => {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Station data state
  const [station, setStation] = useState({
    id: stationId || '',
    name: '',
    address: '',
    rating: 0,
    openTime: '',
    closeTime: '',
  });
  
  // Create state for booking form
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedVehicle, setSelectedVehicle] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  
  // State for vehicles and time slots
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [timeSlots, setTimeSlots] = useState<any[]>([]);
  
  // Fetch station details
  useEffect(() => {
    if (stationId) {
      const fetchStation = async () => {
        const { data, error } = await supabase
          .from('stations')
          .select('*')
          .eq('id', stationId)
          .single();
        
        if (data && !error) {
          setStation({
            id: data.id,
            name: data.name,
            address: data.address,
            rating: data.rating || 4,
            openTime: data.opening_time,
            closeTime: data.closing_time
          });
        }
      };
      
      fetchStation();
    }
  }, [stationId]);
  
  // Fetch user vehicles
  useEffect(() => {
    const fetchVehicles = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData.session?.user?.id) return;
      
      const { data } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', sessionData.session?.user?.id);
      
      if (data) {
        setVehicles(data);
        if (data.length > 0) setSelectedVehicle(data[0].id);
      }
    };
    
    fetchVehicles();
  }, []);
  
  // Generate time slots
  useEffect(() => {
    // Format date to YYYY-MM-DD for API
    const formattedDate = selectedDate.toISOString().split('T')[0];
    
    // Generate mock time slots - in a real app, fetch this from the server
    const generateTimeSlots = () => {
      return Array(8).fill(0).map((_, index) => {
        const hour = 8 + Math.floor(index / 2);
        const minute = (index % 2) * 30;
        const time = `${hour}:${minute === 0 ? '00' : minute}`;
        const displayTime = `${hour > 12 ? hour - 12 : hour}:${minute === 0 ? '00' : minute} ${hour >= 12 ? 'PM' : 'AM'}`;
        
        return {
          id: `slot-${index + 1}-${formattedDate}`,
          time: displayTime,
          actual_time: time,
          available: Math.random() > 0.3 // Randomly make some slots unavailable
        };
      });
    };
    
    setTimeSlots(generateTimeSlots());
    setSelectedSlot(null); // Reset selection when date changes
  }, [selectedDate]);
  
  // Get possible dates (today and next 6 days)
  const dateOptions = Array(7).fill(0).map((_, index) => {
    const date = new Date();
    date.setDate(date.getDate() + index);
    return date;
  });
  
  const handleBookSlot = async () => {
    if (!selectedSlot) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a time slot',
      });
      return;
    }
    
    if (!selectedVehicle) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a vehicle',
      });
      return;
    }
    
    setLoading(true);
    
    try {
      // Get current user
      const { data: authData } = await supabase.auth.getUser();
      if (!authData.user) throw new Error('You must be logged in to book a slot');
      
      // Format date for database
      const formattedDate = selectedDate.toISOString().split('T')[0];
      
      // Create a time slot record
      const { data: slotData, error: slotError } = await supabase
        .from('time_slots')
        .insert({
          station_id: stationId,
          date: formattedDate,
          time: timeSlots.find(slot => slot.id === selectedSlot)?.actual_time || '08:00'
        })
        .select()
        .single();
      
      if (slotError) throw slotError;
      
      // Create booking record
      const { error: bookingError } = await supabase
        .from('bookings')
        .insert({
          user_id: authData.user.id,
          station_id: stationId,
          vehicle_id: selectedVehicle,
          time_slot_id: slotData.id,
          booking_date: formattedDate,
          booking_time: timeSlots.find(slot => slot.id === selectedSlot)?.actual_time || '08:00',
          status: 'upcoming'
        });
      
      if (bookingError) throw bookingError;
      
      toast({
        title: 'Booking Successful',
        description: 'Your slot has been booked successfully',
      });
      
      navigate('/bookings');
    } catch (error: any) {
      console.error('Booking error:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to book slot',
      });
    } finally {
      setLoading(false);
    }
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
          {vehicles.length > 0 ? (
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
                      <div className="font-medium">{vehicle.name || `${vehicle.make} ${vehicle.model}`}</div>
                      <div className="text-sm text-slate-500">{vehicle.reg_number || vehicle.license_plate}</div>
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
          ) : (
            <div className="text-center py-4 border border-dashed rounded-lg">
              <p className="text-slate-500">No vehicles found. Please add a vehicle first.</p>
              <button 
                className="mt-2 text-cng-primary font-medium"
                onClick={() => navigate('/add-vehicle')}
              >
                Add Vehicle
              </button>
            </div>
          )}
        </div>
        
        <button 
          className="btn-primary w-full flex justify-center items-center"
          onClick={handleBookSlot}
          disabled={!selectedSlot || !selectedVehicle || loading}
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

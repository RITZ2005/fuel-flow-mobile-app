
import React, { useState, useEffect } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import BookingCard from '@/components/dashboard/BookingCard';
import { CalendarClock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: string;
  station_id: string;
  station_name?: string;
  station_address?: string;
  booking_date: string;
  booking_time: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

const Bookings = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: authData } = await supabase.auth.getUser();
        if (!authData?.user?.id) return;
        
        // Get bookings
        const { data, error } = await supabase
          .from('bookings')
          .select(`
            id, 
            booking_date, 
            booking_time, 
            status,
            station_id,
            stations (
              name, 
              address
            )
          `)
          .eq('user_id', authData.user.id)
          .order('booking_date', { ascending: false });
        
        if (error) throw error;
        
        // Format bookings data
        const formattedBookings = data.map((booking: any) => ({
          id: booking.id,
          station_id: booking.station_id,
          station_name: booking.stations?.name || 'Unknown Station',
          station_address: booking.stations?.address || '',
          booking_date: formatDate(booking.booking_date),
          booking_time: formatTime(booking.booking_time),
          status: booking.status
        }));
        
        setBookings(formattedBookings);
      } catch (error: any) {
        console.error("Error fetching bookings:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load bookings"
        });
      } finally {
        setLoading(false);
      }
    };
    
    fetchBookings();
  }, [toast]);
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };
  
  const formatTime = (timeString: string) => {
    // Convert 24h time to 12h format
    if (!timeString) return '';
    
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    
    return `${formattedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
  };
  
  const cancelBooking = async (id: string) => {
    try {
      const { error } = await supabase
        .from('bookings')
        .update({ status: 'cancelled' })
        .eq('id', id);
      
      if (error) throw error;
      
      setBookings(bookings.map(booking => 
        booking.id === id 
          ? { ...booking, status: 'cancelled' as const } 
          : booking
      ));
      
      toast({
        title: "Booking Cancelled",
        description: "Your booking has been cancelled successfully"
      });
    } catch (error: any) {
      console.error("Error cancelling booking:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel booking"
      });
    }
  };
  
  // Filter bookings by status
  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming');
  const pastBookings = bookings.filter(booking => booking.status === 'completed' || booking.status === 'cancelled');
  
  if (loading) {
    return (
      <MobileLayout title="My Bookings">
        <div className="pt-2 pb-6 flex justify-center items-center h-[60vh]">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cng-primary"></div>
        </div>
      </MobileLayout>
    );
  }
  
  return (
    <MobileLayout title="My Bookings">
      <div className="pt-2 pb-6">
        <h2 className="font-semibold mb-4">Upcoming Bookings</h2>
        
        {upcomingBookings.length > 0 ? (
          upcomingBookings.map(booking => (
            <BookingCard 
              key={booking.id}
              id={booking.id}
              stationName={booking.station_name || ''}
              stationAddress={booking.station_address || ''}
              date={booking.booking_date}
              time={booking.booking_time}
              status={booking.status}
              onCancel={cancelBooking}
            />
          ))
        ) : (
          <div className="card flex flex-col items-center justify-center py-6 text-center mb-6">
            <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center mb-3">
              <CalendarClock size={28} className="text-slate-400" />
            </div>
            <h3 className="font-medium mb-1">No upcoming bookings</h3>
            <p className="text-slate-500 text-sm">You don't have any upcoming bookings.</p>
          </div>
        )}
        
        {pastBookings.length > 0 && (
          <>
            <h2 className="font-semibold mb-4 mt-6">Past Bookings</h2>
            {pastBookings.map(booking => (
              <BookingCard 
                key={booking.id}
                id={booking.id}
                stationName={booking.station_name || ''}
                stationAddress={booking.station_address || ''}
                date={booking.booking_date}
                time={booking.booking_time}
                status={booking.status}
              />
            ))}
          </>
        )}
      </div>
    </MobileLayout>
  );
};

export default Bookings;

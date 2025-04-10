
import React, { useState } from 'react';
import MobileLayout from '@/components/layout/MobileLayout';
import BookingCard from '@/components/dashboard/BookingCard';
import { CalendarClock } from 'lucide-react';

const Bookings = () => {
  // Mock bookings data
  const [bookings, setBookings] = useState([
    {
      id: '1',
      stationName: 'CNG Central Station',
      stationAddress: '123 Main St, City',
      date: 'Apr 12, 2025',
      time: '10:30 AM',
      status: 'upcoming' as const,
    },
    {
      id: '2',
      stationName: 'Green Fuel Station',
      stationAddress: '456 Park Ave, City',
      date: 'Apr 10, 2025',
      time: '2:15 PM',
      status: 'completed' as const,
    },
    {
      id: '3',
      stationName: 'EcoFill CNG Station',
      stationAddress: '789 Lake Rd, City',
      date: 'Apr 8, 2025',
      time: '11:45 AM',
      status: 'cancelled' as const,
    },
  ]);
  
  const cancelBooking = (id: string) => {
    setBookings(bookings.map(booking => 
      booking.id === id 
        ? { ...booking, status: 'cancelled' as const } 
        : booking
    ));
  };
  
  // Filter bookings by status
  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming');
  const pastBookings = bookings.filter(booking => booking.status === 'completed' || booking.status === 'cancelled');
  
  return (
    <MobileLayout title="My Bookings">
      <div className="pt-2 pb-6">
        <h2 className="font-semibold mb-4">Upcoming Bookings</h2>
        
        {upcomingBookings.length > 0 ? (
          upcomingBookings.map(booking => (
            <BookingCard 
              key={booking.id}
              id={booking.id}
              stationName={booking.stationName}
              stationAddress={booking.stationAddress}
              date={booking.date}
              time={booking.time}
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
                stationName={booking.stationName}
                stationAddress={booking.stationAddress}
                date={booking.date}
                time={booking.time}
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

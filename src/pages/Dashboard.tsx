
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Fuel, Calendar, Car, Bell, Plus } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import BookingCard from '@/components/dashboard/BookingCard';

const Dashboard = () => {
  const navigate = useNavigate();
  // Mock user and bookings data
  const [userData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
  });
  
  // Update booking type to include 'cancelled' status
  type BookingStatus = 'upcoming' | 'completed' | 'cancelled';
  
  type Booking = {
    id: string;
    stationName: string;
    stationAddress: string;
    date: string;
    time: string;
    status: BookingStatus;
  };
  
  const [bookings, setBookings] = useState<Booking[]>([
    {
      id: '1',
      stationName: 'CNG Central Station',
      stationAddress: '123 Main St, City',
      date: 'Apr 12, 2025',
      time: '10:30 AM',
      status: 'upcoming',
    },
    {
      id: '2',
      stationName: 'Green Fuel Station',
      stationAddress: '456 Park Ave, City',
      date: 'Apr 10, 2025',
      time: '2:15 PM',
      status: 'completed',
    }
  ]);
  
  const cancelBooking = (id: string) => {
    setBookings(bookings.map(booking => 
      booking.id === id 
        ? { ...booking, status: 'cancelled' } 
        : booking
    ));
  };
  
  // Filter upcoming bookings
  const upcomingBookings = bookings.filter(booking => booking.status === 'upcoming');
  
  return (
    <MobileLayout>
      <div className="pt-2 pb-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">Hello, {userData.name.split(' ')[0]}</h1>
            <p className="text-slate-500">Welcome back!</p>
          </div>
          <button className="w-10 h-10 rounded-full bg-white shadow flex items-center justify-center relative">
            <Bell size={20} />
            <span className="absolute top-0 right-0 w-3 h-3 bg-cng-accent rounded-full border-2 border-white"></span>
          </button>
        </div>
        
        {/* Quick Action Buttons */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <button 
            className="flex flex-col items-center justify-center bg-white rounded-xl py-4 shadow-sm border border-slate-100"
            onClick={() => navigate('/stations')}
          >
            <div className="w-12 h-12 rounded-full bg-cng-light flex items-center justify-center mb-2">
              <Fuel size={24} className="text-cng-primary" />
            </div>
            <span className="text-sm font-medium">Find Station</span>
          </button>
          
          <button 
            className="flex flex-col items-center justify-center bg-white rounded-xl py-4 shadow-sm border border-slate-100"
            onClick={() => navigate('/bookings')}
          >
            <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center mb-2">
              <Calendar size={24} className="text-cng-secondary" />
            </div>
            <span className="text-sm font-medium">My Bookings</span>
          </button>
          
          <button 
            className="flex flex-col items-center justify-center bg-white rounded-xl py-4 shadow-sm border border-slate-100"
            onClick={() => navigate('/vehicles')}
          >
            <div className="w-12 h-12 rounded-full bg-orange-50 flex items-center justify-center mb-2">
              <Car size={24} className="text-cng-accent" />
            </div>
            <span className="text-sm font-medium">My Vehicles</span>
          </button>
        </div>
        
        {/* Upcoming Bookings Section */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Upcoming Bookings</h2>
            <button 
              className="text-cng-secondary text-sm font-medium"
              onClick={() => navigate('/bookings')}
            >
              View all
            </button>
          </div>
          
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
            <div className="card flex flex-col items-center justify-center py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
                <Calendar size={32} className="text-slate-400" />
              </div>
              <h3 className="font-medium mb-2">No upcoming bookings</h3>
              <p className="text-slate-500 text-sm mb-4">Book a slot at your favorite CNG station</p>
              <button 
                className="btn-primary flex items-center text-sm"
                onClick={() => navigate('/stations')}
              >
                <Plus size={16} className="mr-1" />
                Book New Slot
              </button>
            </div>
          )}
        </div>
        
        {/* Emergency Assistance */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 rounded-xl p-4 text-white">
          <h3 className="font-semibold mb-2">Emergency Assistance</h3>
          <p className="text-sm mb-3 opacity-90">Need urgent refueling? Request emergency assistance</p>
          <button className="bg-white text-red-500 font-medium rounded-lg px-4 py-2 text-sm">
            Request Now
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default Dashboard;

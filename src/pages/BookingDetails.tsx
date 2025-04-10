
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MapPin, Star, Calendar, Clock, Car, CreditCard, Phone } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { useToast } from '@/hooks/use-toast';

const BookingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock booking data - in a real app, you would fetch this based on id
  const [booking] = useState({
    id: id || '1',
    stationName: 'CNG Central Station',
    stationAddress: '123 Main St, City',
    date: 'Apr 12, 2025',
    time: '10:30 AM',
    status: 'upcoming' as const,
    vehicle: 'Honda Civic CNG (ABC-123)',
    price: '$25.00',
    bookingCode: 'BK-12345',
    qrCode: null, // In a real app, this would be an actual QR code image
    phoneNumber: '+1 234 567 8900'
  });
  
  const handleCancel = () => {
    // Simulate API call
    setTimeout(() => {
      toast({
        title: 'Booking Cancelled',
        description: 'Your booking has been successfully cancelled',
      });
      navigate('/bookings');
    }, 1000);
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
          <h1 className="text-xl font-semibold">Booking Details</h1>
        </div>
        
        <div className="card mb-6">
          <div className={`px-2 py-1 rounded-full text-xs font-medium inline-block mb-3 bg-blue-100 text-blue-800`}>
            Upcoming
          </div>
          
          <h2 className="font-semibold text-lg mb-2">{booking.stationName}</h2>
          <div className="flex items-center text-sm text-slate-500 mb-4">
            <MapPin size={14} className="mr-1" />
            <span>{booking.stationAddress}</span>
          </div>
          
          <div className="flex justify-between items-center border-t border-slate-100 pt-3">
            <div className="flex items-center">
              <Calendar size={16} className="text-slate-500 mr-1.5" />
              <span className="text-slate-600 text-sm">{booking.date}</span>
            </div>
            <div className="flex items-center">
              <Clock size={16} className="text-slate-500 mr-1.5" />
              <span className="text-slate-600 text-sm">{booking.time}</span>
            </div>
          </div>
        </div>
        
        <div className="card mb-6">
          <h3 className="font-medium mb-3">Booking Information</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <Car size={16} className="text-slate-500 mr-2" />
                <span className="text-slate-600">Vehicle</span>
              </div>
              <span className="text-sm font-medium">{booking.vehicle}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <CreditCard size={16} className="text-slate-500 mr-2" />
                <span className="text-slate-600">Price</span>
              </div>
              <span className="text-sm font-medium">{booking.price}</span>
            </div>
            
            <div className="flex justify-between items-center">
              <div className="flex items-center text-sm">
                <div className="w-4 h-4 text-slate-500 mr-2 flex items-center justify-center">
                  #
                </div>
                <span className="text-slate-600">Booking Code</span>
              </div>
              <span className="text-sm font-medium">{booking.bookingCode}</span>
            </div>
          </div>
        </div>
        
        <div className="card mb-6 flex flex-col items-center justify-center py-6">
          <h3 className="font-medium mb-4">Scan at Station</h3>
          
          {booking.qrCode ? (
            <img src={booking.qrCode} alt="QR Code" className="w-48 h-48 mb-3" />
          ) : (
            <div className="w-48 h-48 bg-slate-100 flex items-center justify-center mb-3 rounded-lg">
              <span className="text-slate-400">QR Code</span>
            </div>
          )}
          
          <p className="text-sm text-slate-500">
            Present this code when you arrive at the station
          </p>
        </div>
        
        <div className="space-y-3">
          <button 
            className="btn-primary w-full flex justify-center items-center"
            onClick={() => {
              window.location.href = `tel:${booking.phoneNumber.replace(/\s/g, '')}`;
            }}
          >
            <Phone size={16} className="mr-1.5" />
            Call Station
          </button>
          
          <button 
            className="btn-outline w-full flex justify-center items-center text-red-500"
            onClick={handleCancel}
          >
            Cancel Booking
          </button>
        </div>
      </div>
    </MobileLayout>
  );
};

export default BookingDetails;

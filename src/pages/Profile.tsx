
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Car, Bookmark, CreditCard, Settings, ArrowRightFromLine, Plus } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import ProfileItem from '@/components/profile/ProfileItem';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock user data
  const [userData] = useState({
    name: 'John Doe',
    email: 'john.doe@example.com',
    profileImage: null,
  });
  
  const handleLogout = () => {
    // Simulate logout
    toast({
      title: "Logged out",
      description: "You have been successfully logged out",
    });
    
    setTimeout(() => {
      navigate('/login');
    }, 1000);
  };
  
  return (
    <MobileLayout title="My Profile">
      <div className="pt-2 pb-6">
        <div className="card flex items-center mb-6">
          <div className="mr-4 relative">
            {userData.profileImage ? (
              <img 
                src={userData.profileImage} 
                alt={userData.name} 
                className="w-16 h-16 rounded-full object-cover"
              />
            ) : (
              <div className="w-16 h-16 rounded-full bg-cng-light flex items-center justify-center">
                <User size={32} className="text-cng-primary" />
              </div>
            )}
            <button className="absolute bottom-0 right-0 w-6 h-6 rounded-full bg-cng-primary text-white flex items-center justify-center border-2 border-white">
              <Plus size={14} />
            </button>
          </div>
          
          <div>
            <h2 className="font-semibold text-lg">{userData.name}</h2>
            <p className="text-slate-500">{userData.email}</p>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden mb-6">
          <ProfileItem
            icon={<User size={20} />}
            title="Personal Information"
            description="Update your name, email, and password"
            onClick={() => navigate('/profile/personal-info')}
          />
          <ProfileItem
            icon={<Car size={20} />}
            title="My Vehicles"
            description="Manage your vehicle information"
            onClick={() => navigate('/vehicles')}
          />
          <ProfileItem
            icon={<Bookmark size={20} />}
            title="Booking History"
            description="View all your past bookings"
            onClick={() => navigate('/bookings')}
          />
          <ProfileItem
            icon={<CreditCard size={20} />}
            title="Payment Methods"
            description="Manage your payment options"
            onClick={() => navigate('/profile/payment')}
          />
          <ProfileItem
            icon={<Settings size={20} />}
            title="App Settings"
            description="Notifications, theme, and language"
            onClick={() => navigate('/profile/settings')}
            showChevron={true}
          />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <ProfileItem
            icon={<ArrowRightFromLine size={20} />}
            title="Logout"
            onClick={handleLogout}
          />
        </div>
      </div>
    </MobileLayout>
  );
};

export default Profile;

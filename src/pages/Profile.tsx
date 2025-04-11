
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Mail, Car, Bookmark, CreditCard, Settings, ArrowRightFromLine, Plus, Phone } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import ProfileItem from '@/components/profile/ProfileItem';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type ProfileData = {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
};

const Profile = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, signOut } = useAuth();
  
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load profile data",
          });
        } else {
          setProfileData(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user, toast]);
  
  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged out",
        description: "You have been successfully logged out",
      });
    } catch (error) {
      console.error('Logout error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to log out",
      });
    }
  };
  
  return (
    <MobileLayout title="My Profile">
      <div className="pt-2 pb-6">
        <div className="card flex items-center mb-6">
          <div className="mr-4 relative">
            {profileData?.avatar_url ? (
              <img 
                src={profileData.avatar_url} 
                alt={profileData.full_name || 'User'} 
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
            <h2 className="font-semibold text-lg">
              {loading ? 'Loading...' : profileData?.full_name || user?.email}
            </h2>
            <p className="text-slate-500">{user?.email}</p>
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
            icon={<Phone size={20} />}
            title="Contact Information"
            description="Update your phone number"
            onClick={() => navigate('/profile/contact-info')}
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

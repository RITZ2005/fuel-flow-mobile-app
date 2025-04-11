
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, User, LogOut, ChevronRight } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import ProfileItem from '@/components/profile/ProfileItem';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type Profile = {
  id: string;
  full_name?: string;
  email?: string;
};

const Profile = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      
      try {
        // Fetching user profile data - simplified to avoid deep type recursion
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        if (error) {
          console.error('Error fetching profile:', error);
        } 
        
        // Set profile using user data instead of potentially problematic query
        setProfile({
          id: user.id,
          full_name: user.user_metadata?.full_name,
          email: user.email,
        });
      } catch (error) {
        console.error('Error in fetchProfile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);
  
  const handleSignOut = async () => {
    try {
      await signOut();
      // Navigation is handled in the AuthContext
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  return (
    <MobileLayout>
      <div className="pt-2 pb-6">
        <h1 className="text-2xl font-bold mb-6">Profile</h1>
        
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-cng-primary"></div>
          </div>
        ) : (
          <>
            {/* Profile Header */}
            <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
              <div className="flex items-center">
                <div className="w-16 h-16 rounded-full bg-cng-primary text-white flex items-center justify-center text-xl font-bold mr-4">
                  {profile?.full_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
                </div>
                <div>
                  <h2 className="font-semibold text-lg">{profile?.full_name || 'User'}</h2>
                  <p className="text-slate-500 flex items-center">
                    <Mail size={14} className="mr-1" />
                    {profile?.email || user?.email || 'No email'}
                  </p>
                </div>
              </div>
              <button 
                className="mt-4 w-full py-2 border border-cng-primary text-cng-primary rounded-lg font-medium"
                onClick={() => navigate('/edit-profile')}
              >
                Edit Profile
              </button>
            </div>
            
            {/* Account Settings */}
            <div className="bg-white rounded-xl overflow-hidden mb-6 shadow-sm">
              <h3 className="font-medium px-4 py-3 border-b">Account Settings</h3>
              
              <ProfileItem 
                icon={<User size={18} />} 
                title="Personal Information" 
                onClick={() => navigate('/personal-info')}
              />
              
              <ProfileItem 
                icon={<Mail size={18} />} 
                title="Email Notifications" 
                onClick={() => navigate('/notifications')}
              />
            </div>
            
            {/* App Settings */}
            <div className="bg-white rounded-xl overflow-hidden mb-6 shadow-sm">
              <h3 className="font-medium px-4 py-3 border-b">App Settings</h3>
              
              <div className="px-4 py-3 flex items-center justify-between border-b">
                <div className="flex items-center">
                  <span className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                    <ChevronRight size={18} />
                  </span>
                  <span>Dark Mode</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cng-primary"></div>
                </label>
              </div>
              
              <ProfileItem 
                icon={<ChevronRight size={18} />} 
                title="Language" 
                description="English"
                onClick={() => navigate('/language')}
              />
            </div>
            
            {/* Help & Support */}
            <div className="bg-white rounded-xl overflow-hidden mb-6 shadow-sm">
              <h3 className="font-medium px-4 py-3 border-b">Help & Support</h3>
              
              <ProfileItem 
                icon={<ChevronRight size={18} />} 
                title="Help Center" 
                onClick={() => navigate('/help')}
              />
              
              <ProfileItem 
                icon={<ChevronRight size={18} />} 
                title="Contact Support" 
                onClick={() => navigate('/support')}
              />
              
              <ProfileItem 
                icon={<ChevronRight size={18} />} 
                title="Terms of Service" 
                onClick={() => navigate('/terms')}
              />
              
              <ProfileItem 
                icon={<ChevronRight size={18} />} 
                title="Privacy Policy" 
                onClick={() => navigate('/privacy')}
              />
            </div>
            
            {/* Sign Out Button */}
            <button 
              className="w-full py-3 bg-red-50 text-red-600 rounded-xl font-medium flex items-center justify-center"
              onClick={handleSignOut}
            >
              <LogOut size={18} className="mr-2" />
              Sign Out
            </button>
          </>
        )}
      </div>
    </MobileLayout>
  );
};

export default Profile;

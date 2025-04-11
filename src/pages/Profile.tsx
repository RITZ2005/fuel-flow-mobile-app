import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Settings, CreditCard, HelpCircle, ShieldAlert } from 'lucide-react';
import ProfileItem from '@/components/profile/ProfileItem';

const Profile = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="container py-12">
        <h1 className="text-3xl font-bold mb-6">Profile</h1>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <ProfileItem
            icon={<User size={20} />}
            title="Account"
            description="Manage your account settings"
            onClick={() => navigate('/account')}
          />
          <ProfileItem
            icon={<Settings size={20} />}
            title="Preferences"
            description="Update your preferences"
            onClick={() => navigate('/preferences')}
          />
          <ProfileItem
            icon={<CreditCard size={20} />}
            title="Payment Methods"
            description="Manage your payment methods"
            onClick={() => navigate('/payment-methods')}
          />
          <ProfileItem
            icon={<HelpCircle size={20} />}
            title="Help & Support"
            description="Get help with our services"
            onClick={() => navigate('/help')}
          />
          <ProfileItem
            icon={<ShieldAlert size={20} />}
            title="Privacy & Security"
            description="Manage your privacy settings"
            onClick={() => navigate('/privacy')}
          />
        </div>
      </div>
    </div>
  );
};

export default Profile;

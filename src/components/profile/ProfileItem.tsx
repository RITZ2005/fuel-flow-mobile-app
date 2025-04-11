
import React from 'react';
import { ChevronRight } from 'lucide-react';

interface ProfileItemProps {
  icon: React.ReactNode;
  title: string;
  description?: string;
  subtitle?: string;
  onClick?: () => void;
  showChevron?: boolean;
}

const ProfileItem = ({
  icon,
  title,
  description,
  subtitle,
  onClick,
  showChevron = true
}: ProfileItemProps) => {
  // Use description or subtitle, prioritizing description if both are provided
  const secondaryText = description || subtitle;
  
  return (
    <button
      className={`w-full flex items-center p-4 border-b border-slate-100 ${onClick ? 'cursor-pointer hover:bg-slate-50' : 'cursor-default'}`}
      onClick={onClick}
      disabled={!onClick}
    >
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 mr-3">
        {icon}
      </div>
      
      <div className="flex-1 text-left">
        <div className="font-medium">{title}</div>
        {secondaryText && <div className="text-sm text-slate-500">{secondaryText}</div>}
      </div>
      
      {showChevron && onClick && <ChevronRight size={18} className="text-slate-400" />}
    </button>
  );
};

export default ProfileItem;

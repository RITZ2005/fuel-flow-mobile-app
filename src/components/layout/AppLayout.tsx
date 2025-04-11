
import React from 'react';
import MobileLayout from './MobileLayout';

interface AppLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBackButton?: boolean;
  hideNavBar?: boolean;
}

const AppLayout = ({ 
  children, 
  title, 
  showBackButton = true,
  hideNavBar = false 
}: AppLayoutProps) => {
  return (
    <MobileLayout 
      title={title}
      hideNavBar={hideNavBar}
    >
      {children}
    </MobileLayout>
  );
};

export default AppLayout;


import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import MobileLayout from '@/components/layout/MobileLayout';

const ResetPassword = () => {
  return (
    <MobileLayout hideNavBar>
      <div className="flex flex-col justify-center min-h-full">
        <AuthForm type="reset" />
      </div>
    </MobileLayout>
  );
};

export default ResetPassword;


import React from 'react';
import AuthForm from '@/components/auth/AuthForm';
import MobileLayout from '@/components/layout/MobileLayout';

const Login = () => {
  return (
    <MobileLayout hideNavBar>
      <div className="flex flex-col justify-center min-h-full">
        <div className="mb-8 text-center">
          <div className="w-24 h-24 rounded-full bg-cng-light flex items-center justify-center mx-auto mb-4">
            <svg className="w-14 h-14 text-cng-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-800">CNG Gas</h1>
          <p className="text-slate-500">Booking & Management System</p>
        </div>
        
        <AuthForm type="login" />
      </div>
    </MobileLayout>
  );
};

export default Login;


import React, { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

interface AuthFormProps {
  type: 'login' | 'signup' | 'reset-password';
}

const AuthForm = ({ type }: AuthFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // This is a placeholder for actual Supabase authentication
    // In a real implementation, this would connect to Supabase
    try {
      setTimeout(() => {
        if (type === 'login' || type === 'signup') {
          navigate('/dashboard');
          toast({
            title: type === 'login' ? 'Login successful' : 'Account created successfully',
            description: "Welcome to CNG Gas Booking System",
          });
        } else if (type === 'reset-password') {
          toast({
            title: 'Reset link sent',
            description: "Please check your email for password reset instructions",
          });
        }
        setLoading(false);
      }, 1500);
    } catch (error) {
      setLoading(false);
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: "There was a problem with your request. Please try again.",
      });
    }
  };

  const getFormTitle = () => {
    switch(type) {
      case 'login': return 'Login to Your Account';
      case 'signup': return 'Create a New Account';
      case 'reset-password': return 'Reset Your Password';
      default: return '';
    }
  };

  return (
    <div className="w-full max-w-md p-6 animate-fade-in">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-bold">{getFormTitle()}</h1>
        <p className="text-slate-500 mt-2">
          {type === 'login' && "Welcome back! Enter your details to continue"}
          {type === 'signup' && "Fill in your information to create an account"}
          {type === 'reset-password' && "Enter your email to receive a reset link"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {type === 'signup' && (
          <div className="relative">
            <User className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type="text"
              placeholder="Full Name"
              className="form-input pl-10"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required={type === 'signup'}
            />
          </div>
        )}
        
        <div className="relative">
          <Mail className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
          <input
            type="email"
            placeholder="Email Address"
            className="form-input pl-10"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        
        {type !== 'reset-password' && (
          <div className="relative">
            <Lock className="absolute left-3 top-3.5 h-5 w-5 text-slate-400" />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="form-input pl-10 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={type === 'login' || type === 'signup'}
            />
            <button 
              type="button"
              className="absolute right-3 top-3.5 text-slate-400"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        )}
        
        {type === 'login' && (
          <div className="text-right">
            <button 
              type="button" 
              className="text-sm text-cng-secondary"
              onClick={() => navigate('/reset-password')}
            >
              Forgot password?
            </button>
          </div>
        )}
        
        <button 
          type="submit" 
          className="btn-primary w-full flex justify-center items-center"
          disabled={loading}
        >
          {loading ? (
            <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
          ) : null}
          {type === 'login' && 'Login'}
          {type === 'signup' && 'Sign Up'}
          {type === 'reset-password' && 'Send Reset Link'}
        </button>
      </form>
      
      <div className="mt-6 text-center">
        {type === 'login' && (
          <p className="text-slate-500">
            Don't have an account? {' '}
            <button 
              className="text-cng-secondary font-medium"
              onClick={() => navigate('/signup')}
            >
              Sign up
            </button>
          </p>
        )}
        
        {type === 'signup' && (
          <p className="text-slate-500">
            Already have an account? {' '}
            <button 
              className="text-cng-secondary font-medium"
              onClick={() => navigate('/login')}
            >
              Login
            </button>
          </p>
        )}
        
        {type === 'reset-password' && (
          <button 
            className="text-cng-secondary font-medium"
            onClick={() => navigate('/login')}
          >
            Back to login
          </button>
        )}
      </div>
    </div>
  );
};

export default AuthForm;

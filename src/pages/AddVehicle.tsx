
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

const AddVehicle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [name, setName] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [cngCapacity, setCngCapacity] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to add a vehicle",
      });
      return;
    }
    
    if (!name || !make || !model) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Please fill in all required fields",
      });
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { data, error } = await supabase
        .from('vehicles')
        .insert([
          {
            user_id: user.id,
            name,
            make,
            model,
            year: year ? parseInt(year) : null,
            license_plate: licensePlate || null,
            cng_capacity: cngCapacity ? parseFloat(cngCapacity) : null,
          }
        ])
        .select();
      
      if (error) {
        console.error('Error adding vehicle:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add vehicle",
        });
      } else {
        toast({
          title: "Vehicle Added",
          description: "Your vehicle has been successfully added",
        });
        navigate('/vehicles');
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
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
          <h1 className="text-xl font-semibold">Add New Vehicle</h1>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Vehicle Name*
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cng-primary focus:border-cng-primary"
              placeholder="E.g., My Honda Civic"
              required
            />
          </div>
          
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700 mb-1">
              Make*
            </label>
            <input
              type="text"
              id="make"
              value={make}
              onChange={(e) => setMake(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cng-primary focus:border-cng-primary"
              placeholder="E.g., Honda"
              required
            />
          </div>
          
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700 mb-1">
              Model*
            </label>
            <input
              type="text"
              id="model"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cng-primary focus:border-cng-primary"
              placeholder="E.g., Civic"
              required
            />
          </div>
          
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="number"
              id="year"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cng-primary focus:border-cng-primary"
              placeholder="E.g., 2022"
              min="1900"
              max={new Date().getFullYear()}
            />
          </div>
          
          <div>
            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700 mb-1">
              License Plate
            </label>
            <input
              type="text"
              id="licensePlate"
              value={licensePlate}
              onChange={(e) => setLicensePlate(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cng-primary focus:border-cng-primary"
              placeholder="E.g., ABC-123"
            />
          </div>
          
          <div>
            <label htmlFor="cngCapacity" className="block text-sm font-medium text-gray-700 mb-1">
              CNG Tank Capacity (kg)
            </label>
            <input
              type="number"
              id="cngCapacity"
              value={cngCapacity}
              onChange={(e) => setCngCapacity(e.target.value)}
              className="block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cng-primary focus:border-cng-primary"
              placeholder="E.g., 8.5"
              min="0"
              step="0.1"
            />
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-cng-primary hover:bg-cng-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cng-primary disabled:opacity-70"
            >
              {isLoading ? 'Adding...' : 'Add Vehicle'}
            </button>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
};

export default AddVehicle;

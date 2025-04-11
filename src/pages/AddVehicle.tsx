
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Car, Plus } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import type { Database } from '@/integrations/supabase/types';

const AddVehicle = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [name, setName] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | ''>('');
  const [licensePlate, setLicensePlate] = useState('');
  const [cngCapacity, setCngCapacity] = useState<number | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !make || !model) {
      toast({
        variant: "destructive",
        title: "Required Fields Missing",
        description: "Please fill in all required fields",
      });
      return;
    }
    
    if (!user) {
      toast({
        variant: "destructive",
        title: "Authentication Error",
        description: "You must be logged in to add a vehicle",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .insert([
          {
            user_id: user.id,
            name,
            make,
            model,
            year: year ? Number(year) : null,
            license_plate: licensePlate || null,
            cng_capacity: cngCapacity ? Number(cngCapacity) : null,
          },
        ]);
      
      if (error) throw error;
      
      toast({
        title: "Vehicle Added",
        description: "Your vehicle has been added successfully",
      });
      
      navigate('/vehicles');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error Adding Vehicle",
        description: error.message || "An unexpected error occurred",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to handle number input changes
  const handleNumberChange = (
    setter: React.Dispatch<React.SetStateAction<number | ''>>,
    value: string
  ) => {
    if (value === '') {
      setter('');
    } else if (!isNaN(Number(value))) {
      setter(Number(value));
    }
  };
  
  return (
    <MobileLayout>
      <div className="pt-2 pb-6">
        {/* Back Button */}
        <button 
          className="mb-4 flex items-center text-cng-secondary"
          onClick={() => navigate(-1)}
        >
          <ChevronLeft size={20} className="mr-1" />
          Back
        </button>
        
        <h1 className="text-2xl font-bold mb-6">Add New Vehicle</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Vehicle Name
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="name"
                className="form-input"
                placeholder="e.g., My Car"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Make */}
          <div>
            <label htmlFor="make" className="block text-sm font-medium text-gray-700">
              Make
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="make"
                className="form-input"
                placeholder="e.g., Toyota"
                value={make}
                onChange={(e) => setMake(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Model */}
          <div>
            <label htmlFor="model" className="block text-sm font-medium text-gray-700">
              Model
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="model"
                className="form-input"
                placeholder="e.g., Camry"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                required
              />
            </div>
          </div>
          
          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Year (Optional)
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="year"
                className="form-input"
                placeholder="e.g., 2020"
                value={year}
                onChange={(e) => handleNumberChange(setYear, e.target.value)}
              />
            </div>
          </div>
          
          {/* License Plate */}
          <div>
            <label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
              License Plate (Optional)
            </label>
            <div className="mt-1">
              <input
                type="text"
                id="licensePlate"
                className="form-input"
                placeholder="e.g., ABC-123"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
              />
            </div>
          </div>
          
          {/* CNG Capacity */}
          <div>
            <label htmlFor="cngCapacity" className="block text-sm font-medium text-gray-700">
              CNG Capacity (Optional)
            </label>
            <div className="mt-1">
              <input
                type="number"
                id="cngCapacity"
                className="form-input"
                placeholder="e.g., 14"
                value={cngCapacity}
                onChange={(e) => handleNumberChange(setCngCapacity, e.target.value)}
              />
            </div>
          </div>
          
          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn-primary w-full flex justify-center items-center"
            >
              {isSubmitting ? (
                <>
                  <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                  Adding Vehicle...
                </>
              ) : (
                <>
                  <Plus size={16} className="mr-2" />
                  Add Vehicle
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </MobileLayout>
  );
};

export default AddVehicle;

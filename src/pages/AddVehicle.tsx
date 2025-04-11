import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, AlertCircle, Fuel } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';

const AddVehicle = () => {
  const [name, setName] = useState('');
  const [make, setMake] = useState('');
  const [model, setModel] = useState('');
  const [year, setYear] = useState<number | string>('');
  const [licensePlate, setLicensePlate] = useState('');
  const [cngCapacity, setCngCapacity] = useState<number | string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const addVehicleMutation = useMutation({
    mutationFn: async () => {
      const { data: userData } = await supabase.auth.getUser();
      const userId = userData.user?.id;
      
      if (!userId) {
        throw new Error("User not authenticated");
      }
      
      const { data, error } = await supabase
        .from('vehicles')
        .insert([
          {
            user_id: userId,
            name: name,
            make: make,
            model: model,
            year: Number(year),
            license_plate: licensePlate,
            cng_capacity: Number(cngCapacity),
          },
        ]);
      
      if (error) {
        throw new Error(error.message);
      }
      
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vehicles'] });
      toast({
        title: "Vehicle Added",
        description: "Your vehicle has been added successfully.",
      });
      navigate('/vehicles');
    },
    onError: (error: any) => {
      setError(error.message || "An unexpected error occurred");
      toast({
        variant: "destructive",
        title: "Failed to Add Vehicle",
        description: error.message || "An unexpected error occurred",
      });
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    if (!name || !make || !model || !year || !cngCapacity) {
      setError("Please fill in all required fields");
      setIsLoading(false);
      return;
    }
    
    if (isNaN(Number(year)) || isNaN(Number(cngCapacity))) {
      setError("Year and CNG Capacity must be valid numbers");
      setIsLoading(false);
      return;
    }
    
    addVehicleMutation.mutate();
  };
  
  
  return (
    <div className="min-h-screen bg-slate-50 py-6 flex flex-col justify-center sm:py-12">
      <div className="relative py-3 sm:max-w-xl sm:mx-auto">
        <div className="absolute inset-0 bg-gradient-to-r from-cng-primary to-cng-secondary shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
        <div className="relative bg-white shadow-lg sm:rounded-3xl p-8">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-cng-primary text-white flex items-center justify-center text-2xl font-bold">
              <Car size={32} />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-4">Add New Vehicle</h2>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start">
              <AlertCircle className="text-red-500 mr-2 h-5 w-5 mt-0.5" />
              <span className="text-red-800 text-sm">{error}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Vehicle Name
              </Label>
              <div className="mt-1">
                <Input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="e.g., My Car"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="make" className="block text-sm font-medium text-gray-700">
                Make
              </Label>
              <div className="mt-1">
                <Input
                  id="make"
                  name="make"
                  type="text"
                  placeholder="e.g., Toyota"
                  value={make}
                  onChange={(e) => setMake(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="model" className="block text-sm font-medium text-gray-700">
                Model
              </Label>
              <div className="mt-1">
                <Input
                  id="model"
                  name="model"
                  type="text"
                  placeholder="e.g., Camry"
                  value={model}
                  onChange={(e) => setModel(e.target.value)}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="year" className="block text-sm font-medium text-gray-700">
                Year
              </Label>
              <div className="mt-1">
                <Input
                  id="year"
                  name="year"
                  type="number"
                  placeholder="e.g., 2023"
                  value={year}
                  onChange={(e) => {
                    const value = e.target.value;
                    setYear(value === '' ? '' : Number(value));
                  }}
                  required
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="licensePlate" className="block text-sm font-medium text-gray-700">
                License Plate (Optional)
              </Label>
              <div className="mt-1">
                <Input
                  id="licensePlate"
                  name="licensePlate"
                  type="text"
                  placeholder="e.g., ABC-123"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="cngCapacity" className="block text-sm font-medium text-gray-700">
                CNG Capacity (in Liters)
              </Label>
              <div className="mt-1 relative">
                <Input
                  id="cngCapacity"
                  name="cngCapacity"
                  type="number"
                  placeholder="e.g., 60"
                  value={cngCapacity}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCngCapacity(value === '' ? '' : Number(value));
                  }}
                  required
                />
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-500">
                  L
                </div>
              </div>
            </div>
            
            <div>
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center"
              >
                {isLoading ? (
                  <>
                    <span className="inline-block h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                    Adding Vehicle...
                  </>
                ) : (
                  <>
                    <Fuel className="mr-2 h-5 w-5" />
                    Add Vehicle
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddVehicle;

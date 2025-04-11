import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Plus, Trash2 } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type Vehicle = Database['public']['Tables']['vehicles']['Row'];

const Vehicles = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const fetchVehicles = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await supabase
          .from('vehicles')
          .select('*')
          .eq('user_id', user.id);
        
        if (error) {
          console.error('Error fetching vehicles:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Unable to load your vehicles. Please try again.",
          });
        } else if (data) {
          setVehicles(data);
        }
      } catch (error) {
        console.error('Error in fetchVehicles:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchVehicles();
  }, [user, toast]);
  
  const handleDeleteVehicle = async (id: string) => {
    if (!user) return;
    
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) throw error;
      
      // Update the local state
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      
      toast({
        title: "Vehicle Removed",
        description: "The vehicle has been removed successfully",
      });
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove vehicle",
      });
    }
  };
  
  if (isLoading) {
    return (
      <MobileLayout>
        <div className="h-full flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cng-primary"></div>
        </div>
      </MobileLayout>
    );
  }
  
  return (
    <MobileLayout>
      <div className="pt-2 pb-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">My Vehicles</h1>
          <button 
            className="btn-primary flex items-center text-sm"
            onClick={() => navigate('/add-vehicle')}
          >
            <Plus size={16} className="mr-1" />
            Add Vehicle
          </button>
        </div>
        
        {vehicles.length > 0 ? (
          <div className="space-y-4">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="card p-4 flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{vehicle.name}</h3>
                  <p className="text-slate-500 text-sm">{vehicle.make} {vehicle.model} ({vehicle.year})</p>
                  {vehicle.license_plate && (
                    <p className="text-slate-500 text-sm">License Plate: {vehicle.license_plate}</p>
                  )}
                </div>
                <button 
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="card flex flex-col items-center justify-center py-8 text-center">
            <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
              <Car size={32} className="text-slate-400" />
            </div>
            <h3 className="font-medium mb-2">No vehicles added yet</h3>
            <p className="text-slate-500 text-sm mb-4">Add your vehicles to book CNG slots quickly</p>
            <button 
              className="btn-primary flex items-center text-sm"
              onClick={() => navigate('/add-vehicle')}
            >
              <Plus size={16} className="mr-1" />
              Add New Vehicle
            </button>
          </div>
        )}
      </div>
    </MobileLayout>
  );
};

export default Vehicles;

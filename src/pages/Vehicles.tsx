
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Plus, Trash2, Loader2 } from 'lucide-react';
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
  const [isDeleting, setIsDeleting] = useState<string | null>(null);
  
  useEffect(() => {
    fetchVehicles();
  }, [user]);
  
  const fetchVehicles = async () => {
    if (!user) return;
    
    try {
      setIsLoading(true);
      console.log('Fetching vehicles for user:', user.id);
      
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
        console.log('Vehicles fetched successfully:', data.length);
        setVehicles(data);
      }
    } catch (error) {
      console.error('Exception in fetchVehicles:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDeleteVehicle = async (id: string) => {
    if (!user) return;
    
    try {
      setIsDeleting(id);
      console.log('Deleting vehicle:', id);
      
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id);
      
      if (error) {
        console.error('Error deleting vehicle:', error);
        throw error;
      }
      
      // Update the local state
      setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
      
      toast({
        title: "Vehicle Removed",
        description: "The vehicle has been removed successfully",
      });
    } catch (error: any) {
      console.error('Exception in handleDeleteVehicle:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove vehicle",
      });
    } finally {
      setIsDeleting(null);
    }
  };
  
  if (isLoading) {
    return (
      <MobileLayout>
        <div className="h-full flex items-center justify-center">
          <Loader2 className="h-12 w-12 animate-spin text-cng-primary" />
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
                  <h3 className="font-medium">{`${vehicle.make} ${vehicle.model}`}</h3>
                  <p className="text-slate-500 text-sm">{vehicle.make} {vehicle.model}</p>
                  {vehicle.reg_number && (
                    <p className="text-slate-500 text-sm">Registration: {vehicle.reg_number}</p>
                  )}
                </div>
                <button 
                  className="text-red-500 hover:text-red-700 disabled:opacity-50"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                  disabled={isDeleting === vehicle.id}
                >
                  {isDeleting === vehicle.id ? (
                    <Loader2 size={20} className="animate-spin" />
                  ) : (
                    <Trash2 size={20} />
                  )}
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

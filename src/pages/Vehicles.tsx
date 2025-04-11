
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Plus, Edit, Trash2 } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

type Vehicle = {
  id: string;
  name: string;
  make: string;
  model: string;
  year: number | null;
  license_plate: string | null;
  user_id: string;
};

const Vehicles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  
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
            description: "Failed to load vehicles",
          });
        } else {
          setVehicles(data || []);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchVehicles();
  }, [user, toast]);
  
  const handleDeleteVehicle = async (id: string) => {
    try {
      const { error } = await supabase
        .from('vehicles')
        .delete()
        .eq('id', id)
        .eq('user_id', user?.id);
      
      if (error) {
        console.error('Error deleting vehicle:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to remove vehicle",
        });
      } else {
        // Update the local state
        setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
        
        toast({
          title: "Vehicle Removed",
          description: "Vehicle has been successfully removed",
        });
      }
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove vehicle",
      });
    }
  };
  
  const displayVehiclesList = () => {
    if (loading) {
      return (
        <div className="flex justify-center py-8">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-cng-primary"></div>
        </div>
      );
    }
    
    if (vehicles.length === 0) {
      return (
        <div className="card flex flex-col items-center justify-center py-10 text-center">
          <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4">
            <Car size={32} className="text-slate-400" />
          </div>
          <h3 className="font-medium mb-2">No Vehicles Added</h3>
          <p className="text-slate-500 text-sm mb-4">Add your first vehicle to book slots</p>
          <button 
            className="btn-primary flex items-center text-sm"
            onClick={() => navigate('/add-vehicle')}
          >
            <Plus size={16} className="mr-1" />
            Add Vehicle
          </button>
        </div>
      );
    }
    
    return (
      <div className="space-y-4">
        {vehicles.map(vehicle => (
          <div key={vehicle.id} className="card">
            <div className="flex items-start">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                <Car size={24} className="text-slate-500" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-semibold">{vehicle.name}</h3>
                <p className="text-sm text-slate-500">{vehicle.license_plate || 'No plate number'}</p>
                
                <div className="flex items-center text-xs text-slate-500 mt-2">
                  <span className="mr-2">{vehicle.make}</span>
                  <span className="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>
                  <span className="mr-2">{vehicle.model}</span>
                  {vehicle.year && (
                    <>
                      <span className="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>
                      <span>{vehicle.year}</span>
                    </>
                  )}
                </div>
              </div>
              
              <div className="flex">
                <button 
                  className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-slate-700"
                  onClick={() => navigate(`/edit-vehicle/${vehicle.id}`)}
                >
                  <Edit size={16} />
                </button>
                <button 
                  className="w-8 h-8 flex items-center justify-center text-slate-500 hover:text-red-500"
                  onClick={() => handleDeleteVehicle(vehicle.id)}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  return (
    <MobileLayout title="My Vehicles">
      <div className="pt-2 pb-6">
        <div className="flex justify-end mb-4">
          <button 
            className="btn-primary flex items-center text-sm"
            onClick={() => navigate('/add-vehicle')}
          >
            <Plus size={16} className="mr-1" />
            Add Vehicle
          </button>
        </div>
        
        {displayVehiclesList()}
      </div>
    </MobileLayout>
  );
};

export default Vehicles;

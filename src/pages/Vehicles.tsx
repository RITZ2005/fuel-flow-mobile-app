
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Plus, Edit, Trash2 } from 'lucide-react';
import MobileLayout from '@/components/layout/MobileLayout';
import { useToast } from '@/hooks/use-toast';

const Vehicles = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Mock vehicles data
  const [vehicles, setVehicles] = useState([
    {
      id: '1',
      name: 'Honda Civic CNG',
      plate: 'ABC-123',
      type: 'Sedan',
      fuelType: 'CNG',
      color: 'Blue',
    },
    {
      id: '2',
      name: 'Toyota Corolla',
      plate: 'XYZ-789',
      type: 'Sedan',
      fuelType: 'Hybrid CNG',
      color: 'Silver',
    },
  ]);
  
  const handleDeleteVehicle = (id: string) => {
    // Filter out the vehicle with the given id
    setVehicles(vehicles.filter(vehicle => vehicle.id !== id));
    
    toast({
      title: "Vehicle Removed",
      description: "Vehicle has been successfully removed",
    });
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
        
        {vehicles.length > 0 ? (
          <div className="space-y-4">
            {vehicles.map(vehicle => (
              <div key={vehicle.id} className="card">
                <div className="flex items-start">
                  <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mr-3">
                    <Car size={24} className="text-slate-500" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold">{vehicle.name}</h3>
                    <p className="text-sm text-slate-500">{vehicle.plate}</p>
                    
                    <div className="flex items-center text-xs text-slate-500 mt-2">
                      <span className="mr-2">{vehicle.type}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>
                      <span className="mr-2">{vehicle.fuelType}</span>
                      <span className="w-1 h-1 bg-slate-300 rounded-full mr-2"></span>
                      <span>{vehicle.color}</span>
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
        ) : (
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
        )}
      </div>
    </MobileLayout>
  );
};

export default Vehicles;

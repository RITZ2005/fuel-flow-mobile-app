
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '@/hooks/use-supabase';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { supabase } from '@/integrations/supabase/client';

type Station = Tables<'stations'>;
type StationInput = Omit<Station, 'id' | 'created_at'>;

const AddStationForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<StationInput>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const onSubmit = async (data: StationInput) => {
    try {
      // Get current user
      const { data: authData } = await supabase.auth.getUser();
      const userId = authData?.user?.id;
      
      const { error } = await supabase.from('stations').insert({
        ...data,
        is_active: true,
        created_by: userId || 'system',
        distance: 0,
        rating: 0
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Station added successfully"
      });
      // Wait a moment for the database to update before navigating
      setTimeout(() => navigate('/stations'), 500);
    } catch (error: any) {
      console.error("Error adding station:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add station"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Station Name</Label>
        <Input id="name" {...register('name', { required: true })} />
        {errors.name && <p className="text-sm text-red-500">Station name is required</p>}
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...register('address', { required: true })} />
        {errors.address && <p className="text-sm text-red-500">Address is required</p>}
      </div>

      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" {...register('city', { required: true })} />
        {errors.city && <p className="text-sm text-red-500">City is required</p>}
      </div>

      <div>
        <Label htmlFor="state">State</Label>
        <Input id="state" {...register('state', { required: true })} />
        {errors.state && <p className="text-sm text-red-500">State is required</p>}
      </div>

      <div>
        <Label htmlFor="opening_time">Opening Time</Label>
        <Input 
          id="opening_time" 
          type="time" 
          {...register('opening_time', { required: true })} 
        />
        {errors.opening_time && <p className="text-sm text-red-500">Opening time is required</p>}
      </div>

      <div>
        <Label htmlFor="closing_time">Closing Time</Label>
        <Input 
          id="closing_time" 
          type="time" 
          {...register('closing_time', { required: true })} 
        />
        {errors.closing_time && <p className="text-sm text-red-500">Closing time is required</p>}
      </div>

      <Button type="submit" className="w-full">Add Station</Button>
    </form>
  );
};

export default AddStationForm;

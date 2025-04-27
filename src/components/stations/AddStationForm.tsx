
import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { useSupabase } from '@/hooks/use-supabase';
import { Tables } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Station = Tables<'stations'>;
type StationInput = Omit<Station, 'id' | 'created_at' | 'distance' | 'rating'>;

const AddStationForm = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<StationInput>();
  const navigate = useNavigate();
  const { create } = useSupabase<Station>('stations');
  const { toast } = useToast();

  const onSubmit = async (data: StationInput) => {
    try {
      const { error } = await create({
        ...data,
        is_active: true,
        created_by: 'system'
      });

      if (error) throw error;

      toast({
        title: "Success",
        description: "Station added successfully"
      });
      navigate('/stations');
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add station"
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Label htmlFor="name">Station Name</Label>
        <Input id="name" {...register('name', { required: true })} />
      </div>

      <div>
        <Label htmlFor="address">Address</Label>
        <Input id="address" {...register('address', { required: true })} />
      </div>

      <div>
        <Label htmlFor="city">City</Label>
        <Input id="city" {...register('city', { required: true })} />
      </div>

      <div>
        <Label htmlFor="state">State</Label>
        <Input id="state" {...register('state', { required: true })} />
      </div>

      <div>
        <Label htmlFor="opening_time">Opening Time</Label>
        <Input 
          id="opening_time" 
          type="time" 
          {...register('opening_time', { required: true })} 
        />
      </div>

      <div>
        <Label htmlFor="closing_time">Closing Time</Label>
        <Input 
          id="closing_time" 
          type="time" 
          {...register('closing_time', { required: true })} 
        />
      </div>

      <Button type="submit" className="w-full">Add Station</Button>
    </form>
  );
};

export default AddStationForm;

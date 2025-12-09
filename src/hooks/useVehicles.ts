import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Vehicle {
  id: string;
  user_id: string;
  make: string;
  model: string;
  registration_number: string;
  vin: string | null;
  odometer: number;
  created_at: string;
  updated_at: string;
}

export function useMyVehicle() {
  const { user } = useAuth();
  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchVehicle = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('vehicles')
        .select('*')
        .eq('user_id', user.id)
        .maybeSingle();

      if (error) throw error;
      setVehicle(data);
    } catch (err) {
      console.error('Error fetching vehicle:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchVehicle();
  }, [fetchVehicle]);

  const updateVehicle = async (updates: Partial<Vehicle>) => {
    if (!vehicle?.id) return { error: new Error('No vehicle found') };

    const { error } = await supabase
      .from('vehicles')
      .update(updates)
      .eq('id', vehicle.id);

    if (!error) {
      fetchVehicle();
    }

    return { error };
  };

  return { vehicle, isLoading, updateVehicle, refetch: fetchVehicle };
}
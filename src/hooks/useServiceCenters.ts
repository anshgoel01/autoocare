import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';

export interface ServiceCenter {
  id: string;
  name: string;
  address: string;
  phone: string | null;
  email: string | null;
  services: string[];
  open_hours: string | null;
  rating: number;
  reviews_count: number;
  availability: string;
  lat: number;
  lng: number;
  owner_id: string;
}

export function useServiceCenters() {
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchServiceCenters = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data, error: fetchError } = await supabase
        .from('service_centers')
        .select('*')
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setServiceCenters(data || []);
    } catch (err) {
      setError(err as Error);
      console.error('Error fetching service centers:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchServiceCenters();
  }, [fetchServiceCenters]);

  return { serviceCenters, isLoading, error, refetch: fetchServiceCenters };
}

export function useMyServiceCenter(userId: string | undefined) {
  const [serviceCenter, setServiceCenter] = useState<ServiceCenter | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchMyServiceCenter() {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('service_centers')
          .select('*')
          .eq('owner_id', userId)
          .maybeSingle();

        if (error) throw error;
        setServiceCenter(data);
      } catch (err) {
        console.error('Error fetching service center:', err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchMyServiceCenter();
  }, [userId]);

  return { serviceCenter, isLoading };
}
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

export interface Booking {
  id: string;
  user_id: string;
  vehicle_id: string | null;
  service_center_id: string;
  service: string;
  date: string;
  time: string;
  notes: string | null;
  status: string;
  created_at: string;
  // Joined data
  profile?: {
    full_name: string | null;
    email: string | null;
    phone: string | null;
  };
  vehicle?: {
    make: string;
    model: string;
    registration_number: string;
  };
  service_center?: {
    name: string;
  };
}

export function useUserBookings() {
  const { user } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          service_center:service_centers(name),
          vehicle:vehicles(make, model, registration_number)
        `)
        .eq('user_id', user.id)
        .order('date', { ascending: false });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching bookings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const addBooking = async (booking: {
    service_center_id: string;
    vehicle_id?: string;
    service: string;
    date: string;
    time: string;
    notes?: string;
  }) => {
    if (!user?.id) return { error: new Error('Not authenticated') };

    const { error } = await supabase
      .from('bookings')
      .insert({
        user_id: user.id,
        service_center_id: booking.service_center_id,
        vehicle_id: booking.vehicle_id || null,
        service: booking.service,
        date: booking.date,
        time: booking.time,
        notes: booking.notes || null,
        status: 'pending',
      });

    if (!error) {
      fetchBookings();
    }

    return { error };
  };

  const cancelBooking = async (bookingId: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', bookingId);

    if (!error) {
      fetchBookings();
    }

    return { error };
  };

  const hasActiveBooking = bookings.some(b => 
    b.status === 'pending' || b.status === 'confirmed'
  );

  const nextBooking = bookings.find(b => 
    (b.status === 'pending' || b.status === 'confirmed') && 
    new Date(b.date) >= new Date()
  );

  return { 
    bookings, 
    isLoading, 
    addBooking, 
    cancelBooking,
    hasActiveBooking,
    nextBooking,
    refetch: fetchBookings,
  };
}

export function useServiceCenterBookings(serviceCenterId: string | undefined) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    if (!serviceCenterId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from('bookings')
        .select(`
          *,
          profile:profiles(full_name, email, phone),
          vehicle:vehicles(make, model, registration_number)
        `)
        .eq('service_center_id', serviceCenterId)
        .order('date', { ascending: true });

      if (error) throw error;
      setBookings(data || []);
    } catch (err) {
      console.error('Error fetching service center bookings:', err);
    } finally {
      setIsLoading(false);
    }
  }, [serviceCenterId]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const updateBookingStatus = async (bookingId: string, status: string) => {
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', bookingId);

    if (!error) {
      fetchBookings();
    }

    return { error };
  };

  return { bookings, isLoading, updateBookingStatus, refetch: fetchBookings };
}
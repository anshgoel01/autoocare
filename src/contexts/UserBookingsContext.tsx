import React, { createContext, useContext, useState, useCallback } from 'react';

export interface UserBooking {
  id: string;
  centerId: string;
  centerName: string;
  service: string;
  date: string;
  time: string;
  notes: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

interface UserBookingsContextType {
  bookings: UserBooking[];
  addBooking: (booking: Omit<UserBooking, 'id' | 'status' | 'createdAt'>) => void;
  cancelBooking: (id: string) => void;
  hasActiveBooking: boolean;
  nextBooking: UserBooking | null;
}

const UserBookingsContext = createContext<UserBookingsContextType | undefined>(undefined);

export function UserBookingsProvider({ children }: { children: React.ReactNode }) {
  const [bookings, setBookings] = useState<UserBooking[]>(() => {
    const saved = localStorage.getItem('autocare_user_bookings');
    if (saved) {
      return JSON.parse(saved);
    }
    return [];
  });

  const addBooking = useCallback((booking: Omit<UserBooking, 'id' | 'status' | 'createdAt'>) => {
    const newBooking: UserBooking = {
      ...booking,
      id: Math.random().toString(36).substr(2, 9),
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => {
      const updated = [...prev, newBooking];
      localStorage.setItem('autocare_user_bookings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const cancelBooking = useCallback((id: string) => {
    setBookings(prev => {
      const updated = prev.map(b => 
        b.id === id ? { ...b, status: 'cancelled' as const } : b
      );
      localStorage.setItem('autocare_user_bookings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const activeBookings = bookings.filter(b => 
    b.status === 'confirmed' || b.status === 'pending'
  );
  
  const hasActiveBooking = activeBookings.length > 0;
  
  const nextBooking = activeBookings.length > 0 
    ? activeBookings.sort((a, b) => 
        new Date(a.date).getTime() - new Date(b.date).getTime()
      )[0]
    : null;

  return (
    <UserBookingsContext.Provider value={{ 
      bookings, 
      addBooking, 
      cancelBooking,
      hasActiveBooking,
      nextBooking 
    }}>
      {children}
    </UserBookingsContext.Provider>
  );
}

export function useUserBookings() {
  const context = useContext(UserBookingsContext);
  if (context === undefined) {
    throw new Error('useUserBookings must be used within a UserBookingsProvider');
  }
  return context;
}

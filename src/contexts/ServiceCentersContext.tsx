import React, { createContext, useContext, useState, useCallback } from 'react';
import { serviceCenters as initialServiceCenters } from '@/data/mockData';

export interface ServiceCenter {
  id: string;
  name: string;
  address: string;
  distance: number;
  rating: number;
  reviews: number;
  availability: 'high' | 'medium' | 'low';
  phone: string;
  services: string[];
  openHours: string;
  lat: number;
  lng: number;
  ownerName?: string;
  email?: string;
  licenseNumber?: string;
}

interface ServiceCentersContextType {
  serviceCenters: ServiceCenter[];
  addServiceCenter: (center: Omit<ServiceCenter, 'id' | 'distance' | 'rating' | 'reviews' | 'availability' | 'lat' | 'lng'>) => void;
}

const ServiceCentersContext = createContext<ServiceCentersContextType | undefined>(undefined);

export function ServiceCentersProvider({ children }: { children: React.ReactNode }) {
  const [serviceCenters, setServiceCenters] = useState<ServiceCenter[]>(() => {
    const saved = localStorage.getItem('autocare_service_centers');
    if (saved) {
      return JSON.parse(saved);
    }
    return initialServiceCenters;
  });

  const addServiceCenter = useCallback((center: Omit<ServiceCenter, 'id' | 'distance' | 'rating' | 'reviews' | 'availability' | 'lat' | 'lng'>) => {
    const newCenter: ServiceCenter = {
      ...center,
      id: Math.random().toString(36).substr(2, 9),
      distance: Math.round((Math.random() * 10 + 0.5) * 10) / 10,
      rating: 5.0,
      reviews: 0,
      availability: 'high',
      lat: 37.7749 + (Math.random() - 0.5) * 0.1,
      lng: -122.4194 + (Math.random() - 0.5) * 0.1,
    };

    setServiceCenters(prev => {
      const updated = [...prev, newCenter];
      localStorage.setItem('autocare_service_centers', JSON.stringify(updated));
      return updated;
    });
  }, []);

  return (
    <ServiceCentersContext.Provider value={{ serviceCenters, addServiceCenter }}>
      {children}
    </ServiceCentersContext.Provider>
  );
}

export function useServiceCenters() {
  const context = useContext(ServiceCentersContext);
  if (context === undefined) {
    throw new Error('useServiceCenters must be used within a ServiceCentersProvider');
  }
  return context;
}

import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export type UserRole = 'vehicle_owner' | 'service_center';

interface Profile {
  id: string;
  role: UserRole;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
}

interface ServiceCenterData {
  id: string;
  name: string;
}

interface VehicleData {
  id: string;
  make: string;
  model: string;
  registration_number: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  profile?: Profile;
  serviceCenter?: ServiceCenterData;
  vehicle?: VehicleData;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUp: (email: string, password: string, metadata: Record<string, unknown>) => Promise<{ error: Error | null }>;
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUserData = useCallback(async (supabaseUser: SupabaseUser) => {
    try {
      // Fetch profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      if (!profile) {
        return null;
      }

      // Fetch role from user_roles table (secure source of truth)
      const { data: userRoleData } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', supabaseUser.id)
        .maybeSingle();

      // Use role from user_roles table, fallback to profile for backward compatibility
      const userRole = (userRoleData?.role || profile.role) as UserRole;

      const userData: User = {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: profile.full_name || supabaseUser.email?.split('@')[0] || 'User',
        role: userRole,
        profile: { ...profile, role: userRole },
      };

      // If service center, fetch service center data
      if (userRole === 'service_center') {
        const { data: serviceCenter } = await supabase
          .from('service_centers')
          .select('id, name')
          .eq('owner_id', supabaseUser.id)
          .maybeSingle();

        if (serviceCenter) {
          userData.serviceCenter = serviceCenter;
          userData.name = serviceCenter.name;
        }
      }

      // If vehicle owner, fetch vehicle data
      if (userRole === 'vehicle_owner') {
        const { data: vehicle } = await supabase
          .from('vehicles')
          .select('id, make, model, registration_number')
          .eq('user_id', supabaseUser.id)
          .maybeSingle();

        if (vehicle) {
          userData.vehicle = vehicle;
        }
      }

      return userData;
    } catch (error) {
      console.error('Error fetching user data:', error);
      return null;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    if (session?.user) {
      const userData = await fetchUserData(session.user);
      setUser(userData);
    }
  }, [session, fetchUserData]);

  useEffect(() => {
    // Set up auth state listener FIRST
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        setSession(newSession);
        
        if (newSession?.user) {
          // Defer Supabase calls with setTimeout to avoid deadlock
          setTimeout(async () => {
            const userData = await fetchUserData(newSession.user);
            setUser(userData);
            setIsLoading(false);
          }, 0);
        } else {
          setUser(null);
          setIsLoading(false);
        }
      }
    );

    // THEN check for existing session
    supabase.auth.getSession().then(({ data: { session: existingSession } }) => {
      setSession(existingSession);
      if (existingSession?.user) {
        fetchUserData(existingSession.user).then((userData) => {
          setUser(userData);
          setIsLoading(false);
        });
      } else {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, [fetchUserData]);

  const signUp = useCallback(async (
    email: string, 
    password: string, 
    metadata: Record<string, unknown>
  ): Promise<{ error: Error | null }> => {
    const redirectUrl = `${window.location.origin}/`;
    
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectUrl,
        data: metadata,
      },
    });

    return { error: error as Error | null };
  }, []);

  const signIn = useCallback(async (
    email: string, 
    password: string
  ): Promise<{ error: Error | null }> => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return { error: error as Error | null };
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      session,
      isAuthenticated: !!user, 
      isLoading,
      signUp,
      signIn,
      logout,
      refreshProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
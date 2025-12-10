-- Create RPC function to upgrade user to service center role (called after signup by app)
CREATE OR REPLACE FUNCTION public.set_service_center_role(_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow if the user is setting their own role
  IF auth.uid() != _user_id THEN
    RAISE EXCEPTION 'Not authorized';
  END IF;
  
  -- Check if user already has a role
  IF EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id) THEN
    -- Update existing role to service_center
    UPDATE public.user_roles 
    SET role = 'service_center'
    WHERE user_id = _user_id;
    
    -- Update profiles table for backward compatibility
    UPDATE public.profiles
    SET role = 'service_center'
    WHERE id = _user_id;
  ELSE
    -- Insert new role
    INSERT INTO public.user_roles (user_id, role)
    VALUES (_user_id, 'service_center');
  END IF;
END;
$$;
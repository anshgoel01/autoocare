import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { useServiceCenters } from '@/contexts/ServiceCentersContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { Car, Wrench, Eye, EyeOff, Loader2, ArrowLeft, User, Building2 } from 'lucide-react';

const SERVICE_OPTIONS = [
  { id: 'regular', label: 'Regular Maintenance' },
  { id: 'repairs', label: 'Repairs' },
  { id: 'emergency', label: 'Emergency Services' },
  { id: 'warranty', label: 'Warranty Services' },
];

export default function SignUp() {
  const [step, setStep] = useState<'role' | 'form'>('role');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // User form state
  const [userForm, setUserForm] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    countryCode: '+1',
    city: '',
    state: '',
    pin: '',
    vehicleRegistration: '',
    vehicleModel: '',
    vehicleMake: '',
  });

  // Service Center form state
  const [serviceCenterForm, setServiceCenterForm] = useState({
    centerName: '',
    ownerName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    countryCode: '+1',
    street: '',
    city: '',
    state: '',
    pin: '',
    openingHour: '08:00',
    closingHour: '18:00',
    servicesOffered: [] as string[],
    licenseNumber: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const { login } = useAuth();
  const { addServiceCenter } = useServiceCenters();
  const navigate = useNavigate();
  const { toast } = useToast();

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^\d{10}$/.test(phone.replace(/\D/g, ''));
  };

  const validateUserForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!userForm.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!userForm.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(userForm.email)) newErrors.email = 'Invalid email format';
    if (!userForm.password) newErrors.password = 'Password is required';
    else if (userForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (userForm.password !== userForm.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!userForm.phone) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(userForm.phone)) newErrors.phone = 'Invalid phone format (10 digits)';
    if (!userForm.city.trim()) newErrors.city = 'City is required';
    if (!userForm.state.trim()) newErrors.state = 'State is required';
    if (!userForm.pin.trim()) newErrors.pin = 'PIN code is required';
    if (!userForm.vehicleRegistration.trim()) newErrors.vehicleRegistration = 'Vehicle registration is required';
    if (!userForm.vehicleModel.trim()) newErrors.vehicleModel = 'Vehicle model is required';
    if (!userForm.vehicleMake.trim()) newErrors.vehicleMake = 'Vehicle make is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateServiceCenterForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!serviceCenterForm.centerName.trim()) newErrors.centerName = 'Service center name is required';
    if (!serviceCenterForm.ownerName.trim()) newErrors.ownerName = 'Owner name is required';
    if (!serviceCenterForm.email.trim()) newErrors.email = 'Email is required';
    else if (!validateEmail(serviceCenterForm.email)) newErrors.email = 'Invalid email format';
    if (!serviceCenterForm.password) newErrors.password = 'Password is required';
    else if (serviceCenterForm.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    if (serviceCenterForm.password !== serviceCenterForm.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!serviceCenterForm.phone) newErrors.phone = 'Phone number is required';
    else if (!validatePhone(serviceCenterForm.phone)) newErrors.phone = 'Invalid phone format (10 digits)';
    if (!serviceCenterForm.street.trim()) newErrors.street = 'Street address is required';
    if (!serviceCenterForm.city.trim()) newErrors.city = 'City is required';
    if (!serviceCenterForm.state.trim()) newErrors.state = 'State is required';
    if (!serviceCenterForm.pin.trim()) newErrors.pin = 'PIN code is required';
    if (serviceCenterForm.servicesOffered.length === 0) newErrors.servicesOffered = 'Select at least one service';
    if (!serviceCenterForm.licenseNumber.trim()) newErrors.licenseNumber = 'Registration/License number is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUserSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateUserForm()) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Store user data
      const userData = {
        ...userForm,
        id: Math.random().toString(36).substr(2, 9),
        role: 'user',
        createdAt: new Date().toISOString(),
      };
      localStorage.setItem('autocare_registered_user', JSON.stringify(userData));

      await login(userForm.email, userForm.password, 'user');
      
      toast({
        title: 'Account Created!',
        description: 'Welcome to AutoCare Pro. Your account has been created successfully.',
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Sign Up Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceCenterSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateServiceCenterForm()) return;

    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Add service center to the list
      const servicesMap: Record<string, string> = {
        'regular': 'General Maintenance',
        'repairs': 'Repair Services',
        'emergency': 'Emergency Services',
        'warranty': 'Warranty Services',
      };

      addServiceCenter({
        name: serviceCenterForm.centerName,
        ownerName: serviceCenterForm.ownerName,
        email: serviceCenterForm.email,
        address: `${serviceCenterForm.street}, ${serviceCenterForm.city}, ${serviceCenterForm.state} ${serviceCenterForm.pin}`,
        phone: `${serviceCenterForm.countryCode} ${serviceCenterForm.phone}`,
        services: serviceCenterForm.servicesOffered.map(s => servicesMap[s] || s),
        openHours: `${serviceCenterForm.openingHour} - ${serviceCenterForm.closingHour}`,
        licenseNumber: serviceCenterForm.licenseNumber,
      });

      await login(serviceCenterForm.email, serviceCenterForm.password, 'service-center');
      
      toast({
        title: 'Service Center Registered!',
        description: 'Your service center is now listed and visible to vehicle owners.',
      });
      
      navigate('/service-center-dashboard');
    } catch (error) {
      toast({
        title: 'Registration Failed',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleServiceToggle = (serviceId: string) => {
    setServiceCenterForm(prev => ({
      ...prev,
      servicesOffered: prev.servicesOffered.includes(serviceId)
        ? prev.servicesOffered.filter(s => s !== serviceId)
        : [...prev.servicesOffered, serviceId]
    }));
    if (errors.servicesOffered) {
      setErrors(prev => ({ ...prev, servicesOffered: '' }));
    }
  };

  if (step === 'role') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl" />
        </div>
        
        <Card className="w-full max-w-lg relative z-10 border-border/50 shadow-2xl animate-fade-in">
          <CardHeader className="space-y-4 text-center pb-2">
            <div className="mx-auto w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
              <Car className="w-8 h-8 text-primary-foreground" />
            </div>
            <div>
              <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
              <CardDescription className="text-muted-foreground">
                Choose your account type to get started
              </CardDescription>
            </div>
          </CardHeader>
          
          <CardContent className="pt-4 space-y-4">
            <button
              onClick={() => { setSelectedRole('user'); setStep('form'); }}
              className="w-full p-6 rounded-xl border-2 border-border hover:border-primary/50 hover:bg-primary/5 transition-all group text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <User className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Vehicle Owner</h3>
                  <p className="text-sm text-muted-foreground">
                    Monitor your vehicle's health, get AI predictions, and book services
                  </p>
                </div>
              </div>
            </button>

            <button
              onClick={() => { setSelectedRole('service-center'); setStep('form'); }}
              className="w-full p-6 rounded-xl border-2 border-border hover:border-accent/50 hover:bg-accent/5 transition-all group text-left"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                  <Building2 className="w-6 h-6 text-accent" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Service Center</h3>
                  <p className="text-sm text-muted-foreground">
                    List your center, manage bookings, inventory, and connect with customers
                  </p>
                </div>
              </div>
            </button>

            <div className="pt-4 border-t border-border">
              <p className="text-sm text-center text-muted-foreground">
                Already have an account?{' '}
                <Link to="/" className="text-primary hover:underline font-medium">
                  Sign In
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4 py-8">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <Card className="w-full max-w-2xl relative z-10 border-border/50 shadow-2xl animate-fade-in">
        <CardHeader className="space-y-4 pb-2">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setStep('role')}
              className="p-2 rounded-lg hover:bg-muted transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedRole === 'user' ? 'bg-primary/10' : 'bg-accent/10'
              }`}>
                {selectedRole === 'user' ? (
                  <User className="w-5 h-5 text-primary" />
                ) : (
                  <Building2 className="w-5 h-5 text-accent" />
                )}
              </div>
              <div>
                <CardTitle className="text-xl">
                  {selectedRole === 'user' ? 'Vehicle Owner Sign Up' : 'Service Center Registration'}
                </CardTitle>
                <CardDescription>
                  {selectedRole === 'user' 
                    ? 'Create your account to track vehicle health'
                    : 'Register your service center to connect with customers'
                  }
                </CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          {selectedRole === 'user' ? (
            <form onSubmit={handleUserSignUp} className="space-y-6">
              {/* Personal Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      placeholder="John Mitchell"
                      value={userForm.fullName}
                      onChange={(e) => setUserForm(prev => ({ ...prev, fullName: e.target.value }))}
                      className={errors.fullName ? 'border-destructive' : ''}
                    />
                    {errors.fullName && <p className="text-xs text-destructive">{errors.fullName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={userForm.email}
                      onChange={(e) => setUserForm(prev => ({ ...prev, email: e.target.value }))}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min 6 characters"
                        value={userForm.password}
                        onChange={(e) => setUserForm(prev => ({ ...prev, password: e.target.value }))}
                        className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={userForm.confirmPassword}
                        onChange={(e) => setUserForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <div className="flex gap-2">
                    <Input
                      className="w-20"
                      value={userForm.countryCode}
                      onChange={(e) => setUserForm(prev => ({ ...prev, countryCode: e.target.value }))}
                    />
                    <Input
                      id="phone"
                      placeholder="5551234567"
                      value={userForm.phone}
                      onChange={(e) => setUserForm(prev => ({ ...prev, phone: e.target.value }))}
                      className={`flex-1 ${errors.phone ? 'border-destructive' : ''}`}
                    />
                  </div>
                  {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Address</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="San Francisco"
                      value={userForm.city}
                      onChange={(e) => setUserForm(prev => ({ ...prev, city: e.target.value }))}
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="California"
                      value={userForm.state}
                      onChange={(e) => setUserForm(prev => ({ ...prev, state: e.target.value }))}
                      className={errors.state ? 'border-destructive' : ''}
                    />
                    {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label htmlFor="pin">PIN Code *</Label>
                    <Input
                      id="pin"
                      placeholder="94102"
                      value={userForm.pin}
                      onChange={(e) => setUserForm(prev => ({ ...prev, pin: e.target.value }))}
                      className={errors.pin ? 'border-destructive' : ''}
                    />
                    {errors.pin && <p className="text-xs text-destructive">{errors.pin}</p>}
                  </div>
                </div>
              </div>

              {/* Vehicle Details */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Vehicle Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vehicleRegistration">Registration Number *</Label>
                    <Input
                      id="vehicleRegistration"
                      placeholder="CA-7XYZ-921"
                      value={userForm.vehicleRegistration}
                      onChange={(e) => setUserForm(prev => ({ ...prev, vehicleRegistration: e.target.value }))}
                      className={errors.vehicleRegistration ? 'border-destructive' : ''}
                    />
                    {errors.vehicleRegistration && <p className="text-xs text-destructive">{errors.vehicleRegistration}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleMake">Vehicle Make *</Label>
                    <Input
                      id="vehicleMake"
                      placeholder="Tesla"
                      value={userForm.vehicleMake}
                      onChange={(e) => setUserForm(prev => ({ ...prev, vehicleMake: e.target.value }))}
                      className={errors.vehicleMake ? 'border-destructive' : ''}
                    />
                    {errors.vehicleMake && <p className="text-xs text-destructive">{errors.vehicleMake}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="vehicleModel">Vehicle Model *</Label>
                    <Input
                      id="vehicleModel"
                      placeholder="Model 3"
                      value={userForm.vehicleModel}
                      onChange={(e) => setUserForm(prev => ({ ...prev, vehicleModel: e.target.value }))}
                      className={errors.vehicleModel ? 'border-destructive' : ''}
                    />
                    {errors.vehicleModel && <p className="text-xs text-destructive">{errors.vehicleModel}</p>}
                  </div>
                </div>
              </div>

              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          ) : (
            <form onSubmit={handleServiceCenterSignUp} className="space-y-6">
              {/* Service Center Info */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Service Center Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="centerName">Service Center Name *</Label>
                    <Input
                      id="centerName"
                      placeholder="AutoCare Premium"
                      value={serviceCenterForm.centerName}
                      onChange={(e) => setServiceCenterForm(prev => ({ ...prev, centerName: e.target.value }))}
                      className={errors.centerName ? 'border-destructive' : ''}
                    />
                    {errors.centerName && <p className="text-xs text-destructive">{errors.centerName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ownerName">Owner Name *</Label>
                    <Input
                      id="ownerName"
                      placeholder="John Doe"
                      value={serviceCenterForm.ownerName}
                      onChange={(e) => setServiceCenterForm(prev => ({ ...prev, ownerName: e.target.value }))}
                      className={errors.ownerName ? 'border-destructive' : ''}
                    />
                    {errors.ownerName && <p className="text-xs text-destructive">{errors.ownerName}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scEmail">Email *</Label>
                    <Input
                      id="scEmail"
                      type="email"
                      placeholder="contact@autocare.com"
                      value={serviceCenterForm.email}
                      onChange={(e) => setServiceCenterForm(prev => ({ ...prev, email: e.target.value }))}
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scPhone">Phone Number *</Label>
                    <div className="flex gap-2">
                      <Input
                        className="w-20"
                        value={serviceCenterForm.countryCode}
                        onChange={(e) => setServiceCenterForm(prev => ({ ...prev, countryCode: e.target.value }))}
                      />
                      <Input
                        id="scPhone"
                        placeholder="5551234567"
                        value={serviceCenterForm.phone}
                        onChange={(e) => setServiceCenterForm(prev => ({ ...prev, phone: e.target.value }))}
                        className={`flex-1 ${errors.phone ? 'border-destructive' : ''}`}
                      />
                    </div>
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scPassword">Password *</Label>
                    <div className="relative">
                      <Input
                        id="scPassword"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Min 6 characters"
                        value={serviceCenterForm.password}
                        onChange={(e) => setServiceCenterForm(prev => ({ ...prev, password: e.target.value }))}
                        className={`pr-10 ${errors.password ? 'border-destructive' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.password && <p className="text-xs text-destructive">{errors.password}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scConfirmPassword">Confirm Password *</Label>
                    <div className="relative">
                      <Input
                        id="scConfirmPassword"
                        type={showConfirmPassword ? 'text' : 'password'}
                        placeholder="Confirm password"
                        value={serviceCenterForm.confirmPassword}
                        onChange={(e) => setServiceCenterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                        className={`pr-10 ${errors.confirmPassword ? 'border-destructive' : ''}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                    {errors.confirmPassword && <p className="text-xs text-destructive">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Address */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Location</h3>
                <div className="space-y-2">
                  <Label htmlFor="street">Street Address *</Label>
                  <Input
                    id="street"
                    placeholder="456 Market Street"
                    value={serviceCenterForm.street}
                    onChange={(e) => setServiceCenterForm(prev => ({ ...prev, street: e.target.value }))}
                    className={errors.street ? 'border-destructive' : ''}
                  />
                  {errors.street && <p className="text-xs text-destructive">{errors.street}</p>}
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="scCity">City *</Label>
                    <Input
                      id="scCity"
                      placeholder="San Francisco"
                      value={serviceCenterForm.city}
                      onChange={(e) => setServiceCenterForm(prev => ({ ...prev, city: e.target.value }))}
                      className={errors.city ? 'border-destructive' : ''}
                    />
                    {errors.city && <p className="text-xs text-destructive">{errors.city}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="scState">State *</Label>
                    <Input
                      id="scState"
                      placeholder="California"
                      value={serviceCenterForm.state}
                      onChange={(e) => setServiceCenterForm(prev => ({ ...prev, state: e.target.value }))}
                      className={errors.state ? 'border-destructive' : ''}
                    />
                    {errors.state && <p className="text-xs text-destructive">{errors.state}</p>}
                  </div>
                  <div className="space-y-2 col-span-2 md:col-span-1">
                    <Label htmlFor="scPin">PIN Code *</Label>
                    <Input
                      id="scPin"
                      placeholder="94102"
                      value={serviceCenterForm.pin}
                      onChange={(e) => setServiceCenterForm(prev => ({ ...prev, pin: e.target.value }))}
                      className={errors.pin ? 'border-destructive' : ''}
                    />
                    {errors.pin && <p className="text-xs text-destructive">{errors.pin}</p>}
                  </div>
                </div>
              </div>

              {/* Operating Hours */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Operating Hours</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="openingHour">Opening Time</Label>
                    <Input
                      id="openingHour"
                      type="time"
                      value={serviceCenterForm.openingHour}
                      onChange={(e) => setServiceCenterForm(prev => ({ ...prev, openingHour: e.target.value }))}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="closingHour">Closing Time</Label>
                    <Input
                      id="closingHour"
                      type="time"
                      value={serviceCenterForm.closingHour}
                      onChange={(e) => setServiceCenterForm(prev => ({ ...prev, closingHour: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              {/* Services Offered */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Services Offered *</h3>
                <div className="grid grid-cols-2 gap-3">
                  {SERVICE_OPTIONS.map((service) => (
                    <div key={service.id} className="flex items-center space-x-2">
                      <Checkbox
                        id={service.id}
                        checked={serviceCenterForm.servicesOffered.includes(service.id)}
                        onCheckedChange={() => handleServiceToggle(service.id)}
                      />
                      <label
                        htmlFor={service.id}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                      >
                        {service.label}
                      </label>
                    </div>
                  ))}
                </div>
                {errors.servicesOffered && <p className="text-xs text-destructive">{errors.servicesOffered}</p>}
              </div>

              {/* License */}
              <div className="space-y-4">
                <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Registration</h3>
                <div className="space-y-2">
                  <Label htmlFor="licenseNumber">Registration/License Number *</Label>
                  <Input
                    id="licenseNumber"
                    placeholder="SC-2024-12345"
                    value={serviceCenterForm.licenseNumber}
                    onChange={(e) => setServiceCenterForm(prev => ({ ...prev, licenseNumber: e.target.value }))}
                    className={errors.licenseNumber ? 'border-destructive' : ''}
                  />
                  {errors.licenseNumber && <p className="text-xs text-destructive">{errors.licenseNumber}</p>}
                </div>
              </div>

              <Button type="submit" className="w-full h-12" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Registering...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
          )}

          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-sm text-center text-muted-foreground">
              Already have an account?{' '}
              <Link to="/" className="text-primary hover:underline font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

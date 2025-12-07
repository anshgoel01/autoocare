import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Car, Wrench, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Validation Error',
        description: 'Please enter both email and password',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const success = await login(email, password, selectedRole);
      
      if (success) {
        toast({
          title: 'Welcome back!',
          description: `Logged in as ${selectedRole === 'user' ? 'Vehicle Owner' : 'Service Center'}`,
        });
        
        navigate(selectedRole === 'user' ? '/dashboard' : '/service-center-dashboard');
      }
    } catch (error) {
      toast({
        title: 'Login Failed',
        description: 'Invalid credentials. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-accent/5 rounded-full blur-3xl" />
      </div>
      
      <Card className="w-full max-w-md relative z-10 border-border/50 shadow-2xl animate-fade-in">
        <CardHeader className="space-y-4 text-center pb-2">
          <div className="mx-auto w-16 h-16 gradient-primary rounded-2xl flex items-center justify-center shadow-glow">
            <Car className="w-8 h-8 text-primary-foreground" />
          </div>
          <div>
            <CardTitle className="text-2xl font-bold">AutoCare Pro</CardTitle>
            <CardDescription className="text-muted-foreground">
              Predictive Maintenance Platform
            </CardDescription>
          </div>
        </CardHeader>
        
        <CardContent className="pt-4">
          <Tabs value={selectedRole} onValueChange={(v) => setSelectedRole(v as UserRole)} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6 h-12">
              <TabsTrigger value="user" className="flex items-center gap-2 data-[state=active]:shadow-sm">
                <Car className="w-4 h-4" />
                Vehicle Owner
              </TabsTrigger>
              <TabsTrigger value="service-center" className="flex items-center gap-2 data-[state=active]:shadow-sm">
                <Wrench className="w-4 h-4" />
                Service Center
              </TabsTrigger>
            </TabsList>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={selectedRole === 'user' ? 'user@demo.com' : 'service@demo.com'}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 input-automotive"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-11 pr-10 input-automotive"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full h-11 mt-6" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
          </Tabs>
          
          <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-center text-muted-foreground">
              Demo credentials: Any email/password works
            </p>
            <div className="mt-2 flex justify-center gap-4 text-xs text-muted-foreground">
              <span>user@demo.com</span>
              <span className="text-border">|</span>
              <span>service@demo.com</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

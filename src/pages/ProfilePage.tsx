import { useState } from 'react';
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { userProfile } from '@/data/mockData';
import { useToast } from '@/hooks/use-toast';
import { Camera, Edit2, Save, X, Car, User, MapPin, Mail, Phone } from 'lucide-react';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(userProfile);
  const { toast } = useToast();

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: 'Profile Updated',
      description: 'Your profile has been saved successfully.',
    });
  };

  const handleCancel = () => {
    setProfile(userProfile);
    setIsEditing(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Profile</h1>
            <p className="text-muted-foreground">Manage your account and vehicle information</p>
          </div>
          {!isEditing ? (
            <Button onClick={() => setIsEditing(true)}>
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button onClick={handleSave}>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>

        {/* Profile Picture */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <div className="relative">
                <Avatar className="w-24 h-24 border-4 border-background shadow-lg">
                  <AvatarImage src={profile.avatar} />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {profile.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full flex items-center justify-center shadow-lg hover:bg-primary/90 transition-colors">
                    <Camera className="w-4 h-4 text-primary-foreground" />
                  </button>
                )}
              </div>
              <div>
                <h2 className="text-xl font-semibold">{profile.name}</h2>
                <p className="text-muted-foreground">{profile.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Personal Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={profile.phone}
                  onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={profile.address}
                  onChange={(e) => setProfile({ ...profile, address: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vehicle Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="w-5 h-5" />
              Vehicle Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="registration">Registration Number</Label>
                <Input
                  id="registration"
                  value={profile.vehicle.registration}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    vehicle: { ...profile.vehicle, registration: e.target.value } 
                  })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="vin">VIN</Label>
                <Input
                  id="vin"
                  value={profile.vehicle.vin}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    vehicle: { ...profile.vehicle, vin: e.target.value } 
                  })}
                  disabled={!isEditing}
                />
              </div>
              <div className="space-y-2">
                <Label>Make & Model</Label>
                <Input
                  value={`${profile.vehicle.year} ${profile.vehicle.make} ${profile.vehicle.model}`}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="odometer">Odometer (miles)</Label>
                <Input
                  id="odometer"
                  type="number"
                  value={profile.vehicle.odometer}
                  onChange={(e) => setProfile({ 
                    ...profile, 
                    vehicle: { ...profile.vehicle, odometer: parseInt(e.target.value) } 
                  })}
                  disabled={!isEditing}
                />
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-sm text-muted-foreground">Color</p>
                <p className="font-semibold">{profile.vehicle.color}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-sm text-muted-foreground">Year</p>
                <p className="font-semibold">{profile.vehicle.year}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-sm text-muted-foreground">Make</p>
                <p className="font-semibold">{profile.vehicle.make}</p>
              </div>
              <div className="p-4 rounded-xl bg-secondary">
                <p className="text-sm text-muted-foreground">Model</p>
                <p className="font-semibold">{profile.vehicle.model}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

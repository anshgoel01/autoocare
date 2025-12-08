import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useUserBookings } from '@/contexts/UserBookingsContext';
import { Star, MapPin, Phone, Clock, Navigation, Eye } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useNavigate } from 'react-router-dom';

interface ServiceCenterCardProps {
  center: {
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
  };
}

export default function ServiceCenterCard({ center }: ServiceCenterCardProps) {
  const [bookingOpen, setBookingOpen] = useState(false);
  const [bookingData, setBookingData] = useState({
    service: '',
    date: '',
    time: '',
    notes: '',
  });
  const { toast } = useToast();
  const { addBooking, bookings } = useUserBookings();
  const navigate = useNavigate();

  // Check if there's an active booking for this center
  const hasActiveBookingAtCenter = bookings.some(
    b => b.centerId === center.id && (b.status === 'confirmed' || b.status === 'pending')
  );

  const getAvailabilityConfig = () => {
    switch (center.availability) {
      case 'high':
        return { label: 'Available Now', color: 'bg-success text-success-foreground' };
      case 'medium':
        return { label: 'Limited Slots', color: 'bg-warning text-warning-foreground' };
      case 'low':
        return { label: 'Busy', color: 'bg-critical text-critical-foreground' };
    }
  };

  const availability = getAvailabilityConfig();

  const handleBookService = () => {
    if (!bookingData.service || !bookingData.date || !bookingData.time) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    addBooking({
      centerId: center.id,
      centerName: center.name,
      service: bookingData.service,
      date: bookingData.date,
      time: bookingData.time,
      notes: bookingData.notes,
    });

    toast({
      title: 'Booking Confirmed!',
      description: `Your appointment at ${center.name} has been scheduled for ${bookingData.date} at ${bookingData.time}`,
    });
    setBookingOpen(false);
    setBookingData({ service: '', date: '', time: '', notes: '' });
  };

  return (
    <>
      <div className="dashboard-card">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-semibold text-lg">{center.name}</h3>
            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-0.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>{center.address}</span>
            </div>
          </div>
          <Badge className={availability.color}>
            {availability.label}
          </Badge>
        </div>

        <div className="flex items-center gap-4 mb-4 text-sm">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 fill-warning text-warning" />
            <span className="font-medium">{center.rating}</span>
            <span className="text-muted-foreground">({center.reviews})</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Navigation className="w-4 h-4" />
            <span>{center.distance} mi</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-1.5 mb-4">
          {center.services.slice(0, 3).map((service) => (
            <span
              key={service}
              className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded text-xs"
            >
              {service}
            </span>
          ))}
          {center.services.length > 3 && (
            <span className="px-2 py-0.5 bg-secondary text-muted-foreground rounded text-xs">
              +{center.services.length - 3} more
            </span>
          )}
        </div>

        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{center.openHours}</span>
          </div>
          <div className="flex items-center gap-1">
            <Phone className="w-3.5 h-3.5" />
            <span>{center.phone}</span>
          </div>
        </div>

        {hasActiveBookingAtCenter ? (
          <Button 
            className="w-full" 
            variant="secondary"
            onClick={() => navigate('/dashboard/history')}
          >
            <Eye className="w-4 h-4 mr-2" />
            View Booking
          </Button>
        ) : (
          <Button 
            className="w-full" 
            onClick={() => setBookingOpen(true)}
          >
            Book Service
          </Button>
        )}
      </div>

      <Dialog open={bookingOpen} onOpenChange={setBookingOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Book Service</DialogTitle>
            <DialogDescription>
              Schedule an appointment at {center.name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Service Type *</Label>
              <Select 
                value={bookingData.service} 
                onValueChange={(v) => setBookingData({ ...bookingData, service: v })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a service" />
                </SelectTrigger>
                <SelectContent>
                  {center.services.map((service) => (
                    <SelectItem key={service} value={service}>
                      {service}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Date *</Label>
                <Input
                  type="date"
                  value={bookingData.date}
                  onChange={(e) => setBookingData({ ...bookingData, date: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <div className="space-y-2">
                <Label>Time *</Label>
                <Select 
                  value={bookingData.time} 
                  onValueChange={(v) => setBookingData({ ...bookingData, time: v })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="09:00">9:00 AM</SelectItem>
                    <SelectItem value="10:00">10:00 AM</SelectItem>
                    <SelectItem value="11:00">11:00 AM</SelectItem>
                    <SelectItem value="14:00">2:00 PM</SelectItem>
                    <SelectItem value="15:00">3:00 PM</SelectItem>
                    <SelectItem value="16:00">4:00 PM</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Additional Notes</Label>
              <Textarea
                placeholder="Describe any issues or special requests..."
                value={bookingData.notes}
                onChange={(e) => setBookingData({ ...bookingData, notes: e.target.value })}
                rows={3}
              />
            </div>
          </div>

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => setBookingOpen(false)}>
              Cancel
            </Button>
            <Button className="flex-1" onClick={handleBookService}>
              Confirm Booking
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

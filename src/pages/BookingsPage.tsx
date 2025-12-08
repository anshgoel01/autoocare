import { useState } from 'react';
import ServiceCenterLayout from '@/components/layouts/ServiceCenterLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { serviceBookings, technicians, getBookingStatusColor } from '@/data/mockData';
import { Search, Filter, Eye, Play, CheckCircle, XCircle, Clock, Calendar, User, Car } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

type BookingStatus = 'confirmed' | 'pending' | 'in-progress' | 'completed' | 'cancelled';

interface Booking {
  id: string;
  customer: string;
  email: string;
  phone: string;
  vehicle: string;
  registration: string;
  service: string;
  date: string;
  time: string;
  status: BookingStatus;
  technician: string | null;
  notes: string;
  estimatedDuration: number;
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(serviceBookings as Booking[]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = 
      booking.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    const today = '2024-12-07';
    const matchesDate = dateFilter === 'all' ||
      (dateFilter === 'today' && booking.date === today) ||
      (dateFilter === 'upcoming' && booking.date > today) ||
      (dateFilter === 'past' && booking.date < today);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const updateBookingStatus = (id: string, status: BookingStatus) => {
    setBookings(prev => prev.map(b => 
      b.id === id ? { ...b, status } : b
    ));
    toast({
      title: 'Status Updated',
      description: `Booking status changed to ${status}`,
    });
  };

  const handleStartService = (booking: Booking) => {
    updateBookingStatus(booking.id, 'in-progress');
  };

  const handleCompleteService = () => {
    if (selectedBooking) {
      updateBookingStatus(selectedBooking.id, 'completed');
      setCompletionDialogOpen(false);
      setCompletionNotes('');
      toast({
        title: 'Service Completed',
        description: `Service for ${selectedBooking.customer} has been marked as complete.`,
      });
    }
  };

  const handleCancelBooking = (booking: Booking) => {
    updateBookingStatus(booking.id, 'cancelled');
    toast({
      title: 'Booking Cancelled',
      description: `Booking for ${booking.customer} has been cancelled.`,
      variant: 'destructive',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return <CheckCircle className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      case 'in-progress': return <Play className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <XCircle className="w-4 h-4" />;
      default: return null;
    }
  };

  return (
    <ServiceCenterLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold mb-2">Service Bookings</h1>
          <p className="text-muted-foreground">Manage and track all service appointments</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search customer, vehicle, or service..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Calendar className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Dates" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Dates</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="upcoming">Upcoming</SelectItem>
              <SelectItem value="past">Past</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full sm:w-40">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in-progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Bookings Table */}
        <Card>
          <CardContent className="pt-6">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Customer</th>
                    <th className="pb-3 font-medium text-muted-foreground">Vehicle</th>
                    <th className="pb-3 font-medium text-muted-foreground">Service</th>
                    <th className="pb-3 font-medium text-muted-foreground">Date & Time</th>
                    <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    <th className="pb-3 font-medium text-muted-foreground">Technician</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map((booking) => (
                    <tr key={booking.id} className="border-b border-border/50 table-row-hover">
                      <td className="py-4">
                        <div>
                          <p className="font-medium">{booking.customer}</p>
                          <p className="text-xs text-muted-foreground">{booking.email}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <div>
                          <p className="text-sm">{booking.vehicle}</p>
                          <p className="text-xs text-muted-foreground">{booking.registration}</p>
                        </div>
                      </td>
                      <td className="py-4">
                        <p className="text-sm font-medium">{booking.service}</p>
                        <p className="text-xs text-muted-foreground">{booking.estimatedDuration} min</p>
                      </td>
                      <td className="py-4">
                        <p className="text-sm">{format(new Date(booking.date), 'MMM d, yyyy')}</p>
                        <p className="text-xs text-muted-foreground">{booking.time}</p>
                      </td>
                      <td className="py-4">
                        <Badge 
                          variant="outline" 
                          className={cn('flex items-center gap-1.5 w-fit', getBookingStatusColor(booking.status))}
                        >
                          {getStatusIcon(booking.status)}
                          {booking.status}
                        </Badge>
                      </td>
                      <td className="py-4">
                        {booking.technician ? (
                          <span className="text-sm">{booking.technician}</span>
                        ) : (
                          <span className="text-sm text-muted-foreground italic">Unassigned</span>
                        )}
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setSelectedBooking(booking)}
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </Button>
                          {booking.status === 'confirmed' && (
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleStartService(booking)}
                            >
                              <Play className="w-3.5 h-3.5 mr-1" />
                              Start
                            </Button>
                          )}
                          {booking.status === 'in-progress' && (
                            <Button 
                              variant="success" 
                              size="sm"
                              onClick={() => {
                                setSelectedBooking(booking);
                                setCompletionDialogOpen(true);
                              }}
                            >
                              <CheckCircle className="w-3.5 h-3.5 mr-1" />
                              Complete
                            </Button>
                          )}
                          {(booking.status === 'confirmed' || booking.status === 'pending') && (
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleCancelBooking(booking)}
                            >
                              <XCircle className="w-3.5 h-3.5" />
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* View Details Dialog */}
        <Dialog open={!!selectedBooking && !completionDialogOpen} onOpenChange={() => setSelectedBooking(null)}>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Booking Details</DialogTitle>
              <DialogDescription>Full information about this service appointment</DialogDescription>
            </DialogHeader>
            {selectedBooking && (
              <div className="space-y-4 py-4">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-secondary/50">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{selectedBooking.customer}</h3>
                    <p className="text-sm text-muted-foreground">{selectedBooking.email}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.phone}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Vehicle</p>
                    <p className="font-medium">{selectedBooking.vehicle}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.registration}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Service</p>
                    <p className="font-medium">{selectedBooking.service}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.estimatedDuration} min</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                    <p className="font-medium">{format(new Date(selectedBooking.date), 'MMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.time}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Technician</p>
                    <p className="font-medium">{selectedBooking.technician || 'Unassigned'}</p>
                    <Badge 
                      variant="outline" 
                      className={cn('mt-1', getBookingStatusColor(selectedBooking.status))}
                    >
                      {selectedBooking.status}
                    </Badge>
                  </div>
                </div>

                {selectedBooking.notes && (
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Notes</p>
                    <p className="text-sm">{selectedBooking.notes}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedBooking(null)}>
                    Close
                  </Button>
                  {selectedBooking.status === 'confirmed' && (
                    <Button className="flex-1" onClick={() => handleStartService(selectedBooking)}>
                      <Play className="w-4 h-4 mr-2" />
                      Start Service
                    </Button>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Completion Dialog */}
        <Dialog open={completionDialogOpen} onOpenChange={setCompletionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Complete Service</DialogTitle>
              <DialogDescription>
                Mark this service as completed for {selectedBooking?.customer}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Completion Notes</Label>
                <Textarea
                  placeholder="Add any notes about the completed service..."
                  value={completionNotes}
                  onChange={(e) => setCompletionNotes(e.target.value)}
                  rows={4}
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => setCompletionDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  variant="success" 
                  className="flex-1" 
                  onClick={handleCompleteService}
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Mark Complete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ServiceCenterLayout>
  );
}

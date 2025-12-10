import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import ServiceCenterLayout from '@/components/layouts/ServiceCenterLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useMyServiceCenter } from '@/hooks/useServiceCenters';
import { useServiceCenterBookings, Booking } from '@/hooks/useBookings';
import { Search, Filter, Eye, Play, CheckCircle, XCircle, Clock, Calendar, User, Car, Loader2, Phone, Mail, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

function getBookingStatusColor(status: string): string {
  switch (status) {
    case 'confirmed': return 'bg-success/10 text-success border-success/20';
    case 'pending': return 'bg-warning/10 text-warning border-warning/20';
    case 'in-progress': return 'bg-primary/10 text-primary border-primary/20';
    case 'completed': return 'bg-muted text-muted-foreground border-muted';
    case 'cancelled': return 'bg-destructive/10 text-destructive border-destructive/20';
    default: return 'bg-muted text-muted-foreground border-muted';
  }
}

export default function BookingsPage() {
  const location = useLocation();
  const { user } = useAuth();
  const { serviceCenter, isLoading: scLoading } = useMyServiceCenter(user?.id);
  const { bookings, isLoading: bookingsLoading, updateBookingStatus, refetch } = useServiceCenterBookings(serviceCenter?.id);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [completionNotes, setCompletionNotes] = useState('');
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  // Handle filter from navigation state
  useEffect(() => {
    const state = location.state as { filter?: string } | null;
    if (state?.filter) {
      if (state.filter === 'pending') {
        setStatusFilter('pending');
      } else if (state.filter === 'today') {
        setDateFilter('today');
      } else if (state.filter === 'completed') {
        setStatusFilter('completed');
      }
    }
  }, [location.state]);

  const today = format(new Date(), 'yyyy-MM-dd');

  const filteredBookings = bookings.filter(booking => {
    const customerName = booking.profile?.full_name || '';
    const vehicleInfo = booking.vehicle ? `${booking.vehicle.make} ${booking.vehicle.model}` : '';
    
    const matchesSearch = 
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      vehicleInfo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.service.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
    
    const matchesDate = dateFilter === 'all' ||
      (dateFilter === 'today' && booking.date === today) ||
      (dateFilter === 'upcoming' && booking.date > today) ||
      (dateFilter === 'past' && booking.date < today);
    
    return matchesSearch && matchesStatus && matchesDate;
  });

  const handleApproveBooking = async (booking: Booking) => {
    setIsUpdating(true);
    const { error } = await updateBookingStatus(booking.id, 'confirmed');
    setIsUpdating(false);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to approve booking. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Booking Approved',
        description: `Booking for ${booking.profile?.full_name || 'Customer'} has been confirmed.`,
      });
    }
  };

  const handleRejectBooking = async () => {
    if (!selectedBooking) return;
    
    setIsUpdating(true);
    const { error } = await updateBookingStatus(selectedBooking.id, 'cancelled');
    setIsUpdating(false);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to reject booking. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Booking Rejected',
        description: `Booking for ${selectedBooking.profile?.full_name || 'Customer'} has been cancelled.`,
        variant: 'destructive',
      });
      setRejectDialogOpen(false);
      setRejectReason('');
      setSelectedBooking(null);
    }
  };

  const handleStartService = async (booking: Booking) => {
    setIsUpdating(true);
    const { error } = await updateBookingStatus(booking.id, 'in-progress');
    setIsUpdating(false);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to start service. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Service Started',
        description: `Service for ${booking.profile?.full_name || 'Customer'} is now in progress.`,
      });
    }
  };

  const handleCompleteService = async () => {
    if (!selectedBooking) return;
    
    setIsUpdating(true);
    const { error } = await updateBookingStatus(selectedBooking.id, 'completed');
    setIsUpdating(false);
    
    if (error) {
      toast({
        title: 'Error',
        description: 'Failed to complete service. Please try again.',
        variant: 'destructive',
      });
    } else {
      toast({
        title: 'Service Completed',
        description: `Service for ${selectedBooking.profile?.full_name || 'Customer'} has been marked as complete.`,
      });
      setCompletionDialogOpen(false);
      setCompletionNotes('');
      setSelectedBooking(null);
    }
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

  const isLoading = scLoading || bookingsLoading;

  if (isLoading) {
    return (
      <ServiceCenterLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      </ServiceCenterLayout>
    );
  }

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

        {/* Bookings */}
        <Card>
          <CardContent className="pt-6">
            {filteredBookings.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">No bookings found</h3>
                <p className="text-muted-foreground">
                  {statusFilter === 'pending' 
                    ? 'No pending service requests at the moment.'
                    : 'No bookings match your current filters.'}
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Customer</th>
                      <th className="pb-3 font-medium text-muted-foreground">Vehicle</th>
                      <th className="pb-3 font-medium text-muted-foreground">Service</th>
                      <th className="pb-3 font-medium text-muted-foreground">Date & Time</th>
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                      <th className="pb-3 font-medium text-muted-foreground text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.map((booking) => (
                      <tr key={booking.id} className="border-b border-border/50 hover:bg-secondary/30 transition-colors">
                        <td className="py-4">
                          <div>
                            <p className="font-medium">{booking.profile?.full_name || 'Unknown Customer'}</p>
                            <p className="text-xs text-muted-foreground">{booking.profile?.phone || 'No phone'}</p>
                          </div>
                        </td>
                        <td className="py-4">
                          {booking.vehicle ? (
                            <div>
                              <p className="text-sm">{booking.vehicle.make} {booking.vehicle.model}</p>
                              <p className="text-xs text-muted-foreground">{booking.vehicle.registration_number}</p>
                            </div>
                          ) : (
                            <span className="text-sm text-muted-foreground italic">No vehicle</span>
                          )}
                        </td>
                        <td className="py-4">
                          <p className="text-sm font-medium">{booking.service}</p>
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
                        <td className="py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setSelectedBooking(booking)}
                            >
                              <Eye className="w-3.5 h-3.5" />
                            </Button>
                            {booking.status === 'pending' && (
                              <>
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => handleApproveBooking(booking)}
                                  disabled={isUpdating}
                                >
                                  <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setRejectDialogOpen(true);
                                  }}
                                  disabled={isUpdating}
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            )}
                            {booking.status === 'confirmed' && (
                              <>
                                <Button 
                                  variant="default" 
                                  size="sm"
                                  onClick={() => handleStartService(booking)}
                                  disabled={isUpdating}
                                >
                                  <Play className="w-3.5 h-3.5 mr-1" />
                                  Start
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm"
                                  onClick={() => {
                                    setSelectedBooking(booking);
                                    setRejectDialogOpen(true);
                                  }}
                                  disabled={isUpdating}
                                >
                                  <XCircle className="w-3.5 h-3.5" />
                                </Button>
                              </>
                            )}
                            {booking.status === 'in-progress' && (
                              <Button 
                                variant="default" 
                                size="sm"
                                className="bg-success hover:bg-success/90"
                                onClick={() => {
                                  setSelectedBooking(booking);
                                  setCompletionDialogOpen(true);
                                }}
                                disabled={isUpdating}
                              >
                                <CheckCircle className="w-3.5 h-3.5 mr-1" />
                                Complete
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Details Dialog */}
        <Dialog open={!!selectedBooking && !completionDialogOpen && !rejectDialogOpen} onOpenChange={() => setSelectedBooking(null)}>
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
                  <div className="flex-1">
                    <h3 className="font-semibold">{selectedBooking.profile?.full_name || 'Unknown Customer'}</h3>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      {selectedBooking.profile?.email && (
                        <span className="flex items-center gap-1">
                          <Mail className="w-3 h-3" />
                          {selectedBooking.profile.email}
                        </span>
                      )}
                      {selectedBooking.profile?.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {selectedBooking.profile.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Vehicle</p>
                    {selectedBooking.vehicle ? (
                      <>
                        <p className="font-medium">{selectedBooking.vehicle.make} {selectedBooking.vehicle.model}</p>
                        <p className="text-sm text-muted-foreground">{selectedBooking.vehicle.registration_number}</p>
                      </>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">No vehicle specified</p>
                    )}
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Service</p>
                    <p className="font-medium">{selectedBooking.service}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Date & Time</p>
                    <p className="font-medium">{format(new Date(selectedBooking.date), 'MMM d, yyyy')}</p>
                    <p className="text-sm text-muted-foreground">{selectedBooking.time}</p>
                  </div>
                  <div className="p-3 rounded-lg bg-secondary/50">
                    <p className="text-xs text-muted-foreground mb-1">Status</p>
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
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                      <FileText className="w-3 h-3" />
                      Customer Notes
                    </p>
                    <p className="text-sm">{selectedBooking.notes}</p>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => setSelectedBooking(null)}>
                    Close
                  </Button>
                  {selectedBooking.status === 'pending' && (
                    <Button className="flex-1" onClick={() => handleApproveBooking(selectedBooking)} disabled={isUpdating}>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                  )}
                  {selectedBooking.status === 'confirmed' && (
                    <Button className="flex-1" onClick={() => handleStartService(selectedBooking)} disabled={isUpdating}>
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
                Mark this service as completed for {selectedBooking?.profile?.full_name || 'Customer'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Completion Notes (Optional)</Label>
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
                  className="flex-1 bg-success hover:bg-success/90" 
                  onClick={handleCompleteService}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <CheckCircle className="w-4 h-4 mr-2" />
                  )}
                  Mark Complete
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Reject Dialog */}
        <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Reject Booking</DialogTitle>
              <DialogDescription>
                Are you sure you want to reject this booking for {selectedBooking?.profile?.full_name || 'Customer'}?
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Reason for Rejection (Optional)</Label>
                <Textarea
                  placeholder="Enter the reason for rejecting this booking..."
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => {
                    setRejectDialogOpen(false);
                    setRejectReason('');
                  }}
                >
                  Cancel
                </Button>
                <Button 
                  variant="destructive"
                  className="flex-1" 
                  onClick={handleRejectBooking}
                  disabled={isUpdating}
                >
                  {isUpdating ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <XCircle className="w-4 h-4 mr-2" />
                  )}
                  Reject Booking
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </ServiceCenterLayout>
  );
}

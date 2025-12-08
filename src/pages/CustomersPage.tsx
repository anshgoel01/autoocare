import { useState } from 'react';
import ServiceCenterLayout from '@/components/layouts/ServiceCenterLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { serviceBookings, getBookingStatusColor } from '@/data/mockData';
import { format, addDays, startOfWeek, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, User, Car, Clock, Phone, Mail } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function CustomersPage() {
  const [currentDate, setCurrentDate] = useState(new Date('2024-12-07'));
  
  const weekStart = startOfWeek(currentDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  const getBookingsForDay = (date: Date) => {
    const dateStr = format(date, 'yyyy-MM-dd');
    return serviceBookings.filter(b => b.date === dateStr);
  };

  const todayBookings = getBookingsForDay(currentDate);

  const navigateWeek = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => addDays(prev, direction === 'next' ? 7 : -7));
  };

  const getBookingDensity = (date: Date) => {
    const count = getBookingsForDay(date).length;
    if (count === 0) return 'bg-secondary';
    if (count <= 2) return 'bg-success/20';
    if (count <= 4) return 'bg-warning/20';
    return 'bg-critical/20';
  };

  return (
    <ServiceCenterLayout>
      <div className="space-y-6 animate-fade-in">
        <div>
          <h1 className="text-2xl font-bold mb-2">Expected Customers</h1>
          <p className="text-muted-foreground">View and manage upcoming customer appointments</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar View */}
          <Card className="lg:col-span-2">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Weekly Calendar</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" onClick={() => navigateWeek('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-[140px] text-center">
                  {format(weekStart, 'MMM d')} - {format(addDays(weekStart, 6), 'MMM d, yyyy')}
                </span>
                <Button variant="outline" size="icon" onClick={() => navigateWeek('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {weekDays.map((day, index) => {
                  const dayBookings = getBookingsForDay(day);
                  const isSelected = isSameDay(day, currentDate);
                  const isToday = isSameDay(day, new Date('2024-12-07'));
                  
                  return (
                    <button
                      key={index}
                      onClick={() => setCurrentDate(day)}
                      className={cn(
                        'calendar-day p-2 rounded-xl transition-all border-2',
                        isSelected 
                          ? 'border-primary bg-primary/5' 
                          : 'border-transparent hover:border-border',
                        getBookingDensity(day)
                      )}
                    >
                      <span className="text-xs text-muted-foreground">
                        {format(day, 'EEE')}
                      </span>
                      <span className={cn(
                        'text-lg font-semibold',
                        isToday && 'text-primary'
                      )}>
                        {format(day, 'd')}
                      </span>
                      {dayBookings.length > 0 && (
                        <Badge variant="secondary" className="mt-1 text-xs">
                          {dayBookings.length}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Day Schedule */}
              <div className="mt-6 space-y-3">
                <h3 className="font-semibold">
                  {format(currentDate, 'EEEE, MMMM d')} - {todayBookings.length} Appointments
                </h3>
                
                {todayBookings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No appointments scheduled for this day
                  </div>
                ) : (
                  <div className="space-y-2">
                    {todayBookings.sort((a, b) => a.time.localeCompare(b.time)).map((booking) => (
                      <div 
                        key={booking.id}
                        className="flex items-center justify-between p-3 rounded-xl bg-secondary/50 hover:bg-secondary transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="text-center min-w-[60px]">
                            <p className="text-sm font-semibold">{booking.time}</p>
                            <p className="text-xs text-muted-foreground">{booking.estimatedDuration}m</p>
                          </div>
                          <div className="h-8 w-px bg-border" />
                          <div>
                            <p className="font-medium">{booking.customer}</p>
                            <p className="text-sm text-muted-foreground">{booking.service}</p>
                          </div>
                        </div>
                        <Badge 
                          variant="outline" 
                          className={getBookingStatusColor(booking.status)}
                        >
                          {booking.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Today's Customer Cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">
              Today's Customers ({todayBookings.filter(b => (b.status as string) !== 'completed' && (b.status as string) !== 'cancelled').length})
            </h2>
            
            {todayBookings.filter(b => (b.status as string) !== 'completed' && (b.status as string) !== 'cancelled').length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center text-muted-foreground">
                  No active customers for today
                </CardContent>
              </Card>
            ) : (
              todayBookings
                .filter(b => (b.status as string) !== 'completed' && (b.status as string) !== 'cancelled')
                .sort((a, b) => a.time.localeCompare(b.time))
                .map((booking) => (
                  <Card key={booking.id} className="overflow-hidden">
                    <div className={cn(
                      'h-1',
                      (booking.status as string) === 'in-progress' && 'bg-primary',
                      (booking.status as string) === 'confirmed' && 'bg-success',
                      (booking.status as string) === 'pending' && 'bg-warning'
                    )} />
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <User className="w-5 h-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-semibold">{booking.customer}</p>
                            <Badge 
                              variant="outline" 
                              className={cn('text-xs', getBookingStatusColor(booking.status))}
                            >
                              {booking.status}
                            </Badge>
                          </div>
                        </div>
                        <span className="text-sm font-medium">{booking.time}</span>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Car className="w-4 h-4" />
                          <span>{booking.vehicle}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Clock className="w-4 h-4" />
                          <span>{booking.service} ({booking.estimatedDuration} min)</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="w-4 h-4" />
                          <span>{booking.phone}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="w-4 h-4" />
                          <span className="truncate">{booking.email}</span>
                        </div>
                      </div>

                      {booking.notes && (
                        <div className="mt-3 p-2 rounded-lg bg-secondary/50 text-sm">
                          <span className="text-muted-foreground">Notes: </span>
                          {booking.notes}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))
            )}
          </div>
        </div>
      </div>
    </ServiceCenterLayout>
  );
}

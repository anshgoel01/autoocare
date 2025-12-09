import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useMyServiceCenter } from '@/hooks/useServiceCenters';
import { useServiceCenterBookings } from '@/hooks/useBookings';
import { useInventory, getInventoryStatus } from '@/hooks/useInventory';
import ServiceCenterLayout from '@/components/layouts/ServiceCenterLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CalendarDays, 
  Package, 
  Users, 
  AlertTriangle,
  Clock,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { format } from 'date-fns';

function getBookingStatusColor(status: string): string {
  switch (status) {
    case 'confirmed': return 'bg-success/10 text-success border-success/20';
    case 'pending': return 'bg-warning/10 text-warning border-warning/20';
    case 'in-progress': return 'bg-primary/10 text-primary border-primary/20';
    case 'completed': return 'bg-muted text-muted-foreground border-muted';
    default: return 'bg-muted text-muted-foreground border-muted';
  }
}

export default function ServiceCenterDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { serviceCenter, isLoading: scLoading } = useMyServiceCenter(user?.id);
  const { bookings, isLoading: bookingsLoading } = useServiceCenterBookings(serviceCenter?.id);
  const { inventory, lowStockItems, isLoading: invLoading } = useInventory(serviceCenter?.id);

  const today = format(new Date(), 'yyyy-MM-dd');
  const todayBookings = bookings.filter(b => b.date === today);
  const pendingBookings = bookings.filter(b => b.status === 'pending');
  const completedToday = bookings.filter(b => b.date === today && b.status === 'completed');

  const isLoading = scLoading || bookingsLoading || invLoading;

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
        {/* Welcome Banner */}
        <div className="gradient-accent rounded-2xl p-6 text-accent-foreground">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                {serviceCenter?.name || 'Service Center'} Dashboard
              </h1>
              <p className="text-accent-foreground/80">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge className="bg-white/20 text-white border-0 px-4 py-1.5">
                <Clock className="w-4 h-4 mr-2" />
                {todayBookings.length} appointments today
              </Badge>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Today's Bookings</p>
                  <p className="text-3xl font-bold">{todayBookings.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-primary/10">
                  <CalendarDays className="w-6 h-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Pending Approval</p>
                  <p className="text-3xl font-bold">{pendingBookings.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-warning/10">
                  <Clock className="w-6 h-6 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Low Stock Items</p>
                  <p className="text-3xl font-bold">{lowStockItems.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-critical/10">
                  <Package className="w-6 h-6 text-critical" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Completed Today</p>
                  <p className="text-3xl font-bold">{completedToday.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-success/10">
                  <CheckCircle className="w-6 h-6 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Today's Appointments */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Today's Appointments</CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/service-center-dashboard/bookings')}>View All</Button>
            </CardHeader>
            <CardContent>
              {todayBookings.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No appointments today</p>
              ) : (
                <div className="space-y-3">
                  {todayBookings.slice(0, 4).map((booking) => (
                    <div 
                      key={booking.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                          <Users className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium">{booking.profile?.full_name || 'Customer'}</p>
                          <p className="text-sm text-muted-foreground">{booking.service}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{booking.time}</p>
                        <Badge variant="outline" className={getBookingStatusColor(booking.status)}>
                          {booking.status}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Low Stock Alerts */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Inventory Alerts
              </CardTitle>
              <Button variant="outline" size="sm" onClick={() => navigate('/service-center-dashboard/inventory')}>Manage Inventory</Button>
            </CardHeader>
            <CardContent>
              {lowStockItems.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">All items are well stocked</p>
              ) : (
                <div className="space-y-3">
                  {lowStockItems.map((item) => {
                    const status = getInventoryStatus(item.quantity, item.min_stock);
                    return (
                      <div 
                        key={item.id}
                        className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                      >
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">SKU: {item.sku || 'N/A'}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm">
                            <span className={status === 'out-of-stock' ? 'text-critical font-semibold' : 'text-warning font-semibold'}>
                              {item.quantity}
                            </span>
                            <span className="text-muted-foreground"> / {item.min_stock} min</span>
                          </p>
                          <Badge className={status === 'out-of-stock' ? 'bg-critical/10 text-critical' : 'bg-warning/10 text-warning'}>
                            {status === 'out-of-stock' ? 'Out of Stock' : 'Low Stock'}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ServiceCenterLayout>
  );
}
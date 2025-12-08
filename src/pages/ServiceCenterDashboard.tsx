import { useNavigate } from 'react-router-dom';
import ServiceCenterLayout from '@/components/layouts/ServiceCenterLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  serviceBookings, 
  inventoryItems, 
  technicians,
  getInventoryStatus,
  getBookingStatusColor 
} from '@/data/mockData';
import { 
  CalendarDays, 
  Package, 
  Users, 
  AlertTriangle,
  Clock,
  DollarSign,
  TrendingUp,
  CheckCircle,
} from 'lucide-react';
import { format } from 'date-fns';

export default function ServiceCenterDashboard() {
  const navigate = useNavigate();
  const todayBookings = serviceBookings.filter(b => b.date === '2024-12-07');
  const pendingBookings = serviceBookings.filter(b => b.status === 'pending');
  const lowStockItems = inventoryItems.filter(i => getInventoryStatus(i.stock, i.minStock) !== 'in-stock');
  const completedToday = serviceBookings.filter(b => b.date === '2024-12-07' && b.status === 'completed');

  return (
    <ServiceCenterLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Banner */}
        <div className="gradient-accent rounded-2xl p-6 text-accent-foreground">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Service Center Dashboard
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
                        <p className="font-medium">{booking.customer}</p>
                        <p className="text-sm text-muted-foreground">{booking.service}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">{booking.time}</p>
                      <Badge 
                        variant="outline" 
                        className={getBookingStatusColor(booking.status)}
                      >
                        {booking.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
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
              <div className="space-y-3">
                {lowStockItems.map((item) => {
                  const status = getInventoryStatus(item.stock, item.minStock);
                  return (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-secondary/50"
                    >
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-muted-foreground">SKU: {item.sku}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm">
                          <span className={status === 'out-of-stock' ? 'text-critical font-semibold' : 'text-warning font-semibold'}>
                            {item.stock}
                          </span>
                          <span className="text-muted-foreground"> / {item.minStock} min</span>
                        </p>
                        <Badge 
                          className={status === 'out-of-stock' 
                            ? 'inventory-status-out-of-stock' 
                            : 'inventory-status-low-stock'
                          }
                        >
                          {status === 'out-of-stock' ? 'Out of Stock' : 'Low Stock'}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Technicians */}
        <Card>
          <CardHeader>
            <CardTitle>Technician Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {technicians.map((tech) => (
                <div 
                  key={tech.id}
                  className="p-4 rounded-xl bg-secondary/50 flex items-center gap-3"
                >
                  <div className="relative">
                    <img 
                      src={tech.avatar} 
                      alt={tech.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <span 
                      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${
                        tech.available ? 'bg-success' : 'bg-muted-foreground'
                      }`}
                    />
                  </div>
                  <div>
                    <p className="font-medium">{tech.name}</p>
                    <p className="text-xs text-muted-foreground">{tech.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </ServiceCenterLayout>
  );
}

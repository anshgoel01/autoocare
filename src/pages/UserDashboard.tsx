import { useNavigate } from 'react-router-dom';
import HealthScoreMeter from '@/components/dashboard/HealthScoreMeter';
import ComponentHealthBar from '@/components/dashboard/ComponentHealthBar';
import TelemetryGauge from '@/components/dashboard/TelemetryGauge';
import PredictionCard from '@/components/dashboard/PredictionCard';
import ServiceCenterCard from '@/components/dashboard/ServiceCenterCard';
import FailureRiskCard from '@/components/dashboard/FailureRiskCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  vehicleHealth, 
  telemetryData, 
  mlPredictions,
  mlFeatures,
} from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';
import { useServiceCenters } from '@/hooks/useServiceCenters';
import { useUserBookings } from '@/hooks/useBookings';
import { useMyVehicle } from '@/hooks/useVehicles';
import { usePrediction } from '@/hooks/usePrediction';
import { 
  Thermometer, 
  Battery, 
  Gauge, 
  CircleDot,
  Calendar,
  AlertTriangle,
  Droplets,
  Wind,
  Eye,
  Car,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function UserDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { serviceCenters } = useServiceCenters();
  const { bookings, hasActiveBooking, nextBooking } = useUserBookings();
  const { vehicle: primaryVehicle } = useMyVehicle();
  const { predict, isLoading: isPredicting, result: predictionResult } = usePrediction();
  
  const userName = user?.name || user?.profile?.full_name || 'User';
  const firstName = userName.split(' ')[0];
  
  const daysUntilService = differenceInDays(
    new Date(vehicleHealth.nextServiceDate), 
    new Date()
  );

  const handleCheckHealth = async () => {
    // Map current telemetry to ML model input features
    // In a real app, these would come from actual vehicle sensors
    await predict(mlFeatures);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Banner */}
        <div className="gradient-primary rounded-2xl p-6 text-primary-foreground">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Welcome back, {firstName}!
              </h1>
              {primaryVehicle ? (
                <p className="text-primary-foreground/80">
                  Your {primaryVehicle.make} {primaryVehicle.model} • {primaryVehicle.registration_number}
                </p>
              ) : (
                <p className="text-primary-foreground/80 flex items-center gap-2">
                  <Car className="w-4 h-4" />
                  No vehicle registered yet
                </p>
              )}
            </div>
            <div className="flex items-center gap-3">
              {hasActiveBooking && nextBooking ? (
                <>
                  <div className="text-right">
                    <p className="text-sm text-primary-foreground/70">Upcoming Service</p>
                    <p className="font-semibold">{format(new Date(nextBooking.date), 'MMM d')} at {nextBooking.time}</p>
                  </div>
                  <Button 
                    variant="secondary" 
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                    onClick={() => navigate('/dashboard/history')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Booking
                  </Button>
                </>
              ) : (
                <>
                  <div className="text-right">
                    <p className="text-sm text-primary-foreground/70">Next Service</p>
                    <p className="font-semibold">{daysUntilService} days</p>
                  </div>
                  <Button 
                    variant="secondary" 
                    className="bg-white/20 hover:bg-white/30 text-white border-0"
                    onClick={() => navigate('/dashboard/service-centers')}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Now
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
        {/* Main Grid - Optimized for full width */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Health Score Card */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Vehicle Health
                <Badge variant="outline" className="font-normal">
                  Updated 5 min ago
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-center">
                <HealthScoreMeter score={vehicleHealth.overallScore} />
              </div>
              
              <div className="space-y-3">
                {vehicleHealth.components.map((component) => (
                  <ComponentHealthBar
                    key={component.name}
                    name={component.name}
                    health={component.health}
                    status={component.status}
                  />
                ))}
              </div>
            </CardContent>
          </Card>

          {/* ML Failure Prediction Card */}
          <FailureRiskCard
            result={predictionResult}
            isLoading={isPredicting}
            onCheckHealth={handleCheckHealth}
          />
        </div>

        {/* Telemetry Gauges - Full Width */}
        <div>
          <h2 className="text-lg font-semibold mb-4">Real-time Telemetry</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            <TelemetryGauge
              label="Engine Temp"
              value={telemetryData.engineTemp.value}
              unit={telemetryData.engineTemp.unit}
              min={telemetryData.engineTemp.min}
              max={telemetryData.engineTemp.max}
              optimal={telemetryData.engineTemp.optimal}
              icon={<Thermometer className="w-4 h-4" />}
            />
            <TelemetryGauge
              label="Battery"
              value={telemetryData.batteryVoltage.value}
              unit={telemetryData.batteryVoltage.unit}
              min={telemetryData.batteryVoltage.min}
              max={telemetryData.batteryVoltage.max}
              optimal={telemetryData.batteryVoltage.optimal}
              icon={<Battery className="w-4 h-4" />}
            />
            <TelemetryGauge
              label="Tire Pressure"
              value={telemetryData.tirePressure.value}
              unit={telemetryData.tirePressure.unit}
              min={telemetryData.tirePressure.min}
              max={telemetryData.tirePressure.max}
              optimal={telemetryData.tirePressure.optimal}
              icon={<Gauge className="w-4 h-4" />}
            />
            <TelemetryGauge
              label="Brake Thickness"
              value={telemetryData.brakeThickness.value}
              unit={telemetryData.brakeThickness.unit}
              min={telemetryData.brakeThickness.min}
              max={telemetryData.brakeThickness.max}
              optimal={telemetryData.brakeThickness.optimal}
              icon={<CircleDot className="w-4 h-4" />}
            />
            <TelemetryGauge
              label="Oil Level"
              value={telemetryData.oilLevel.value}
              unit={telemetryData.oilLevel.unit}
              min={telemetryData.oilLevel.min}
              max={telemetryData.oilLevel.max}
              optimal={telemetryData.oilLevel.optimal}
              icon={<Droplets className="w-4 h-4" />}
            />
            <TelemetryGauge
              label="Coolant"
              value={telemetryData.coolantLevel.value}
              unit={telemetryData.coolantLevel.unit}
              min={telemetryData.coolantLevel.min}
              max={telemetryData.coolantLevel.max}
              optimal={telemetryData.coolantLevel.optimal}
              icon={<Wind className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* ML Predictions - Full Width */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-warning" />
              Predictive Alerts
            </h2>
            <Badge variant="outline" className="font-normal">
              {mlPredictions.length} Active
            </Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
            {mlPredictions.map((prediction) => (
              <PredictionCard
                key={prediction.id}
                component={prediction.component}
                severity={prediction.severity}
                message={prediction.message}
                predictedDate={prediction.predictedDate}
                confidence={prediction.confidence}
              />
            ))}
          </div>
        </div>

        {/* Service Centers - Responsive Full Width */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Nearby Service Centers</h2>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/service-centers')}>View All</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {serviceCenters.slice(0, 4).map((center) => (
              <ServiceCenterCard key={center.id} center={center} />
            ))}
          </div>
        </div>

        {/* Service History - Using Real Bookings */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Service History</CardTitle>
            <Button variant="outline" size="sm" onClick={() => navigate('/dashboard/history')}>
              View All
            </Button>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              {bookings.filter(b => b.status === 'completed').length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No completed services yet</p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border text-left">
                      <th className="pb-3 font-medium text-muted-foreground">Date</th>
                      <th className="pb-3 font-medium text-muted-foreground">Service</th>
                      <th className="pb-3 font-medium text-muted-foreground">Center</th>
                      <th className="pb-3 font-medium text-muted-foreground">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings
                      .filter(b => b.status === 'completed')
                      .slice(0, 5)
                      .map((booking) => (
                        <tr key={booking.id} className="border-b border-border/50 table-row-hover">
                          <td className="py-3 text-sm">
                            {format(new Date(booking.date), 'MMM d, yyyy')}
                          </td>
                          <td className="py-3 text-sm font-medium">{booking.service}</td>
                          <td className="py-3 text-sm text-muted-foreground">
                            {booking.service_center?.name || 'Service Center'}
                          </td>
                          <td className="py-3 text-sm">
                            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
                              Completed
                            </Badge>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

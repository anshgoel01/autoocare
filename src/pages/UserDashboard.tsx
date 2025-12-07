import { useState } from 'react';
import HealthScoreMeter from '@/components/dashboard/HealthScoreMeter';
import ComponentHealthBar from '@/components/dashboard/ComponentHealthBar';
import TelemetryGauge from '@/components/dashboard/TelemetryGauge';
import PredictionCard from '@/components/dashboard/PredictionCard';
import ServiceCenterCard from '@/components/dashboard/ServiceCenterCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  vehicleHealth, 
  telemetryData, 
  mlPredictions, 
  serviceCenters, 
  serviceHistory,
  userProfile,
} from '@/data/mockData';
import { 
  Thermometer, 
  Battery, 
  Gauge, 
  CircleDot,
  Calendar,
  AlertTriangle,
  Droplets,
  Wind,
} from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import DashboardLayout from '@/components/layouts/DashboardLayout';

export default function UserDashboard() {
  const daysUntilService = differenceInDays(
    new Date(vehicleHealth.nextServiceDate), 
    new Date()
  );

  return (
    <DashboardLayout>
      <div className="space-y-6 animate-fade-in">
        {/* Welcome Banner */}
        <div className="gradient-primary rounded-2xl p-6 text-primary-foreground">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Welcome back, {userProfile.name.split(' ')[0]}!
              </h1>
              <p className="text-primary-foreground/80">
                Your {userProfile.vehicle.year} {userProfile.vehicle.make} {userProfile.vehicle.model}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-primary-foreground/70">Next Service</p>
                <p className="font-semibold">{daysUntilService} days</p>
              </div>
              <Button variant="secondary" className="bg-white/20 hover:bg-white/30 text-white border-0">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule Now
              </Button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Health Score Card */}
          <Card className="lg:row-span-2">
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

          {/* Telemetry Gauges */}
          <div className="lg:col-span-2">
            <h2 className="text-lg font-semibold mb-4">Real-time Telemetry</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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

          {/* ML Predictions */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-warning" />
                Predictive Alerts
              </h2>
              <Badge variant="outline" className="font-normal">
                {mlPredictions.length} Active
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        {/* Service Centers */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Nearby Service Centers</h2>
            <Button variant="outline" size="sm">View Map</Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {serviceCenters.map((center) => (
              <ServiceCenterCard key={center.id} center={center} />
            ))}
          </div>
        </div>

        {/* Service History */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Service History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border text-left">
                    <th className="pb-3 font-medium text-muted-foreground">Date</th>
                    <th className="pb-3 font-medium text-muted-foreground">Service</th>
                    <th className="pb-3 font-medium text-muted-foreground">Center</th>
                    <th className="pb-3 font-medium text-muted-foreground">Technician</th>
                    <th className="pb-3 font-medium text-muted-foreground text-right">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {serviceHistory.map((service) => (
                    <tr key={service.id} className="border-b border-border/50 table-row-hover">
                      <td className="py-3 text-sm">
                        {format(new Date(service.date), 'MMM d, yyyy')}
                      </td>
                      <td className="py-3 text-sm font-medium">{service.service}</td>
                      <td className="py-3 text-sm text-muted-foreground">{service.center}</td>
                      <td className="py-3 text-sm text-muted-foreground">{service.technician}</td>
                      <td className="py-3 text-sm text-right font-medium">
                        {service.cost === 0 ? 'Free' : `$${service.cost.toFixed(2)}`}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}

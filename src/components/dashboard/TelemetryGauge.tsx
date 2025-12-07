import { cn } from '@/lib/utils';

interface TelemetryGaugeProps {
  label: string;
  value: number;
  unit: string;
  min: number;
  max: number;
  optimal: { min: number; max: number };
  icon: React.ReactNode;
}

export default function TelemetryGauge({ 
  label, 
  value, 
  unit, 
  min, 
  max, 
  optimal, 
  icon 
}: TelemetryGaugeProps) {
  const percentage = ((value - min) / (max - min)) * 100;
  
  const getStatus = () => {
    if (value >= optimal.min && value <= optimal.max) return 'normal';
    if (value < optimal.min * 0.8 || value > optimal.max * 1.2) return 'critical';
    return 'warning';
  };

  const status = getStatus();

  const getStatusColor = () => {
    switch (status) {
      case 'normal': return 'text-success';
      case 'warning': return 'text-warning';
      case 'critical': return 'text-critical';
    }
  };

  const getBarColor = () => {
    switch (status) {
      case 'normal': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'critical': return 'bg-critical';
    }
  };

  const getGlow = () => {
    switch (status) {
      case 'normal': return 'shadow-glow-success';
      case 'warning': return '';
      case 'critical': return 'shadow-glow-critical';
    }
  };

  return (
    <div className={cn(
      'dashboard-card p-4 relative overflow-hidden',
      status === 'critical' && 'border-critical/30'
    )}>
      {/* Background glow for critical status */}
      {status === 'critical' && (
        <div className="absolute inset-0 bg-critical/5 animate-pulse" />
      )}
      
      <div className="relative">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center',
              status === 'normal' && 'bg-success/10 text-success',
              status === 'warning' && 'bg-warning/10 text-warning',
              status === 'critical' && 'bg-critical/10 text-critical'
            )}>
              {icon}
            </div>
            <span className="text-sm text-muted-foreground">{label}</span>
          </div>
        </div>

        <div className="flex items-baseline gap-1">
          <span className={cn('telemetry-value', getStatusColor())}>
            {value.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">{unit}</span>
        </div>

        <div className="mt-3 space-y-1.5">
          <div className="h-1.5 rounded-full bg-muted overflow-hidden">
            <div 
              className={cn(
                'h-full rounded-full transition-all duration-500',
                getBarColor(),
                getGlow()
              )}
              style={{ width: `${Math.min(Math.max(percentage, 0), 100)}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>{min}{unit}</span>
            <span className="text-muted-foreground/60">
              Optimal: {optimal.min}-{optimal.max}
            </span>
            <span>{max}{unit}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

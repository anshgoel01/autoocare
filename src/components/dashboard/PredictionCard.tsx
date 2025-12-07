import { cn } from '@/lib/utils';
import { AlertTriangle, AlertCircle, Info, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface PredictionCardProps {
  component: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  message: string;
  predictedDate: string;
  confidence: number;
}

export default function PredictionCard({ 
  component, 
  severity, 
  message, 
  predictedDate, 
  confidence 
}: PredictionCardProps) {
  const getSeverityConfig = () => {
    switch (severity) {
      case 'critical':
        return {
          icon: AlertTriangle,
          bg: 'bg-critical/10',
          border: 'border-critical/20',
          text: 'text-critical',
          badge: 'status-critical',
        };
      case 'high':
        return {
          icon: AlertCircle,
          bg: 'bg-warning/10',
          border: 'border-warning/20',
          text: 'text-warning',
          badge: 'status-warning',
        };
      case 'medium':
        return {
          icon: Info,
          bg: 'bg-primary/10',
          border: 'border-primary/20',
          text: 'text-primary',
          badge: 'status-info',
        };
      case 'low':
        return {
          icon: Clock,
          bg: 'bg-success/10',
          border: 'border-success/20',
          text: 'text-success',
          badge: 'status-success',
        };
    }
  };

  const config = getSeverityConfig();
  const Icon = config.icon;

  return (
    <div className={cn(
      'p-4 rounded-xl border',
      config.bg,
      config.border,
      severity === 'critical' && 'animate-pulse'
    )}>
      <div className="flex items-start gap-3">
        <div className={cn('p-2 rounded-lg', config.bg)}>
          <Icon className={cn('w-5 h-5', config.text)} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold">{component}</h4>
            <span className={cn('status-badge', config.badge)}>
              {severity}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mb-2">{message}</p>
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">
              Predicted: {format(new Date(predictedDate), 'MMM d, yyyy')}
            </span>
            <span className={cn('font-medium', config.text)}>
              {confidence}% confidence
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

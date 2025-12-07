import { cn } from '@/lib/utils';

interface ComponentHealthBarProps {
  name: string;
  health: number;
  status: 'good' | 'warning' | 'critical';
}

export default function ComponentHealthBar({ name, health, status }: ComponentHealthBarProps) {
  const getStatusColor = () => {
    switch (status) {
      case 'good': return 'bg-success';
      case 'warning': return 'bg-warning';
      case 'critical': return 'bg-critical';
    }
  };

  const getStatusBg = () => {
    switch (status) {
      case 'good': return 'bg-success/10';
      case 'warning': return 'bg-warning/10';
      case 'critical': return 'bg-critical/10';
    }
  };

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">{name}</span>
        <span className={cn(
          'text-sm font-semibold tabular-nums',
          status === 'good' && 'text-success',
          status === 'warning' && 'text-warning',
          status === 'critical' && 'text-critical'
        )}>
          {health}%
        </span>
      </div>
      <div className={cn('h-2 rounded-full overflow-hidden', getStatusBg())}>
        <div
          className={cn(
            'h-full rounded-full transition-all duration-700 ease-out',
            getStatusColor()
          )}
          style={{ width: `${health}%` }}
        />
      </div>
    </div>
  );
}

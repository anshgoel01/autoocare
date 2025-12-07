import { cn } from '@/lib/utils';

interface HealthScoreMeterProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
}

export default function HealthScoreMeter({ score, size = 'lg' }: HealthScoreMeterProps) {
  const getColor = () => {
    if (score >= 80) return { stroke: 'stroke-success', text: 'text-success', label: 'Excellent' };
    if (score >= 60) return { stroke: 'stroke-warning', text: 'text-warning', label: 'Good' };
    return { stroke: 'stroke-critical', text: 'text-critical', label: 'Needs Attention' };
  };

  const { stroke, text, label } = getColor();
  
  const dimensions = {
    sm: { size: 120, strokeWidth: 8, textSize: 'text-2xl' },
    md: { size: 160, strokeWidth: 10, textSize: 'text-3xl' },
    lg: { size: 200, strokeWidth: 12, textSize: 'text-4xl' },
  };

  const { size: svgSize, strokeWidth, textSize } = dimensions[size];
  const radius = (svgSize - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={svgSize}
        height={svgSize}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gauge-background"
        />
        {/* Progress circle */}
        <circle
          cx={svgSize / 2}
          cy={svgSize / 2}
          r={radius}
          fill="none"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className={cn('gauge-ring transition-all duration-1000 ease-out', stroke)}
          style={{
            filter: score >= 80 
              ? 'drop-shadow(0 0 8px hsl(var(--success) / 0.4))' 
              : score >= 60 
                ? 'drop-shadow(0 0 8px hsl(var(--warning) / 0.4))'
                : 'drop-shadow(0 0 8px hsl(var(--critical) / 0.4))'
          }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className={cn('font-bold tabular-nums', textSize, text)}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground uppercase tracking-wide">
          {label}
        </span>
      </div>
    </div>
  );
}

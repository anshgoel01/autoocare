import { Button } from '@/components/ui/button';
import { Calendar, Activity, MapPin } from 'lucide-react';

interface QuickActionsProps {
  onAction: (action: string) => void;
  suggestions?: string[];
  disabled?: boolean;
}

const defaultActions = [
  { label: 'Book Service', icon: Calendar, message: 'I want to book a service for my vehicle' },
  { label: 'Check Health', icon: Activity, message: 'Check the health status of my vehicle' },
  { label: 'Find Center', icon: MapPin, message: 'Find a service center near me' },
];

export function QuickActions({ onAction, suggestions, disabled }: QuickActionsProps) {
  // Use suggestions from API or fall back to default actions
  const actions = suggestions?.length
    ? suggestions.map((s, i) => ({
        label: s,
        icon: defaultActions[i % defaultActions.length]?.icon || Calendar,
        message: s,
      }))
    : defaultActions;

  return (
    <div className="flex flex-wrap gap-2 p-3 border-t border-border bg-background/50">
      {actions.slice(0, 3).map((action, index) => {
        const Icon = action.icon;
        return (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onAction(action.message)}
            disabled={disabled}
            className="text-xs h-8 gap-1.5"
          >
            <Icon className="w-3 h-3" />
            {action.label}
          </Button>
        );
      })}
    </div>
  );
}

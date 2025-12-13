import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatButtonProps {
  onClick: () => void;
  unreadCount: number;
  isOpen: boolean;
}

export function ChatButton({ onClick, unreadCount, isOpen }: ChatButtonProps) {
  if (isOpen) return null;

  return (
    <Button
      onClick={onClick}
      size="lg"
      className={cn(
        'fixed bottom-4 right-4 z-50',
        'w-14 h-14 rounded-full shadow-lg',
        'bg-primary hover:bg-primary/90 text-primary-foreground',
        'transition-all duration-300 hover:scale-105',
        'animate-in fade-in-0 zoom-in-95 duration-300'
      )}
    >
      <MessageCircle className="w-6 h-6" />
      
      {unreadCount > 0 && (
        <span
          className={cn(
            'absolute -top-1 -right-1',
            'min-w-[20px] h-5 px-1.5',
            'bg-destructive text-destructive-foreground',
            'rounded-full text-xs font-bold',
            'flex items-center justify-center',
            'animate-in zoom-in-50 duration-200'
          )}
        >
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </Button>
  );
}

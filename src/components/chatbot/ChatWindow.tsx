import { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { X, Trash2, Bot } from 'lucide-react';
import { ChatMessage } from './ChatMessage';
import { TypingIndicator } from './TypingIndicator';
import { QuickActions } from './QuickActions';
import { ChatInput } from './ChatInput';
import { ChatMessage as ChatMessageType } from '@/services/chatbotApi';
import { cn } from '@/lib/utils';
interface ChatWindowProps {
  messages: ChatMessageType[];
  isTyping: boolean;
  isLoading: boolean;
  suggestions: string[];
  onSendMessage: (message: string) => void;
  onClearHistory: () => void;
  onMinimize: () => void;
  onClose: () => void;
}
export function ChatWindow({
  messages,
  isTyping,
  isLoading,
  suggestions,
  onSendMessage,
  onClearHistory,
  onMinimize,
  onClose
}: ChatWindowProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth'
    });
  }, [messages, isTyping]);
  return <div className={cn('fixed bottom-20 right-4 z-50', 'w-[360px] max-w-[calc(100vw-2rem)]', 'h-[500px] max-h-[calc(100vh-8rem)]', 'bg-background border border-border rounded-xl shadow-2xl', 'flex flex-col overflow-hidden', 'animate-in fade-in-0 slide-in-from-bottom-4 duration-300')}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-border bg-primary text-primary-foreground rounded-t-xl">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-foreground/20 flex items-center justify-center">
            <Bot className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-sm">AutoCare Assistant</h3>
            <p className="text-xs opacity-80">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" onClick={onClearHistory} className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" title="Clear conversation">
            <Trash2 className="w-4 h-4" />
          </Button>
          
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/20" title="Close">
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        {messages.length === 0 ? <div className="flex flex-col items-center justify-center h-full text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-primary" />
            </div>
            <h4 className="font-semibold text-foreground mb-2">Welcome to AutoCare!</h4>
            <p className="text-sm text-muted-foreground max-w-[250px]">
              I am here to help you with vehicle services, bookings, and more. How can I assist you today?
            </p>
          </div> : <>
            {messages.map(message => <ChatMessage key={message.id} message={message} />)}
            {isTyping && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>}
      </ScrollArea>

      {/* Quick Actions */}
      {messages.length === 0 && <QuickActions onAction={onSendMessage} suggestions={suggestions} disabled={isLoading} />}

      {/* Input */}
      <ChatInput onSend={onSendMessage} disabled={isLoading} />
    </div>;
}
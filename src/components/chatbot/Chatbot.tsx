import { useChatbot } from '@/hooks/useChatbot';
import { ChatButton } from './ChatButton';
import { ChatWindow } from './ChatWindow';

export function Chatbot() {
  const {
    messages,
    isLoading,
    isTyping,
    suggestions,
    unreadCount,
    isOpen,
    sendMessage,
    clearHistory,
    toggleChat,
    closeChat,
  } = useChatbot();

  return (
    <>
      <ChatButton
        onClick={toggleChat}
        unreadCount={unreadCount}
        isOpen={isOpen}
      />
      
      {isOpen && (
        <ChatWindow
          messages={messages}
          isTyping={isTyping}
          isLoading={isLoading}
          suggestions={suggestions}
          onSendMessage={sendMessage}
          onClearHistory={clearHistory}
          onMinimize={closeChat}
          onClose={closeChat}
        />
      )}
    </>
  );
}

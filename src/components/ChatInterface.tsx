import React, { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import StreamingText from './StreamingText';
import dffLogo from '@/assets/dff-logo.png';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  isStreaming?: boolean;
}

interface ChatInterfaceProps {
  webhookUrl?: string;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ 
  webhookUrl = "https://your-webhook-url.com/webhook" 
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
        id: '1',
        text: 'Hello! I\'m ilham, Dubai Future Foundation\'s AI assistant. How can I help you today?',
        isUser: false,
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
    };

    setMessages(prev => [...prev, userMessage]);
    const currentInput = inputValue;
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: currentInput }),
      });

      const data = await response.json();
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.output || 'Sorry, I couldn\'t process your request at the moment.',
        isUser: false,
        isStreaming: true,
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Stop streaming after a delay
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessage.id 
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
      }, (data.output?.length || 50) * 50);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was a connection error. Please try again.',
        isUser: false,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14">
            <AvatarImage 
              src={dffLogo} 
              alt="Dubai Future Foundation"
              className="object-contain bg-transparent"
            />
            <AvatarFallback className="bg-transparent">DFF</AvatarFallback>
          </Avatar>
          <h1 className="text-2xl font-bold text-foreground">إلهام | ilham.ai</h1>
        </div>
        <div className="text-lg font-medium text-muted-foreground">
          DUBAI FUTURE FOUNDATION
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex items-start gap-3 animate-message-appear ${
              message.isUser ? 'flex-row-reverse' : 'flex-row'
            }`}
          >
            {!message.isUser && (
              <Avatar className="h-10 w-10 flex-shrink-0">
                <AvatarImage 
                  src={dffLogo} 
                  alt="ilham"
                  className="object-contain bg-transparent"
                />
                <AvatarFallback className="bg-transparent">AI</AvatarFallback>
              </Avatar>
            )}
            
            <div
              className={`max-w-[80%] p-4 rounded-xl ${
                message.isUser
                  ? 'bg-white/10 backdrop-blur-md border border-white/20 shadow-md text-foreground'
                  : 'bg-[hsl(var(--dff-bot-message))] text-foreground border border-border'
              }`}
            >
              {message.isStreaming ? (
                <StreamingText 
                  text={message.text} 
                  isStreaming={true}
                  speed={50}
                />
              ) : (
                message.text
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border">
        <div className="flex gap-3">
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message here..."
            className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-secondary hover:bg-accent text-secondary-foreground border-border"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
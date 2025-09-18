import React, { useState, useRef, useEffect } from 'react';
import { Send, ChevronDown, Settings, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import ReactMarkdown from 'react-markdown';
import StreamingText from './StreamingText';
import SettingsDialog from './SettingsDialog';
import AnimatedBackground from '@/components/AnimatedBackground';
import { useToast } from '@/hooks/use-toast';
import dffLogo from '@/assets/dff-logo.png';
import dffHeaderLogo from '@/assets/dff-header-logo.png';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  isStreaming?: boolean;
  timestamp: Date;
  streamingSpeed?: number;
}

const ChatInterface: React.FC = () => {
  const { toast } = useToast();
  const [webhookUrl, setWebhookUrl] = useState("https://your-webhook-url.com/webhook");
  const [messages, setMessages] = useState<Message[]>([
    {
        id: '1',
        text: 'I’m ilham — here to help you navigate the future of creativity with AI, inspired by Dubai Future Foundation’s vision.',
        isUser: false,
        timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      setShowScrollButton(!isNearBottom);
    };

    container.addEventListener('scroll', handleScroll);
    return () => container.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputValue,
      isUser: true,
      timestamp: new Date(),
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
      const responseText = data.output || 'Sorry, I couldn\'t process your request at the moment.';
      
      // Calculate variable speed based on message length
      // Short messages: slower (60ms), Long messages: faster (20ms)
      const calculateSpeed = (textLength: number) => {
        if (textLength < 50) return 60;  // Short messages - slower
        if (textLength > 500) return 20; // Long messages - faster
        // Linear interpolation between 60ms and 20ms for lengths 50-500
        return Math.round(60 - ((textLength - 50) / (500 - 50)) * (60 - 20));
      };
      
      const streamingSpeed = calculateSpeed(responseText.length);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        isUser: false,
        isStreaming: true,
        timestamp: new Date(),
        streamingSpeed, // Add speed to message
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Stop streaming after text finishes streaming
      setTimeout(() => {
        setMessages(prev => 
          prev.map(msg => 
            msg.id === botMessage.id 
              ? { ...msg, isStreaming: false }
              : msg
          )
        );
      }, responseText.length * streamingSpeed + 500);

    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'Sorry, there was a connection error. Please try again.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Refocus the input after sending message
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: "Copied to clipboard",
        duration: 2000,
      });
    } catch (error) {
      console.error('Failed to copy:', error);
      toast({
        title: "Failed to copy",
        description: "Please try again.",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <AnimatedBackground />
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-border">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage 
              src={dffLogo} 
              alt="Dubai Future Foundation"
              className="object-contain bg-transparent"
            />
            <AvatarFallback className="bg-transparent">DFF</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold text-foreground">إلهام | ilham.ai</h1>
            <div className="text-xs text-muted-foreground mt-1 leading-tight">
              <div>AI Creative Industries Assistant</div>
              <div>Powered by Contextual RAG by Laith Mufti</div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <img 
            src={dffHeaderLogo} 
            alt="Dubai Future Foundation"
            className="h-16 object-contain"
          />
        </div>
      </div>

      {/* Messages */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-6 space-y-6 relative"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0px, black 20px, black calc(100% - 20px), transparent 100%)'
        }}
      >
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
              className={`max-w-[80%] p-4 rounded-xl text-sm ${
                message.isUser
                  ? 'bg-white/5 backdrop-blur-xl border border-white/30 shadow-2xl shadow-white/10 text-foreground relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none'
                  : 'bg-white/5 backdrop-blur-xl border border-white/30 shadow-2xl shadow-white/20 text-foreground relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none'
              }`}
            >
              {message.isStreaming ? (
                <StreamingText 
                  text={message.text} 
                  isStreaming={true}
                  speed={message.streamingSpeed || 35}
                />
              ) : (
                <div className="whitespace-pre-wrap break-words overflow-hidden">
                  <ReactMarkdown 
                    components={{
                      p: ({ children }) => <p className="mb-2 last:mb-0 break-words">{children}</p>,
                      h1: ({ children }) => <h1 className="text-xl font-bold mb-3 mt-2 break-words">{children}</h1>,
                      h2: ({ children }) => <h2 className="text-lg font-bold mb-2 mt-2 break-words">{children}</h2>,
                      h3: ({ children }) => <h3 className="text-base font-bold mb-2 mt-1 break-words">{children}</h3>,
                      h4: ({ children }) => <h4 className="text-sm font-bold mb-1 mt-1 break-words">{children}</h4>,
                      h5: ({ children }) => <h5 className="text-sm font-semibold mb-1 break-words">{children}</h5>,
                      h6: ({ children }) => <h6 className="text-xs font-semibold mb-1 break-words">{children}</h6>,
                      strong: ({ children }) => <strong className="font-bold">{children}</strong>,
                      em: ({ children }) => <em className="italic">{children}</em>,
                      code: ({ children }) => <code className="bg-white/10 px-1 py-0.5 rounded text-sm font-mono break-all">{children}</code>,
                      ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
                      ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
                      li: ({ children }) => <li className="break-words">{children}</li>,
                    }}
                  >
                    {message.text}
                  </ReactMarkdown>
                </div>
              )}
             </div>

             {!message.isUser && !message.isStreaming && (
               <button
                 onClick={() => copyToClipboard(message.text)}
                 className="mt-1 ml-1 p-1 rounded hover:bg-white/10 transition-colors opacity-50 hover:opacity-100 group"
                 aria-label="Copy message"
               >
                 <Copy size={12} className="text-muted-foreground group-hover:text-foreground transition-colors" />
               </button>
             )}

             {message.isUser && (
              <div className="text-xs text-muted-foreground mt-2">
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </div>
            )}
          </div>
        ))}
        
        {isLoading && (
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 flex-shrink-0">
              <AvatarImage 
                src={dffLogo} 
                alt="ilham"
                className="object-contain bg-transparent"
              />
              <AvatarFallback className="bg-transparent">AI</AvatarFallback>
            </Avatar>
            <div className="bg-white/5 backdrop-blur-xl border border-white/30 shadow-2xl shadow-white/20 text-foreground border border-border p-4 rounded-xl text-sm relative before:absolute before:inset-0 before:rounded-xl before:bg-gradient-to-br before:from-white/10 before:to-transparent before:pointer-events-none">
              <div className="flex items-center gap-1">
                <span>Thinking</span>
                <div className="flex gap-1">
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-1 h-1 bg-current rounded-full animate-pulse" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
        
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="fixed bottom-24 right-6 z-10 bg-secondary/80 backdrop-blur-sm hover:bg-accent border border-border text-secondary-foreground p-2 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl hover:scale-105"
          >
            <ChevronDown className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Input */}
      <div className="p-6 border-t border-border">
        <div className="flex gap-3">
          <Input
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask me about Dubai’s AI in Creative Industries guidelines…"
            className="flex-1 bg-input border-border text-foreground placeholder:text-muted-foreground"
            disabled={isLoading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={isLoading || !inputValue.trim()}
            className="bg-secondary hover:bg-accent text-secondary-foreground border-border transition-all duration-200 hover:shadow-lg hover:shadow-white/10"
          >
            <Send className="h-4 w-4" />
          </Button>
          <SettingsDialog onWebhookChange={setWebhookUrl} />
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;
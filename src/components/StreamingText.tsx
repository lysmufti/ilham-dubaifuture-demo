import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  onStreamingComplete?: () => void;
  speed?: number;
}

const StreamingText: React.FC<StreamingTextProps> = ({
  text,
  isStreaming,
  onStreamingComplete,
  speed = 50,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  const resetStreaming = useCallback(() => {
    setDisplayedText('');
    setCurrentIndex(0);
  }, []);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text);
      return;
    }

    resetStreaming();
  }, [text, isStreaming, resetStreaming]);

  useEffect(() => {
    if (!isStreaming || currentIndex >= text.length) {
      if (currentIndex >= text.length && onStreamingComplete) {
        onStreamingComplete();
      }
      return;
    }

    const timer = setTimeout(() => {
      setDisplayedText(text.slice(0, currentIndex + 1));
      setCurrentIndex(prev => prev + 1);
    }, speed);

    return () => clearTimeout(timer);
  }, [currentIndex, text, isStreaming, speed, onStreamingComplete]);

  return (
    <span className="whitespace-pre-wrap">
      <ReactMarkdown 
        components={{
          p: ({ children }) => <span>{children}</span>,
          h1: ({ children }) => <h1 className="text-xl font-bold mb-2">{children}</h1>,
          h2: ({ children }) => <h2 className="text-lg font-bold mb-2">{children}</h2>,
          h3: ({ children }) => <h3 className="text-base font-bold mb-1">{children}</h3>,
          h4: ({ children }) => <h4 className="text-sm font-bold mb-1">{children}</h4>,
          h5: ({ children }) => <h5 className="text-sm font-semibold mb-1">{children}</h5>,
          h6: ({ children }) => <h6 className="text-xs font-semibold mb-1">{children}</h6>,
          strong: ({ children }) => <strong className="font-bold">{children}</strong>,
          em: ({ children }) => <em className="italic">{children}</em>,
          code: ({ children }) => <code className="bg-white/10 px-1 py-0.5 rounded text-sm font-mono">{children}</code>,
          ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1">{children}</ul>,
          ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1">{children}</ol>,
          li: ({ children }) => <li>{children}</li>,
        }}
      >
        {displayedText}
      </ReactMarkdown>
      {isStreaming && currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default StreamingText;
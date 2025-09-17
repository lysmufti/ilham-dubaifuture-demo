import React, { useState, useEffect, useCallback } from 'react';

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
    <span>
      {displayedText}
      {isStreaming && currentIndex < text.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default StreamingText;
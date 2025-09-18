import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  onStreamingComplete?: () => void;
  speed?: number;
}

interface StreamingChunk {
  content: string;
  isComplete: boolean;
  type: 'text' | 'markdown';
}

const StreamingText: React.FC<StreamingTextProps> = ({
  text,
  isStreaming,
  onStreamingComplete,
  speed = 50,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [streamingChunks, setStreamingChunks] = useState<StreamingChunk[]>([]);
  const [currentChunkIndex, setCurrentChunkIndex] = useState(0);
  const [currentCharIndex, setCurrentCharIndex] = useState(0);

  // Parse text into streaming-safe chunks
  const parseTextIntoChunks = useCallback((inputText: string): StreamingChunk[] => {
    const chunks: StreamingChunk[] = [];
    const markdownPatterns = [
      // Headers
      /^(#{1,6}\s[^\n]+)/gm,
      // Bold
      /(\*\*[^*]+\*\*)/g,
      // Italic
      /(\*[^*]+\*|_[^_]+_)/g,
      // Inline code
      /(`[^`]+`)/g,
      // List items
      /^(\s*[-*+]\s[^\n]+)/gm,
    ];

    let lastIndex = 0;
    const matches: { start: number; end: number; content: string; type: 'markdown' }[] = [];

    // Find all markdown matches
    markdownPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(inputText)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          content: match[0],
          type: 'markdown'
        });
      }
    });

    // Sort matches by position
    matches.sort((a, b) => a.start - b.start);

    // Build chunks
    matches.forEach(match => {
      // Add text before markdown
      if (match.start > lastIndex) {
        const textContent = inputText.slice(lastIndex, match.start);
        // Split text into words for better streaming
        const words = textContent.split(/(\s+)/);
        words.forEach(word => {
          if (word.trim()) {
            chunks.push({ content: word, isComplete: false, type: 'text' });
          }
        });
      }
      
      // Add markdown as complete chunk
      chunks.push({ content: match.content, isComplete: true, type: 'markdown' });
      lastIndex = match.end;
    });

    // Add remaining text
    if (lastIndex < inputText.length) {
      const remaining = inputText.slice(lastIndex);
      const words = remaining.split(/(\s+)/);
      words.forEach(word => {
        if (word.trim()) {
          chunks.push({ content: word, isComplete: false, type: 'text' });
        }
      });
    }

    return chunks;
  }, []);

  const resetStreaming = useCallback(() => {
    setDisplayedText('');
    setStreamingChunks([]);
    setCurrentChunkIndex(0);
    setCurrentCharIndex(0);
  }, []);

  useEffect(() => {
    if (!isStreaming) {
      setDisplayedText(text);
      return;
    }

    resetStreaming();
    const chunks = parseTextIntoChunks(text);
    setStreamingChunks(chunks);
  }, [text, isStreaming, resetStreaming, parseTextIntoChunks]);

  useEffect(() => {
    if (!isStreaming || currentChunkIndex >= streamingChunks.length) {
      if (currentChunkIndex >= streamingChunks.length && onStreamingComplete) {
        onStreamingComplete();
      }
      return;
    }

    const currentChunk = streamingChunks[currentChunkIndex];
    
    if (currentChunk.isComplete || currentChunk.type === 'markdown') {
      // Display complete markdown chunks immediately
      const timer = setTimeout(() => {
        const allPreviousChunks = streamingChunks.slice(0, currentChunkIndex).map(c => c.content).join('');
        setDisplayedText(allPreviousChunks + currentChunk.content);
        setCurrentChunkIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }, speed);
      return () => clearTimeout(timer);
    } else {
      // Stream text chunks character by character
      if (currentCharIndex < currentChunk.content.length) {
        const timer = setTimeout(() => {
          const allPreviousChunks = streamingChunks.slice(0, currentChunkIndex).map(c => c.content).join('');
          const currentPartial = currentChunk.content.slice(0, currentCharIndex + 1);
          setDisplayedText(allPreviousChunks + currentPartial);
          setCurrentCharIndex(prev => prev + 1);
        }, speed);
        return () => clearTimeout(timer);
      } else {
        // Move to next chunk
        setCurrentChunkIndex(prev => prev + 1);
        setCurrentCharIndex(0);
      }
    }
  }, [currentChunkIndex, currentCharIndex, streamingChunks, isStreaming, speed, onStreamingComplete]);

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
      {isStreaming && currentChunkIndex < streamingChunks.length && (
        <span className="animate-pulse">|</span>
      )}
    </span>
  );
};

export default StreamingText;
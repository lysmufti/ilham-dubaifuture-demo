import React, { useState, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
  onStreamingComplete?: () => void;
  onStopStreaming?: () => void;
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
  onStopStreaming,
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
      // Headers (must be at start of line)
      /^(#{1,6}\s[^\n]+)$/gm,
      // Bold
      /(\*\*[^*\n]+\*\*)/g,
      // Italic
      /(\*[^*\n]+\*(?!\*))/g,
      /(_[^_\n]+_)/g,
      // Inline code
      /(`[^`\n]+`)/g,
      // List items (must be at start of line)
      /^(\s*[-*+]\s[^\n]+)$/gm,
    ];

    let lastIndex = 0;
    const matches: { start: number; end: number; content: string; type: 'markdown' }[] = [];

    // Find all markdown matches
    markdownPatterns.forEach(pattern => {
      let match;
      const regex = new RegExp(pattern.source, pattern.flags);
      while ((match = regex.exec(inputText)) !== null) {
        matches.push({
          start: match.index,
          end: match.index + match[0].length,
          content: match[0],
          type: 'markdown'
        });
      }
    });

    // Sort matches by position and remove overlaps
    matches.sort((a, b) => a.start - b.start);
    const validMatches = matches.filter((match, index) => {
      if (index === 0) return true;
      const prevMatch = matches[index - 1];
      return match.start >= prevMatch.end;
    });

    // Build chunks
    validMatches.forEach(match => {
      // Add text before markdown
      if (match.start > lastIndex) {
        const textContent = inputText.slice(lastIndex, match.start);
        // Split text preserving spaces
        const parts = textContent.split(/(\s+)/);
        parts.forEach(part => {
          if (part) { // Include both text and whitespace
            chunks.push({ 
              content: part, 
              isComplete: part.trim() === '', // Whitespace is always complete
              type: 'text' 
            });
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
      const parts = remaining.split(/(\s+)/);
      parts.forEach(part => {
        if (part) { // Include both text and whitespace
          chunks.push({ 
            content: part, 
            isComplete: part.trim() === '', // Whitespace is always complete
            type: 'text' 
          });
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

  // Handle stop streaming
  useEffect(() => {
    if (!isStreaming && onStopStreaming) {
      // If streaming was stopped, show complete text
      setDisplayedText(text);
    }
  }, [isStreaming, onStopStreaming, text]);

  return (
    <span className="whitespace-pre-wrap break-words overflow-hidden">
      <span className="relative inline">
        <ReactMarkdown 
          components={{
            p: ({ children }) => <span className="inline">{children}</span>,
            h1: ({ children }) => <h1 className="text-xl font-bold mb-2 break-words inline-block w-full">{children}</h1>,
            h2: ({ children }) => <h2 className="text-lg font-bold mb-2 break-words inline-block w-full">{children}</h2>,
            h3: ({ children }) => <h3 className="text-base font-bold mb-1 break-words inline-block w-full">{children}</h3>,
            h4: ({ children }) => <h4 className="text-sm font-bold mb-1 break-words inline-block w-full">{children}</h4>,
            h5: ({ children }) => <h5 className="text-sm font-semibold mb-1 break-words inline-block w-full">{children}</h5>,
            h6: ({ children }) => <h6 className="text-xs font-semibold mb-1 break-words inline-block w-full">{children}</h6>,
            strong: ({ children }) => <strong className="font-bold">{children}</strong>,
            em: ({ children }) => <em className="italic">{children}</em>,
            code: ({ children }) => <code className="bg-white/10 px-1 py-0.5 rounded text-sm font-mono break-all">{children}</code>,
            ul: ({ children }) => <ul className="list-disc list-inside my-2 space-y-1 inline-block w-full">{children}</ul>,
            ol: ({ children }) => <ol className="list-decimal list-inside my-2 space-y-1 inline-block w-full">{children}</ol>,
            li: ({ children }) => <li className="break-words">{children}</li>,
          }}
        >
          {displayedText}
        </ReactMarkdown>
        {isStreaming && currentChunkIndex < streamingChunks.length && (
          <span className="animate-pulse ml-0.5">|</span>
        )}
      </span>
    </span>
  );
};

export default StreamingText;
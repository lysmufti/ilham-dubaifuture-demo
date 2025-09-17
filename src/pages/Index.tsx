import ChatInterface from "@/components/ChatInterface";
import AnimatedBackground from "@/components/AnimatedBackground";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground dark">
      <AnimatedBackground />
      <div className="relative z-10 min-h-screen flex flex-col max-w-4xl mx-auto">
        <ChatInterface />
      </div>
    </div>
  );
};

export default Index;

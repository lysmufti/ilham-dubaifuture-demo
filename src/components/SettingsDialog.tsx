import React, { useState, useEffect } from 'react';
import { Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface SettingsDialogProps {
  onWebhookChange: (url: string) => void;
}

const SettingsDialog: React.FC<SettingsDialogProps> = ({ onWebhookChange }) => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Load saved webhook URL from localStorage
    const savedUrl = localStorage.getItem('webhookUrl');
    if (savedUrl) {
      setWebhookUrl(savedUrl);
      onWebhookChange(savedUrl);
    }
  }, [onWebhookChange]);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem('webhookUrl', webhookUrl);
    onWebhookChange(webhookUrl);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="text-muted-foreground hover:text-foreground"
        >
          <Settings className="h-5 w-5" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Configure your webhook URL for backend integration.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="webhook-url" className="text-right">
              Webhook URL
            </Label>
            <Input
              id="webhook-url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://your-n8n-instance.com/webhook"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSave} disabled={!webhookUrl.trim()}>
            Save Settings
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SettingsDialog;
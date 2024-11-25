'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  Shield, 
  Wallet, 
  Github, 
  Mail, 
  Globe, 
  Moon,
  Sun,
  Smartphone
} from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const sections = [
  {
    id: 'account',
    title: 'Account Settings',
    description: 'Manage your account preferences and personal information.',
    icon: Shield,
    settings: [
      {
        id: 'email',
        label: 'Email Notifications',
        description: 'Receive email updates about your activity',
        type: 'toggle',
        icon: Mail,
      },
      {
        id: 'theme',
        label: 'Theme Preference',
        description: 'Choose between light and dark mode',
        type: 'theme',
        icon: Moon,
      },
    ],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure how you want to receive notifications.',
    icon: Bell,
    settings: [
      {
        id: 'push',
        label: 'Push Notifications',
        description: 'Receive notifications on your device',
        type: 'toggle',
        icon: Smartphone,
      },
      {
        id: 'activity',
        label: 'Activity Updates',
        description: 'Get notified about project updates',
        type: 'toggle',
        icon: Globe,
      },
    ],
  },
  {
    id: 'connections',
    title: 'Connected Accounts',
    description: 'Manage your connected accounts and wallets.',
    icon: Wallet,
    settings: [
      {
        id: 'wallet',
        label: 'Solana Wallet',
        description: 'Connect or disconnect your wallet',
        type: 'wallet',
        icon: Wallet,
      },
      {
        id: 'github',
        label: 'Github Account',
        description: 'Link your Github account',
        type: 'github',
        icon: Github,
      },
    ],
  },
];

export default function SettingsPage() {
  const [settings, setSettings] = useState({});
  const { theme, setTheme } = useTheme();

  const handleToggle = (id: string) => {
    setSettings((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="space-y-12 p-6">
      <div>
        <h1 className="text-4xl font-bold">Settings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-8">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <motion.div
              key={section.id}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
            >
              <Card>
                <CardHeader>
                  <div className="flex items-center gap-4 mb-6">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon size={24} />
                    </div>
                    <div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <CardDescription>{section.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="grid gap-6">
                  {section.settings.map((setting, idx) => {
                    const SettingIcon = setting.icon;
                    return (
                      <div key={setting.id}>
                        {idx > 0 && <Separator className="mb-6" />}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="p-2 rounded-lg bg-secondary">
                              <SettingIcon size={20} className="text-secondary-foreground" />
                            </div>
                            <div>
                              <h3 className="font-medium">{setting.label}</h3>
                              <p className="text-sm text-muted-foreground">
                                {setting.description}
                              </p>
                            </div>
                          </div>

                          {setting.type === 'toggle' && (
                            <Switch
                              checked={settings[setting.id]}
                              onCheckedChange={() => handleToggle(setting.id)}
                            />
                          )}

                          {setting.type === 'theme' && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            >
                              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                            </Button>
                          )}

                          {setting.type === 'wallet' && (
                            <Button>
                              Connect
                            </Button>
                          )}

                          {setting.type === 'github' && (
                            <Button variant="outline">
                              <Github className="mr-2 h-4 w-4" />
                              Connect
                            </Button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

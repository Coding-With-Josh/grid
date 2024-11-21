'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Wallet, ChevronRight, User, Code, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

const steps = [
  {
    id: 'connect',
    title: 'Connect Accounts',
    description: 'Connect your wallet and Github account',
    fields: [
      {
        id: 'wallet',
        label: 'Solana Wallet',
        type: 'wallet',
        icon: Wallet,
      },
      {
        id: 'github',
        label: 'Github Account',
        type: 'github',
        icon: Github,
      },
    ],
  },
  {
    id: 'profile',
    title: 'Create Profile',
    description: 'Tell us about yourself',
    fields: [
      {
        id: 'username',
        label: 'Username',
        type: 'text',
        placeholder: 'Enter your username',
        icon: User,
      },
      {
        id: 'role',
        label: 'Primary Role',
        type: 'radio',
        options: [
          { value: 'developer', label: 'Developer' },
          { value: 'designer', label: 'Designer' },
          { value: 'project_manager', label: 'Project Manager' },
          { value: 'other', label: 'Other' },
        ],
        icon: Code,
      },
    ],
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({});

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (fieldId: string, value: string | string[]) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldId]: value
    }));
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-background via-background/95 to-[#14F195]/10">
      <Card className="w-full max-w-2xl border-border/40 shadow-lg">
        <CardHeader>
          <div className="space-y-2">
            <CardTitle className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#14F195] to-primary">
              Welcome to Grid
            </CardTitle>
            <CardDescription className="text-base">
              Let's get you set up in just a few steps
            </CardDescription>
          </div>
          <Progress 
            value={progress} 
            className="mt-6 h-2 bg-secondary"
            indicatorClassName="bg-[#14F195]" 
          />
        </CardHeader>
        <CardContent>
          <motion.div
            key={currentStep}
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -20, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
              <p className="text-sm text-muted-foreground mt-1">
                {steps[currentStep].description}
              </p>
            </div>

            <div className="space-y-6">
              {steps[currentStep].fields.map((field) => {
                const Icon = field.icon;
                return (
                  <div key={field.id}>
                    {field.type === 'text' && (
                      <div className="space-y-2">
                        <Label htmlFor={field.id}>{field.label}</Label>
                        <div className="relative">
                          <Icon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                          <Input
                            id={field.id}
                            placeholder={field.placeholder}
                            className="pl-9 border-border/40 focus:border-[#14F195] focus:ring-[#14F195]/20"
                            value={formData[field.id] || ''}
                            onChange={(e) => handleInputChange(field.id, e.target.value)}
                          />
                        </div>
                      </div>
                    )}

                    {field.type === 'radio' && (
                      <div className="space-y-3">
                        <Label>{field.label}</Label>
                        <RadioGroup
                          onValueChange={(value) => handleInputChange(field.id, value)}
                          defaultValue={formData[field.id]}
                          className="grid grid-cols-2 gap-4"
                        >
                          {field.options.map((option) => (
                            <div 
                              key={option.value} 
                              className="flex items-center space-x-2 rounded-lg border border-border/40 p-4 hover:border-[#14F195]/40 transition-colors"
                            >
                              <RadioGroupItem 
                                value={option.value} 
                                id={option.value}
                                className="border-border/40 text-[#14F195]" 
                              />
                              <Label htmlFor={option.value} className="flex-1 cursor-pointer">
                                {option.label}
                              </Label>
                            </div>
                          ))}
                        </RadioGroup>
                      </div>
                    )}

                    {field.type === 'wallet' && (
                      <div>
                        <Button 
                          variant="outline" 
                          className="w-full border-border/40 hover:border-[#14F195] hover:bg-[#14F195]/10 hover:text-[#14F195] transition-colors"
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          Connect Wallet
                        </Button>
                      </div>
                    )}

                    {field.type === 'github' && (
                      <div>
                        <Button 
                          variant="outline" 
                          className="w-full border-border/40 hover:border-[#14F195] hover:bg-[#14F195]/10 hover:text-[#14F195] transition-colors"
                        >
                          <Icon className="mr-2 h-4 w-4" />
                          Connect Github
                        </Button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <Separator className="border-border/40" />

            <div className="flex justify-between">
              {currentStep > 0 ? (
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  className="hover:text-[#14F195] hover:bg-[#14F195]/10"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              ) : (
                <div /> 
              )}
              <Button
                onClick={handleNext}
                disabled={currentStep === steps.length - 1}
                className="bg-[#14F195] hover:bg-[#14F195]/90 text-black font-medium"
              >
                Next Step
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, User, MapPin, Calendar, Code, Briefcase, GraduationCap, Languages, Clock, ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OnboardingForm } from '@/components/onboarding-form';

const steps = [
  {
    id: 'basics',
    title: 'Basic Information',
    description: 'Tell us about yourself',
    fields: [
      {
        id: 'fullName',
        label: 'Full Name',
        type: 'text',
        placeholder: 'Enter your full name',
        icon: User,
      },
      {
        id: 'birthday',
        label: 'Birthday',
        type: 'date',
        icon: Calendar,
      },
      {
        id: 'location',
        label: 'Location',
        type: 'text',
        placeholder: 'City, Country',
        icon: MapPin,
      },
    ],
  },
  {
    id: 'role',
    title: 'Professional Details',
    description: 'Tell us about your work',
    fields: [
      {
        id: 'role',
        label: 'Primary Role',
        type: 'select',
        options: [
          { value: 'DEVELOPER', label: 'Developer' },
          { value: 'DESIGNER', label: 'Designer' },
          { value: 'CREATOR', label: 'Creator' },
          { value: 'WRITER', label: 'Writer' },
        ],
        icon: Code,
      },
      {
        id: 'bio',
        label: 'Bio',
        type: 'textarea',
        placeholder: 'Tell us about yourself...',
      },
      {
        id: 'experience',
        label: 'Years of Experience',
        type: 'number',
        placeholder: '0',
        icon: Briefcase,
      },
      {
        id: 'education',
        label: 'Education',
        type: 'text',
        placeholder: 'Highest degree or certification',
        icon: GraduationCap,
      },
    ],
  },
  {
    id: 'skills',
    title: 'Skills & Preferences',
    description: 'Share your expertise',
    fields: [
      {
        id: 'skills',
        label: 'Skills',
        type: 'text',
        placeholder: 'Enter skills (comma separated)',
        icon: Code,
      },
      {
        id: 'languages',
        label: 'Languages',
        type: 'text',
        placeholder: 'Enter languages (comma separated)',
        icon: Languages,
      },
      {
        id: 'availability',
        label: 'Availability',
        type: 'select',
        options: [
          { value: 'FULL_TIME', label: 'Full Time' },
          { value: 'PART_TIME', label: 'Part Time' },
          { value: 'CONTRACT', label: 'Contract' },
          { value: 'FREELANCE', label: 'Freelance' },
        ],
        icon: Clock,
      },
    ],
  },
  {
    id: 'social',
    title: 'Social Links',
    description: 'Connect your profiles',
    fields: [
      {
        id: 'website',
        label: 'Website',
        type: 'url',
        placeholder: 'https://',
      },
      {
        id: 'github',
        label: 'GitHub Username',
        type: 'text',
        placeholder: 'username',
        icon: Github,
      },
      {
        id: 'twitter',
        label: 'Twitter Username',
        type: 'text',
        placeholder: 'username',
      },
      {
        id: 'linkedin',
        label: 'LinkedIn Username',
        type: 'text',
        placeholder: 'username',
      },
    ],
  },
];

export default function OnboardingPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<{
    skills: string | string[];
    languages: string | string[];
    experience: string | number;
    [key: string]: any;
  }>({
    skills: '',
    languages: '',
    experience: '',
  });
  const { data: session, status, update: updateSession } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.hasCompletedOnboarding) {
      router.push('/dashboard');
    }
  }, [session, router]);

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      try {
        // Transform skills and languages from string to array if needed
        const finalFormData = {
          ...formData,
          skills: typeof formData.skills === 'string' ? formData.skills.split(',').map(s => s.trim()) : formData.skills,
          languages: typeof formData.languages === 'string' ? formData.languages.split(',').map(l => l.trim()) : formData.languages,
          experience: Number(formData.experience),
        };

        const response = await fetch('/api/user/complete-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(finalFormData),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to complete profile');
        }

        await updateSession();
        toast.success('Profile completed successfully!');
        router.push('/dashboard');
      } catch (error: any) {
        console.error('Failed to complete profile:', error);
        toast.error('Failed to complete profile. Please try again.');
      }
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleInputChange = (fieldId: string, value: any) => {
    setFormData(prevData => ({
      ...prevData,
      [fieldId]: value
    }));
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#14F195]" />
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

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
        </CardHeader>
        <CardContent>
          <OnboardingForm />
        </CardContent>
      </Card>
    </div>
  );
}

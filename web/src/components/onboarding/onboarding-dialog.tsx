"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export function OnboardingDialog() {
  const { data: session, update } = useSession();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    role: "",
    github: "",
    walletAddress: "",
    fullName: "",
    bio: "",
    skills: [] as string[],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    // Only show dialog if user is logged in and hasn't completed onboarding
    if (session?.user && session.user.hasCompletedOnboarding === false) {
      setShowDialog(true);
    } else {
      setShowDialog(false);
    }
  }, [session]);

  const handleNext = () => {
    if (step === 1 && !formData.fullName) {
      toast.error("Please enter your full name");
      return;
    }
    if (step === 2 && !formData.github) {
      toast.error("Please enter your GitHub username");
      return;
    }
    if (step === 3 && !formData.walletAddress) {
      toast.error("Please enter your Solana wallet address");
      return;
    }
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      const response = await fetch("/api/user/onboarding", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to save onboarding data");
      }

      // Update session to mark onboarding as complete
      await update({
        ...session,
        user: {
          ...session?.user,
          hasCompletedOnboarding: true,
          role: formData.role,
        },
      });

      toast.success("Profile setup completed!");
      setShowDialog(false);
    } catch (error) {
      console.error("Onboarding error:", error);
      toast.error("Failed to complete profile setup");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Don't render anything if we don't need to show the dialog
  if (!showDialog) return null;

  return (
    <Dialog open={showDialog} onOpenChange={setShowDialog}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to Grid! 👋</DialogTitle>
          <DialogDescription>
            Let's get your profile set up in just a few steps.
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder={session?.user?.name}
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder={session?.user?.bio}
                value={formData.bio}
                onChange={(e) =>
                  setFormData({ ...formData, bio: e.target.value })
                }
              />
            </div>
            <div className="space-y-2">
              <Label>What best describes your role?</Label>
              <RadioGroup
                value={formData.role}
                onValueChange={(value) =>
                  setFormData({ ...formData, role: value })
                }
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DEVELOPER" id="developer" />
                  <Label htmlFor="developer">Developer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="DESIGNER" id="designer" />
                  <Label htmlFor="designer">Designer</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="CREATOR" id="creator" />
                  <Label htmlFor="creator">Creator</Label>
                </div>
              </RadioGroup>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="github">GitHub Username</Label>
              <Input
                id="github"
                placeholder="johndoe"
                value={formData.github}
                onChange={(e) =>
                  setFormData({ ...formData, github: e.target.value })
                }
              />
              <p className="text-sm text-muted-foreground">
                This will be used to connect your GitHub repositories.
              </p>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="walletAddress">Solana Wallet Address</Label>
              <Input
                id="walletAddress"
                placeholder="Enter your Solana wallet address"
                value={formData.walletAddress}
                onChange={(e) =>
                  setFormData({ ...formData, walletAddress: e.target.value })
                }
              />
              <p className="text-sm text-muted-foreground">
                Your Solana wallet will be used for transactions and rewards.
              </p>
            </div>
          </div>
        )}

        <DialogFooter>
          <div className="flex w-full justify-between">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={step === 1 || isSubmitting}
            >
              Back
            </Button>
            <Button onClick={handleNext} disabled={isSubmitting}>
              {isSubmitting ? (
                "Saving..."
              ) : step === 3 ? (
                "Complete Setup"
              ) : (
                "Next"
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

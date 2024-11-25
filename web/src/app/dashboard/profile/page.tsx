'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { OnboardingForm } from '@/components/onboarding-form';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Globe, Github, Twitter, Linkedin, Mail, MapPin, Calendar, Briefcase, GraduationCap, Languages } from 'lucide-react';

export default function ProfilePage() {
  const { data: session } = useSession();
  const [user, setUser] = useState<any>(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch('/api/user/profile');
        if (response.ok) {
          const data = await response.json();
          setUser(data);
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    if (session?.user) {
      fetchProfile();
    }
  }, [session]);

  if (!user) {
    return <div>Loading...</div>;
  }

  if (isEditing) {
    return (
      <div className="container max-w-4xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <OnboardingForm initialData={user} onComplete={() => setIsEditing(false)} />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-4xl py-10">
      <Card>
        <CardHeader className="relative">
          <Button
            variant="outline"
            className="absolute right-6 top-6"
            onClick={() => setIsEditing(true)}
          >
            Edit Profile
          </Button>
          <div className="flex items-center gap-4">
            {user.image && (
              <img
                src={user.image}
                alt={user.fullName}
                className="h-20 w-20 rounded-full"
              />
            )}
            <div>
              <h1 className="text-2xl font-bold">{user.fullName}</h1>
              <p className="text-muted-foreground">{user.role}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Bio Section */}
          <div>
            <h2 className="text-xl font-semibold mb-2">About</h2>
            <p className="text-muted-foreground">{user.bio}</p>
          </div>

          {/* Basic Info */}
          <div className="grid gap-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              <span>{user.location}</span>
            </div>
            {user.email && (
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                <span>{user.email}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>{format(new Date(user.birthday), 'MMMM d, yyyy')}</span>
            </div>
          </div>

          {/* Skills */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Skills</h2>
            <div className="flex flex-wrap gap-2">
              {user.skills.map((skill: string) => (
                <Badge key={skill} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          {/* Professional Info */}
          <div className="grid gap-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Professional</h2>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span>{user.experience} years of experience</span>
                </div>
                <div className="flex items-center gap-2">
                  <GraduationCap className="h-4 w-4" />
                  <span>{user.education}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Languages className="h-4 w-4" />
                  <span>{user.languages.join(', ')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div>
            <h2 className="text-xl font-semibold mb-2">Connect</h2>
            <div className="grid gap-2">
              {user.website && (
                <a
                  href={user.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <Globe className="h-4 w-4" />
                  <span>Website</span>
                </a>
              )}
              {user.github && (
                <a
                  href={`https://github.com/${user.github}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <Github className="h-4 w-4" />
                  <span>GitHub</span>
                </a>
              )}
              {user.twitter && (
                <a
                  href={`https://twitter.com/${user.twitter}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <Twitter className="h-4 w-4" />
                  <span>Twitter</span>
                </a>
              )}
              {user.linkedin && (
                <a
                  href={`https://linkedin.com/in/${user.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary"
                >
                  <Linkedin className="h-4 w-4" />
                  <span>LinkedIn</span>
                </a>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

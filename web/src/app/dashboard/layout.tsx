'use client';

import { signIn, useSession } from 'next-auth/react';
import { usePathname, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  Users,
  Settings,
  Palette,
  Code2,
  Video,
  Image as ImageIcon,
  PenTool,
  Boxes,
  GitBranch,
  Upload,
  Film,
  Mic,
  Share2,
  MessageSquare,
  Shield,
  NotebookTabs,
  Bot,
  Github,
  Twitter,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ButtonLoader } from '@/components/ui/button-loader';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { toast } from 'sonner';

type UserRole = 'developer' | 'designer' | 'creator' | 'admin';

interface SidebarItem {
  title: string;
  href: string;
  icon: React.ReactNode;
  badge?: string;
  roles?: UserRole[];
}

const sidebarItems: { section: string; items: SidebarItem[]; roles?: UserRole[] }[] = [
  {
    section: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className="h-5 w-5" />,
      },
    ],
  },
  {
    section: 'AI Tools',
    items: [
      {
        title: 'Meeting Summarizer',
        href: '/dashboard/ai/meeting-summarizer',
        icon: <NotebookTabs className="h-5 w-5" />,
      },
      {
        title: 'Copilot',
        href: '/dashboard/ai/copilot',
        icon: <Bot className="h-5 w-5" />,
      },
    ],
  },
  {
    section: 'Design Tools',
    roles: ['designer', 'admin'],
    items: [
      {
        title: 'Design Projects',
        href: '/dashboard/design/projects',
        icon: <Palette className="h-5 w-5" />,
        badge: '3',
      },
      {
        title: 'Assets',
        href: '/dashboard/design/assets',
        icon: <ImageIcon className="h-5 w-5" />,
      },
      {
        title: 'Prototypes',
        href: '/dashboard/design/prototypes',
        icon: <PenTool className="h-5 w-5" />,
      },
      {
        title: 'AI Tools',
        href: '/dashboard/design/ai-tools',
        icon: <Bot className="h-5 w-5" />,
      },
    ],
  },
  {
    section: 'Development',
    roles: ['developer', 'admin'],
    items: [
      {
        title: 'Code Projects',
        href: '/dashboard/dev/projects',
        icon: <Code2 className="h-5 w-5" />,
        badge: '2',
      },
      {
        title: 'Components',
        href: '/dashboard/dev/components',
        icon: <Boxes className="h-5 w-5" />,
      },
      {
        title: 'Repositories',
        href: '/dashboard/dev/repos',
        icon: <GitBranch className="h-5 w-5" />,
      },
      {
        title: 'AI Tools',
        href: '/dashboard/dev/ai-tools',
        icon: <Bot className="h-5 w-5" />,
      },
    ],
  },
  {
    section: 'Content Creation',
    roles: ['creator', 'admin'],
    items: [
      {
        title: 'Media Projects',
        href: '/dashboard/content/projects',
        icon: <Video className="h-5 w-5" />,
        badge: '5',
      },
      {
        title: 'Uploads',
        href: '/dashboard/content/uploads',
        icon: <Upload className="h-5 w-5" />,
      },
      {
        title: 'Video Editor',
        href: '/dashboard/content/video',
        icon: <Film className="h-5 w-5" />,
      },
      {
        title: 'Audio Editor',
        href: '/dashboard/content/audio',
        icon: <Mic className="h-5 w-5" />,
      }, {
        title: 'AI Tools',
        href: '/dashboard/content/ai-tools',
        icon: <Bot className="h-5 w-5" />,
      },
    ],
  },
  {
    section: 'Collaboration',
    items: [
      {
        title: 'Team',
        href: '/dashboard/team',
        icon: <Users className="h-5 w-5" />,
      },
      {
        title: 'Messages',
        href: '/dashboard/messages',
        icon: <MessageSquare className="h-5 w-5" />,
        badge: '3',
      },
      {
        title: 'Share',
        href: '/dashboard/share',
        icon: <Share2 className="h-5 w-5" />,
      },
    ],
  },
  {
    section: 'System',
    items: [
      {
        title: 'Security',
        href: '/dashboard/security',
        icon: <Shield className="h-5 w-5" />,
        roles: ['admin'],
      },
      {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: <Settings className="h-5 w-5" />,
      },
    ],
  },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const handleSignIn = async (provider: string) => {
    try {
      setIsLoading(provider);
      const result = await signIn(provider, {
        callbackUrl,
        redirect: true,
      });
      if (result?.error) {
        toast.error(`Failed to sign in with ${provider}. Please try again.`);
      }
    } catch (error) {
      console.error('Sign in error:', error);
      toast.error(`Failed to sign in with ${provider}. Please try again.`);
    } finally {
      setIsLoading(null);
    }
  };
  const pathname = usePathname();
  const { data: session } = useSession();
  const userRole = session?.user?.email === 'codewithjoshh@gmail.com' ? 'admin' : (session?.user?.role || 'creator');

  const isItemVisible = (item: SidebarItem) => {
    if (!item.roles) return true;
    return item.roles.includes(userRole as UserRole);
  };

  const isSectionVisible = (section: typeof sidebarItems[0]) => {
    if (!section.roles) return true;
    return section.roles.includes(userRole as UserRole);
  };

  return (
    <>
      {pathname.endsWith("/editor") ? (
        children
      ) : (
        <div className="flex min-h-screen bg-background">
          {!session ? (
            <div className='fixed inset-0 z-50 flex justify-center items-center bg-background/80 backdrop-blur-sm'>
              <Card className="w-full max-w-md border-border/40 shadow-lg animate-in fade-in-0 zoom-in-95">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#14F195] to-primary">
                    Login to Grid
                  </CardTitle>
                  <CardDescription className="text-base">
                    Sign in to access your dashboard and projects
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-4">
                  <div className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full h-11 border-border/40 hover:border-[#14F195] hover:bg-[#14F195]/10 hover:text-[#14F195] transition-colors"
                      onClick={() => handleSignIn('github')}
                      disabled={!!isLoading}
                    >
                      {isLoading === 'github' ? (
                        <ButtonLoader text="Connecting to GitHub..." />
                      ) : (
                        <>
                          <Github className="mr-2 h-5 w-5" />
                          Continue with Github
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full h-11 border-border/40 hover:border-blue-500 hover:bg-blue-500/10 hover:text-blue-500 transition-colors"
                      onClick={() => handleSignIn('google')}
                      disabled={!!isLoading}
                    >
                      {isLoading === 'google' ? (
                        <ButtonLoader text="Connecting to Google..." />
                      ) : (
                        <>
                          <Image 
                            src="/icons/google.svg" 
                            alt="Google" 
                            width={20} 
                            height={20} 
                            className="mr-2" 
                          />
                          Continue with Google
                        </>
                      )}
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full h-11 border-border/40 hover:border-blue-400 hover:bg-blue-400/10 hover:text-blue-400 transition-colors"
                      onClick={() => handleSignIn('twitter')}
                      disabled={!!isLoading}
                    >
                      {isLoading === 'twitter' ? (
                        <ButtonLoader text="Connecting to X..." />
                      ) : (
                        <>
                          <Twitter className="mr-2 h-5 w-5" />
                          Continue with X (Twitter)
                        </>
                      )}
                    </Button>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t border-border/40" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-background px-2 text-muted-foreground">
                        Secure Authentication
                      </span>
                    </div>
                  </div>

                  <p className="px-6 text-center text-sm text-muted-foreground">
                    By continuing, you agree to our{" "}
                    <Link href="/terms" className="underline underline-offset-4 hover:text-primary">
                      Terms of Service
                    </Link>{" "}
                    and{" "}
                    <Link href="/privacy" className="underline underline-offset-4 hover:text-primary">
                      Privacy Policy
                    </Link>
                    .
                  </p>
                </CardContent>
              </Card>
            </div>
          ) : (
            <aside className="fixed hidden h-screen w-64 shrink-0 border-r border-border/40 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/80 lg:block">
              <div className="flex h-full flex-col">
                <div className="flex-1 space-y-1 overflow-y-auto">
                  {sidebarItems.map((section, index) => {
                    if (!isSectionVisible(section)) return null;
                    const visibleItems = section.items.filter(isItemVisible);
                    if (visibleItems.length === 0) return null;

                    return (
                      <div key={section.section} className="px-3 py-2">
                        <h2 className="mb-2 px-4 text-xs font-semibold tracking-tight text-muted-foreground">
                          {section.section}
                        </h2>
                        <div className="space-y-1">
                          {visibleItems.map((item) => (
                            <Link
                              key={item.title}
                              href={item.href}
                              className={cn(
                                'flex items-center justify-between rounded-lg px-4 py-2 text-sm font-medium hover:bg-[#14F195]/10 hover:text-[#14F195] transition-colors',
                                pathname === item.href
                                  ? 'bg-[#14F195]/10 text-[#14F195]'
                                  : 'text-muted-foreground'
                              )}
                            >
                              <span className="flex items-center gap-3">
                                {item.icon}
                                {item.title}
                              </span>
                              {item.badge && (
                                <Badge variant="outline" className="ml-auto">
                                  {item.badge}
                                </Badge>
                              )}
                            </Link>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </aside>
          )}
          <main className="flex-1 overflow-y-auto">
            <div className="container mx-auto p-6 max-w-7xl">
              {children}
            </div>
          </main>
        </div>
      )}
    </>
  );
}

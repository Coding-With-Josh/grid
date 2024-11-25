'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Github, Users, Code, Activity } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Link from 'next/link';

const features = [
  {
    icon: Code,
    title: 'Open Source Projects',
    description: 'Contribute to exciting Solana projects and earn rewards'
  },
  {
    icon: Users,
    title: 'Community Collaboration',
    description: 'Connect with other builders in the Solana ecosystem'
  },
  {
    icon: Activity,
    title: 'Active Development',
    description: 'Stay updated with the latest projects and opportunities'
  },
  {
    icon: Github,
    title: 'Github Integration',
    description: 'Seamlessly connect your Github projects and contributions'
  }
];

const stats = [
  { value: '10K+', label: 'Active Users' },
  { value: '1K+', label: 'Projects' },
  { value: '100K+', label: 'Contributions' },
  { value: '$1M+', label: 'Rewards Distributed' }
];

export default function HomePage() {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/20" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center px-6 py-32 space-y-8">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-4"
          >
            <h1 className="text-4xl sm:text-6xl font-bold gradient-text">
              Build the Future of Solana
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Join the community of builders, creators, and innovators shaping the future of decentralized applications.
            </p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4"
          >
            <Button size="lg" className="gap-2" asChild>
              <Link href="/onboarding">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="https://github.com/your-repo/grid" target="_blank" rel="noopener noreferrer">
                <Github className="mr-2 h-4 w-4" />
                View on Github
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-6">
        <div className="max-w-5xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h2 className="text-3xl font-bold">Why Choose Grid?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Grid provides everything you need to start building and contributing to Solana projects.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card>
                    <CardContent className="pt-6">
                      <div className="space-y-4">
                        <div className="p-2 w-fit rounded-lg bg-primary/10">
                          <Icon className="h-6 w-6 text-primary" />
                        </div>
                        <h3 className="font-semibold">{feature.title}</h3>
                        <CardDescription>{feature.description}</CardDescription>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-24 px-6 bg-secondary/10">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="text-3xl font-bold gradient-text">{stat.value}</div>
                <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6">
        <div className="max-w-5xl mx-auto">
          <Separator className="mb-8" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-muted-foreground">
              2024 Grid. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" asChild>
                <Link href="https://github.com/your-repo/grid" target="_blank" rel="noopener noreferrer">
                  <Github className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/terms">Terms</Link>
              </Button>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/privacy">Privacy</Link>
              </Button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

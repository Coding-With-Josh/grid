'use client';

import { motion } from 'framer-motion';
import { 
  Code, 
  Users, 
  Star,
  GitFork,
  Plus,
  Search,
  ArrowUpRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const projects = [
  {
    name: 'Solana DeFi Hub',
    description: 'A comprehensive DeFi platform built on Solana',
    stars: 128,
    forks: 45,
    contributors: 12,
    language: 'TypeScript',
    status: 'Active',
  },
  {
    name: 'NFT Marketplace',
    description: 'Decentralized NFT marketplace with advanced trading features',
    stars: 89,
    forks: 23,
    contributors: 8,
    language: 'Rust',
    status: 'In Progress',
  },
  {
    name: 'Wallet Connect SDK',
    description: 'Simplified wallet connection for Solana dApps',
    stars: 245,
    forks: 67,
    contributors: 15,
    language: 'TypeScript',
    status: 'Active',
  },
  {
    name: 'Smart Contract Templates',
    description: 'Collection of audited Solana smart contract templates',
    stars: 167,
    forks: 89,
    contributors: 6,
    language: 'Rust',
    status: 'Active',
  },
];

export default function ProjectsPage() {
  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">Projects</h1>
          <p className="text-muted-foreground mt-2">
            Manage and monitor your Solana projects
          </p>
        </div>
        <Button className="gap-2">
          <Plus size={16} />
          New Project
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search projects..." 
            className="pl-9"
          />
        </div>
        <Tabs defaultValue="all" className="w-[400px]">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="active">Active</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.name}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="space-y-1">
                  <CardTitle className="text-xl flex items-center gap-2">
                    {project.name}
                    <Badge 
                      variant={project.status === 'Active' ? 'default' : 'secondary'}
                    >
                      {project.status}
                    </Badge>
                  </CardTitle>
                  <CardDescription>{project.description}</CardDescription>
                </div>
                <Button variant="ghost" size="icon">
                  <ArrowUpRight size={18} />
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Star size={16} />
                    <span>{project.stars}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <GitFork size={16} />
                    <span>{project.forks}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users size={16} />
                    <span>{project.contributors} contributors</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Code size={16} />
                    <span>{project.language}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

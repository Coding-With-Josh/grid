'use client';

import { motion } from 'framer-motion';
import { 
  Activity, 
  Users, 
  Code, 
  Wallet,
  ArrowUp,
  ArrowDown,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const stats = [
  {
    title: 'Total Projects',
    value: '12',
    description: 'Active projects in your portfolio',
    icon: Code,
    change: '+2 from last month',
    trend: 'up'
  },
  {
    title: 'Community Members',
    value: '1,234',
    description: 'Contributors across all projects',
    icon: Users,
    change: '+123 new members',
    trend: 'up'
  },
  {
    title: 'Total Rewards',
    value: '89.4 SOL',
    description: 'Earned from contributions',
    icon: Wallet,
    change: '+12.3 SOL this month',
    trend: 'up'
  },
  {
    title: 'Activity Score',
    value: '92',
    description: 'Based on your recent activity',
    icon: Activity,
    change: '+5 points increase',
    trend: 'up'
  }
];

const recentActivity = [
  {
    id: 1,
    type: 'commit',
    title: 'Updated authentication flow',
    project: 'NFT Marketplace',
    time: '2 hours ago',
    status: 'success'
  },
  {
    id: 2,
    type: 'review',
    title: 'Code review requested',
    project: 'DeFi Dashboard',
    time: '4 hours ago',
    status: 'pending'
  },
  {
    id: 3,
    type: 'issue',
    title: 'Reported bug in payment system',
    project: 'Web3 Wallet',
    time: '6 hours ago',
    status: 'error'
  }
];

const teamMembers = [
  {
    name: 'Alex Johnson',
    role: 'Lead Developer',
    avatar: '/avatars/alex.jpg'
  },
  {
    name: 'Sarah Chen',
    role: 'UI Designer',
    avatar: '/avatars/sarah.jpg'
  },
  {
    name: 'Mike Brown',
    role: 'Backend Dev',
    avatar: '/avatars/mike.jpg'
  }
];

const projectProgress = [
  {
    name: 'NFT Marketplace',
    progress: 75,
    status: 'On Track'
  },
  {
    name: 'Smart Contract Integration',
    progress: 45,
    status: 'In Progress'
  },
  {
    name: 'Mobile App Development',
    progress: 90,
    status: 'Almost Done'
  }
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Welcome Back!</h1>
        <p className="text-muted-foreground mt-2">
          Here's what's happening with your projects today.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Icon size={20} className="text-primary" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-2 mt-1">
                    {stat.trend === 'up' ? (
                      <ArrowUp className="w-4 h-4 text-[#14F195]" />
                    ) : (
                      <ArrowDown className="w-4 h-4 text-red-500" />
                    )}
                    <p className="text-xs text-muted-foreground">
                      {stat.change}
                    </p>
                  </div>
                  <CardDescription className="mt-2">
                    {stat.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Recent Activity */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest actions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-center justify-between p-4 rounded-lg border bg-card"
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-full ${
                      activity.status === 'success' ? 'bg-[#14F195]/20' :
                      activity.status === 'pending' ? 'bg-yellow-500/20' :
                      'bg-red-500/20'
                    }`}>
                      {activity.status === 'success' ? (
                        <CheckCircle2 className="w-4 h-4 text-[#14F195]" />
                      ) : activity.status === 'pending' ? (
                        <Clock className="w-4 h-4 text-yellow-500" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-medium">{activity.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary">{activity.project}</Badge>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">View All Activity</Button>
          </CardFooter>
        </Card>

        {/* Team Members */}
        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>Active contributors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {teamMembers.map((member) => (
                <div key={member.name} className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.name}</p>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">View All Members</Button>
          </CardFooter>
        </Card>

        {/* Project Progress */}
        <Card className="md:col-span-2 lg:col-span-2">
          <CardHeader>
            <CardTitle>Project Progress</CardTitle>
            <CardDescription>Track your active projects</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {projectProgress.map((project) => (
                <div key={project.name} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="font-medium">{project.name}</p>
                    <Badge variant={
                      project.progress >= 90 ? "default" :
                      project.progress >= 50 ? "secondary" :
                      "outline"
                    }>
                      {project.status}
                    </Badge>
                  </div>
                  <Progress value={project.progress} className="h-2" />
                  <p className="text-sm text-muted-foreground text-right">
                    {project.progress}% Complete
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter>
            <Button variant="ghost" className="w-full">View All Projects</Button>
          </CardFooter>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button className="w-full bg-[#14F195] hover:bg-[#14F195]/90 text-black">
                <Code className="mr-2 h-4 w-4" />
                Create New Project
              </Button>
              <Button variant="outline" className="w-full">
                <Users className="mr-2 h-4 w-4" />
                Invite Team Members
              </Button>
              <Button variant="secondary" className="w-full">
                <Wallet className="mr-2 h-4 w-4" />
                Connect Wallet
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

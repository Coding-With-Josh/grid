'use client';

import { motion } from 'framer-motion';
import { Activity, Users, Code, Wallet } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const stats = [
  {
    title: 'Total Projects',
    value: '12',
    description: 'Active projects in your portfolio',
    icon: Code,
    change: '+2 from last month'
  },
  {
    title: 'Community Members',
    value: '1,234',
    description: 'Contributors across all projects',
    icon: Users,
    change: '+123 new members'
  },
  {
    title: 'Total Rewards',
    value: '89.4 SOL',
    description: 'Earned from contributions',
    icon: Wallet,
    change: '+12.3 SOL this month'
  },
  {
    title: 'Activity Score',
    value: '92',
    description: 'Based on your recent activity',
    icon: Activity,
    change: '+5 points increase'
  }
];

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-4xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-2">
          Welcome back! Here's an overview of your activity.
        </p>
      </div>

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
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                  <CardDescription className="mt-2">
                    {stat.description}
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest contributions and updates</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Activity items will go here */}
              <p className="text-muted-foreground text-sm">No recent activity to show</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common tasks and operations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <Button className="w-full">
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

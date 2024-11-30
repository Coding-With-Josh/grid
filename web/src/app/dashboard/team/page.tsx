'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

const teamMembers = [
  {
    id: 1,
    name: 'Sarah Chen',
    role: 'Lead Engineer',
    email: 'sarah.chen@example.com',
    avatar: '/avatars/sarah.jpg',
    status: 'active',
    projects: 8,
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    role: 'Frontend Developer',
    email: 'michael.r@example.com',
    avatar: '/avatars/michael.jpg',
    status: 'active',
    projects: 5,
  },
  {
    id: 3,
    name: 'Emma Wilson',
    role: 'Backend Developer',
    email: 'emma.w@example.com',
    avatar: '/avatars/emma.jpg',
    status: 'away',
    projects: 6,
  },
  {
    id: 4,
    name: 'James Thompson',
    role: 'DevOps Engineer',
    email: 'james.t@example.com',
    avatar: '/avatars/james.jpg',
    status: 'offline',
    projects: 4,
  },
];

function SearchParamsComponent() {
  const searchParams = useSearchParams();
  // Use searchParams here
  return null; // Or return your actual component content
}

export default function TeamPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchParamsComponent />
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Team</h1>
          <p className="text-muted-foreground">
            Manage your team members and their access
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Members
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                Across 4 departments
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Active Now
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                67% of team online
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Projects
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">23</div>
              <p className="text-xs text-muted-foreground">
                Active projects
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Avg. Response
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">14m</div>
              <p className="text-xs text-muted-foreground">
                Response time
              </p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Team Members</CardTitle>
            <CardDescription>
              A list of all team members and their current status.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Member</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Projects</TableHead>
                  <TableHead>Email</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teamMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>
                            {member.name
                              .split(' ')
                              .map((n) => n[0])
                              .join('')}
                          </AvatarFallback>
                        </Avatar>
                        {member.name}
                      </div>
                    </TableCell>
                    <TableCell>{member.role}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          member.status === 'active'
                            ? 'success'
                            : member.status === 'away'
                            ? 'warning'
                            : 'secondary'
                        }
                      >
                        {member.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{member.projects}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {member.email}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Suspense>
  );
}

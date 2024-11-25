'use client';

import { motion } from 'framer-motion';
import { 
  Users,
  MessageSquare,
  Heart,
  Award,
  Search,
  Filter,
  Mail
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";

const members = [
  {
    name: 'Alice Johnson',
    username: '@alice_j',
    role: 'Core Contributor',
    contributions: 156,
    likes: 423,
    messages: 89,
    avatar: '/avatars/alice.jpg',
    status: 'Active',
  },
  {
    name: 'Bob Smith',
    username: '@bob_dev',
    role: 'Developer',
    contributions: 92,
    likes: 245,
    messages: 34,
    avatar: '/avatars/bob.jpg',
    status: 'Active',
  },
  {
    name: 'Carol Williams',
    username: '@carol_w',
    role: 'Designer',
    contributions: 78,
    likes: 312,
    messages: 56,
    avatar: '/avatars/carol.jpg',
    status: 'Away',
  },
  {
    name: 'David Brown',
    username: '@david_b',
    role: 'Core Contributor',
    contributions: 134,
    likes: 567,
    messages: 123,
    avatar: '/avatars/david.jpg',
    status: 'Active',
  },
];

export default function CommunityPage() {
  return (
    <div className="space-y-8 p-8">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-4xl font-bold">Community</h1>
          <p className="text-muted-foreground mt-2">
            Connect with contributors and manage your community
          </p>
        </div>
        <Button className="gap-2">
          <Mail size={16} />
          Invite Members
        </Button>
      </div>

      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search members..." 
            className="pl-9"
          />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="gap-2">
              <Filter size={16} />
              Filter
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>All Members</DropdownMenuItem>
            <DropdownMenuItem>Core Contributors</DropdownMenuItem>
            <DropdownMenuItem>Developers</DropdownMenuItem>
            <DropdownMenuItem>Designers</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="grid gap-6">
        {members.map((member, index) => (
          <motion.div
            key={member.name}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={member.avatar} />
                    <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                  </Avatar>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className='text-xl font-semibold'>{member.name}</CardTitle>
                      <Badge variant={member.status === 'Active' ? 'default' : 'secondary'}>
                        {member.status}
                      </Badge>
                    </div>
                    <CardDescription className="flex items-center gap-2">
                      {member.username} • {member.role}
                    </CardDescription>
                  </div>
                </div>
                <Button variant="outline">View Profile</Button>
              </CardHeader>
              <CardContent>
                <div className="flex gap-6 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Award size={14} />
                    <span>{member.contributions} contributions</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Heart size={14} />
                    <span>{member.likes} likes</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MessageSquare size={14} />
                    <span>{member.messages} messages</span>
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

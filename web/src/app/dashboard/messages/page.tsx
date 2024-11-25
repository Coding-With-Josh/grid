'use client';

import { motion } from 'framer-motion';
import { 
  MessageSquare,
  Search,
  Plus,
  Star,
  MoreVertical,
  Pin,
  Archive
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";
import { ScrollArea } from "@/components/ui/scroll-area";

const conversations = [
  {
    id: 1,
    name: 'DeFi Project Team',
    participants: [
      { name: 'Alice Johnson', avatar: '/avatars/alice.jpg' },
      { name: 'Bob Smith', avatar: '/avatars/bob.jpg' },
      { name: 'Carol Williams', avatar: '/avatars/carol.jpg' },
    ],
    lastMessage: "Let's discuss the new staking feature implementation.",
    timestamp: '2 min ago',
    unread: 3,
    pinned: true,
  },
  {
    id: 2,
    name: 'NFT Marketplace Design',
    participants: [
      { name: 'David Brown', avatar: '/avatars/david.jpg' },
      { name: 'Eva Martinez', avatar: '/avatars/eva.jpg' },
    ],
    lastMessage: "I've uploaded the new UI mockups for review.",
    timestamp: '1 hour ago',
    unread: 0,
    pinned: true,
  },
  {
    id: 3,
    name: 'Smart Contract Audit',
    participants: [
      { name: 'Frank Lee', avatar: '/avatars/frank.jpg' },
      { name: 'Grace Kim', avatar: '/avatars/grace.jpg' },
    ],
    lastMessage: 'The initial audit report is ready for your review.',
    timestamp: '3 hours ago',
    unread: 1,
    pinned: false,
  },
  {
    id: 4,
    name: 'Community Support',
    participants: [
      { name: 'Henry Wilson', avatar: '/avatars/henry.jpg' },
      { name: 'Ivy Chen', avatar: '/avatars/ivy.jpg' },
    ],
    lastMessage: 'We need to address the recent community feedback.',
    timestamp: 'Yesterday',
    unread: 0,
    pinned: false,
  },
];

export default function MessagesPage() {
  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Sidebar */}
      <div className="w-80 border-r border-border p-4 flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Messages</h2>
          <Button size="icon" variant="ghost">
            <Plus size={18} />
          </Button>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search messages..." 
            className="pl-9"
          />
        </div>

        <ScrollArea className="flex-1 -mx-4">
          <div className="px-4 space-y-4">
            {conversations.map((conversation, index) => (
              <motion.div
                key={conversation.id}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={`cursor-pointer transition-colors hover:bg-muted/50 ${conversation.pinned ? 'border-primary/50' : ''}`}>
                  <CardHeader className="p-4 pb-2 space-y-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CardTitle className="text-sm font-medium">
                          {conversation.name}
                        </CardTitle>
                        {conversation.pinned && <Pin size={12} className="text-muted-foreground" />}
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreVertical size={14} />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Pin className="mr-2 h-4 w-4" />
                            {conversation.pinned ? 'Unpin' : 'Pin'}
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Archive className="mr-2 h-4 w-4" />
                            Archive
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-4 pt-2">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex -space-x-2">
                        {conversation.participants.slice(0, 3).map((participant) => (
                          <Avatar key={participant.name} className="h-6 w-6 border-2 border-background">
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback>{participant.name[0]}</AvatarFallback>
                          </Avatar>
                        ))}
                      </div>
                      {conversation.participants.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{conversation.participants.length - 3} more
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {conversation.lastMessage}
                    </p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-muted-foreground">
                        {conversation.timestamp}
                      </span>
                      {conversation.unread > 0 && (
                        <Badge variant="default" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                          {conversation.unread}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 flex items-center justify-center bg-muted/10">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-2">Select a Conversation</h3>
          <p className="text-sm text-muted-foreground">
            Choose a conversation from the sidebar to start messaging
          </p>
        </div>
      </div>
    </div>
  );
}

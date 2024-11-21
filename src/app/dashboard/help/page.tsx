'use client';

import { motion } from 'framer-motion';
import { 
  Book,
  MessageCircle,
  FileText,
  HelpCircle,
  Search,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const resources = [
  {
    title: 'Documentation',
    description: 'Comprehensive guides and API references',
    icon: Book,
    link: '#',
  },
  {
    title: 'Community Forum',
    description: 'Connect with other developers',
    icon: MessageCircle,
    link: '#',
  },
  {
    title: 'Tutorials',
    description: 'Step-by-step learning materials',
    icon: FileText,
    link: '#',
  },
];

const faqs = [
  {
    question: 'How do I get started with Grid?',
    answer: "To get started with Grid, first connect your Solana wallet and complete the onboarding process. You'll then have access to all features including project management, community tools, and more.",
  },
  {
    question: 'What are the benefits of being a contributor?',
    answer: 'Contributors get access to exclusive features, can participate in project governance, earn rewards for their contributions, and build their reputation in the Solana ecosystem.',
  },
  {
    question: 'How does project collaboration work?',
    answer: 'Project collaboration in Grid is streamlined through our integrated tools. You can create projects, invite team members, manage tasks, and communicate all in one place.',
  },
  {
    question: 'What security measures are in place?',
    answer: 'We implement industry-standard security practices including encryption, secure wallet connections, and regular security audits to protect your data and assets.',
  },
];

export default function HelpPage() {
  return (
    <div className="space-y-8 p-8">
      <div>
        <h1 className="text-4xl font-bold">Help Center</h1>
        <p className="text-muted-foreground mt-2">
          Find answers and get support
        </p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
        <Input 
          placeholder="Search for help..." 
          className="pl-10 h-12 text-lg"
        />
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {resources.map((resource, index) => {
          const Icon = resource.icon;
          return (
            <motion.div
              key={resource.title}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:border-primary/50 transition-colors cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      <Icon size={24} />
                    </div>
                    <div>
                      <CardTitle>{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Button variant="ghost" className="gap-2 w-full justify-between group">
                    Visit Resource
                    <ExternalLink size={16} className="group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
            <CardDescription>
              Quick answers to common questions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible>
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Need More Help?</CardTitle>
            <CardDescription>
              Get in touch with our support team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Our support team is available 24/7 to help you with any questions or issues you might have.
            </p>
            <div className="space-y-4">
              <Button className="w-full gap-2">
                <MessageCircle size={16} />
                Start a Conversation
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <HelpCircle size={16} />
                Submit a Ticket
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

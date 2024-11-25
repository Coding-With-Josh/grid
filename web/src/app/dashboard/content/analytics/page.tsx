'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart,
  Calendar,
  TrendingUp,
  Users,
  Video,
  Image as ImageIcon,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";

const stats = [
  {
    title: "Total Views",
    value: "2.7M",
    change: "+12.3%",
    trend: "up",
  },
  {
    title: "Engagement Rate",
    value: "4.2%",
    change: "+0.8%",
    trend: "up",
  },
  {
    title: "Content Published",
    value: "342",
    change: "-2.1%",
    trend: "down",
  },
  {
    title: "Active Users",
    value: "18.2K",
    change: "+5.4%",
    trend: "up",
  },
];

const topContent = [
  {
    title: "Getting Started with Grid",
    type: "Video",
    views: 245000,
    engagement: "8.3%",
  },
  {
    title: "Grid Design System",
    type: "Document",
    views: 128000,
    engagement: "6.7%",
  },
  {
    title: "Feature Highlights",
    type: "Image",
    views: 98000,
    engagement: "5.2%",
  },
];

const typeIcons = {
  Video: Video,
  Image: ImageIcon,
  Document: FileText,
};

export default function ContentAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Content Analytics</h1>
          <p className="text-muted-foreground">Track your content performance</p>
        </div>
        <div className="flex items-center gap-4">
          <Select defaultValue="7d">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="24h">Last 24 hours</SelectItem>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 90 days</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Custom Range
          </Button>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              {stat.trend === "up" ? (
                <ArrowUpRight className="h-4 w-4 text-[#14F195]" />
              ) : (
                <ArrowDownRight className="h-4 w-4 text-red-500" />
              )}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p
                className={`text-xs ${
                  stat.trend === "up" ? "text-[#14F195]" : "text-red-500"
                }`}
              >
                {stat.change} from last period
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Content Performance</CardTitle>
            <CardDescription>Views and engagement over time</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
              <BarChart className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Chart placeholder</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Audience Demographics</CardTitle>
            <CardDescription>User distribution by region and device</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] flex items-center justify-center border-2 border-dashed rounded-lg">
              <Users className="h-8 w-8 text-muted-foreground" />
              <span className="ml-2 text-muted-foreground">Chart placeholder</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Content</CardTitle>
          <CardDescription>Content with highest engagement</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topContent.map((content) => {
              const Icon = typeIcons[content.type];
              return (
                <div
                  key={content.title}
                  className="flex items-center justify-between p-4 hover:bg-secondary/20 rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded bg-secondary/20 flex items-center justify-center">
                      <Icon className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">{content.title}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs">
                          {content.type}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {content.views.toLocaleString()} views
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-[#14F195]" />
                    <span className="font-medium text-[#14F195]">{content.engagement}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

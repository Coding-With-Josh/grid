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
  Menu,
  X,
} from 'lucide-react';
import { SidebarSection } from '@/types/dashboard';

const iconClassName = "h-5 w-5 mr-2 transition-transform group-hover/item:scale-110";

export const sidebarItems: SidebarSection[] = [
  {
    section: 'Overview',
    items: [
      {   
        title: 'Dashboard',
        href: '/dashboard',
        icon: <LayoutDashboard className={iconClassName} />
      }
    ]
  },
  {
    section: 'AI Tools',
    items: [
      {
        title: 'Meeting Summarizer',
        href: '/dashboard/ai/meeting-summarizer',
        icon: <NotebookTabs className={iconClassName} />
      },
      {
        title: 'Copilot',
        href: '/dashboard/ai/copilot',
        icon: <Bot className={iconClassName} />
      }
    ]
  },
  {
    section: 'Design Tools',
    roles: ['designer', 'admin'],
    items: [
      {
        title: 'Design Projects',
        href: '/dashboard/design/projects',
        icon: <Palette className={iconClassName} />,
        badge: '3'
      },
      {
        title: 'Assets',
        href: '/dashboard/design/assets',
        icon: <ImageIcon className={iconClassName} />
      },
      {
        title: 'Prototypes',
        href: '/dashboard/design/prototypes',
        icon: <PenTool className={iconClassName} />
      }
    ]
  },
  {
    section: 'Development',
    roles: ['developer', 'admin'],
    items: [
      {
        title: 'Code Projects',
        href: '/dashboard/dev/projects',
        icon: <Code2 className={iconClassName} />,
        badge: '2'
      },
      {
        title: 'Components',
        href: '/dashboard/dev/components',
        icon: <Boxes className={iconClassName} />
      },
      {
        title: 'Repositories',
        href: '/dashboard/dev/repos',
        icon: <GitBranch className={iconClassName} />
      }
    ]
  },
  {
    section: 'Content Creation',
    roles: ['creator', 'admin'],
    items: [
      {
        title: 'Media Projects',
        href: '/dashboard/content/projects',
        icon: <Video className={iconClassName} />,
        badge: '5'
      },
      {
        title: 'Uploads',
        href: '/dashboard/content/uploads',
        icon: <Upload className={iconClassName} />
      },
      {
        title: 'Video Editor',
        href: '/dashboard/content/video',
        icon: <Film className={iconClassName} />
      },
      {
        title: 'Audio Editor',
        href: '/dashboard/content/audio',
        icon: <Mic className={iconClassName} />
      }
    ]
  },
  {
    section: 'Collaboration',
    items: [
      {
        title: 'Team',
        href: '/dashboard/team',
        icon: <Users className={iconClassName} />
      },
      {
        title: 'Messages',
        href: '/dashboard/messages',
        icon: <MessageSquare className={iconClassName} />,
        badge: '3'
      },
      {
        title: 'Share',
        href: '/dashboard/share',
        icon: <Share2 className={iconClassName} />
      }
    ]
  },
  {
    section: 'System',
    items: [
      {
        title: 'Security',
        href: '/dashboard/security',
        icon: <Shield className={iconClassName} />,
        roles: ['admin']
      },
      {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: <Settings className={iconClassName} />
      }
    ]
  }
];

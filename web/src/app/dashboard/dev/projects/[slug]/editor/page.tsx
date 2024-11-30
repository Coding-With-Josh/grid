"use client";

import { useCallback, useEffect, useState } from "react"
import { nanoid } from "nanoid"
import {
  DndContext,
  DragOverlay,
  useDraggable,
  useDroppable,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { cn } from "@/lib/utils"

// UI Components
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Slider } from "@/components/ui/slider"
import { ModeToggle } from "@/components/mode-toggle"
import { EditorNavbar } from '@/components/editor/editor-navbar';
import { useToast } from '@/components/ui/use-toast';

// Icons
import {
  AlertCircle,
  ChevronLeft,
  Code,
  FileText,
  Grid3X3,
  Heart,
  ImageIcon,
  Keyboard,
  Laptop,
  Layout,
  LayoutGrid,
  Link as LinkIcon,
  List,
  MessageCircle,
  Monitor,
  Moon,
  Play,
  Search,
  Share2,
  Smartphone,
  Square,
  Star,
  Sun,
  Table2,
  Tablet,
  Type,
  User,
} from "lucide-react"

import {
  TextIcon,
  ButtonIcon,
  InputIcon,
  TextareaIcon,
  CheckboxIcon,
  RadioIcon,
  SelectIcon,
  SwitchIcon,
  DividerIcon,
  SpacerIcon,
  BadgeIcon,
  TagIcon,
  ContainerIcon,
  CardIcon,
  ProgressIcon,
} from "@/components/icons/custom-icons"

// Widget Categories
const widgetCategories = {
  text: {
    label: "Text",
    widgets: ["text", "heading1", "heading2", "paragraph", "link"]
  },
  form: {
    label: "Form",
    widgets: ["button", "input", "textarea", "checkbox", "radio", "select", "switch"]
  },
  layout: {
    label: "Layout",
    widgets: ["container", "card", "divider", "spacer"]
  },
  media: {
    label: "Media",
    widgets: ["image", "video", "icon", "avatar"]
  },
  data: {
    label: "Data",
    widgets: ["table", "list", "badge", "tag"]
  },
  interactive: {
    label: "Interactive",
    widgets: ["alert", "progress"]
  },
  social: {
    label: "Social",
    widgets: ["rating", "like", "share", "comment"]
  }
} as const;

// Widget type definitions
const widgetDefinitions = {
  // Text Elements
  text: {
    type: "text",
    label: "Text",
    icon: TextIcon,
    defaultProps: { text: "Text content" }
  },
  heading1: {
    type: "heading1",
    label: "H1",
    icon: Type,
    defaultProps: { text: "Heading 1" }
  },
  heading2: {
    type: "heading2",
    label: "H2",
    icon: Type,
    defaultProps: { text: "Heading 2" }
  },
  paragraph: {
    type: "paragraph",
    label: "Paragraph",
    icon: TextIcon,
    defaultProps: { text: "Paragraph text" }
  },
  link: {
    type: "link",
    label: "Link",
    icon: LinkIcon,
    defaultProps: { text: "Link", href: "#" }
  },

  // Form Elements
  button: {
    type: "button",
    label: "Button",
    icon: ButtonIcon,
    defaultProps: { text: "Button", variant: "default", size: "default" }
  },
  input: {
    type: "input",
    label: "Input",
    icon: InputIcon,
    defaultProps: { type: "text", placeholder: "Enter text..." }
  },
  textarea: {
    type: "textarea",
    label: "Textarea",
    icon: TextareaIcon,
    defaultProps: { placeholder: "Enter text..." }
  },
  checkbox: {
    type: "checkbox",
    label: "Checkbox",
    icon: CheckboxIcon,
    defaultProps: { label: "Checkbox" }
  },
  radio: {
    type: "radio",
    label: "Radio",
    icon: RadioIcon,
    defaultProps: { label: "Radio" }
  },
  select: {
    type: "select",
    label: "Select",
    icon: SelectIcon,
    defaultProps: { placeholder: "Select..." }
  },
  switch: {
    type: "switch",
    label: "Switch",
    icon: SwitchIcon,
    defaultProps: { label: "Switch" }
  },

  // Layout Elements
  container: {
    type: "container",
    label: "Container",
    icon: ContainerIcon,
    defaultProps: {}
  },
  card: {
    type: "card",
    label: "Card",
    icon: CardIcon,
    defaultProps: {}
  },
  divider: {
    type: "divider",
    label: "Divider",
    icon: DividerIcon,
    defaultProps: {}
  },
  spacer: {
    type: "spacer",
    label: "Spacer",
    icon: SpacerIcon,
    defaultProps: { height: 16 }
  },

  // Media Elements
  image: {
    type: "image",
    label: "Image",
    icon: ImageIcon,
    defaultProps: {}
  },
  video: {
    type: "video",
    label: "Video",
    icon: FileText,
    defaultProps: {}
  },
  icon: {
    type: "icon",
    label: "Icon",
    icon: Star,
    defaultProps: {}
  },
  avatar: {
    type: "avatar",
    label: "Avatar",
    icon: User,
    defaultProps: {}
  },

  // Data Display
  table: {
    type: "table",
    label: "Table",
    icon: Table2,
    defaultProps: {}
  },
  list: {
    type: "list",
    label: "List",
    icon: List,
    defaultProps: {}
  },
  badge: {
    type: "badge",
    label: "Badge",
    icon: BadgeIcon,
    defaultProps: { text: "Badge" }
  },
  tag: {
    type: "tag",
    label: "Tag",
    icon: TagIcon,
    defaultProps: { text: "Tag" }
  },

  // Interactive Elements
  alert: {
    type: "alert",
    label: "Alert",
    icon: AlertCircle,
    defaultProps: { text: "Alert" }
  },
  progress: {
    type: "progress",
    label: "Progress",
    icon: ProgressIcon,
    defaultProps: { value: 50 }
  },

  // Social Elements
  rating: {
    type: "rating",
    label: "Rating",
    icon: Star,
    defaultProps: { value: 5 }
  },
  like: {
    type: "like",
    label: "Like",
    icon: Heart,
    defaultProps: {}
  },
  share: {
    type: "share",
    label: "Share",
    icon: Share2,
    defaultProps: {}
  },
  comment: {
    type: "comment",
    label: "Comment",
    icon: MessageCircle,
    defaultProps: {}
  }
} as const;

// Device sizes
const deviceSizes = [
  { id: "mobile", icon: Smartphone, label: "Mobile", width: 390 },
  { id: "tablet", icon: Tablet, label: "Tablet", width: 768 },
  { id: "desktop", icon: Monitor, label: "Desktop", width: 1280 },
] as const;

// Sidebar items
const sidebarItems = [
  { id: "layers", icon: Layout, label: "Layers" },
  { id: "assets", icon: ImageIcon, label: "Assets" },
  { id: "settings", icon: Moon, label: "Settings" },
] as const;

// Widget Property Definitions
const widgetProperties = {
    // Text Elements
    text: {
        text: { type: "string", default: "Text content" },
        fontSize: { type: "number", default: 16, min: 8, max: 72, unit: "px" },
        fontWeight: { 
          type: "select", 
          options: ["normal", "medium", "semibold", "bold"],
          default: "normal"
        },
        fontFamily: {
          type: "select",
          options: ["sans", "serif", "mono"],
          default: "sans"
        },
        letterSpacing: { type: "number", default: 0, min: -2, max: 10, unit: "px" },
        lineHeight: { type: "number", default: 1.5, min: 1, max: 3, step: 0.1 },
        color: { type: "color", default: "#000000" },
        alignment: {
          type: "select",
          options: ["left", "center", "right"],
          default: "left"
        },
        transform: {
          type: "select",
          options: ["none", "uppercase", "lowercase", "capitalize"],
          default: "none"
        },
        opacity: { type: "number", default: 100, min: 0, max: 100, unit: "%" },
        animation: {
          type: "select",
          options: ["none", "fade", "slide", "bounce"],
          default: "none"
        }
      },
    heading1: {
      text: { type: "string", default: "Heading 1" },
      fontSize: { type: "number", default: 36, min: 24, max: 96, unit: "px" },
      fontWeight: { 
        type: "select", 
        options: ["normal", "medium", "semibold", "bold"],
        default: "bold"
      },
      fontFamily: {
        type: "select",
        options: ["sans", "serif", "mono"],
        default: "sans"
      },
      letterSpacing: { type: "number", default: -0.5, min: -2, max: 10, unit: "px" },
      lineHeight: { type: "number", default: 1.2, min: 1, max: 2, step: 0.1 },
      color: { type: "color", default: "#000000" },
      alignment: {
        type: "select",
        options: ["left", "center", "right"],
        default: "left"
      },
      marginBottom: { type: "number", default: 24, min: 0, max: 96, unit: "px" }
    },
    heading2: {
      text: { type: "string", default: "Heading 2" },
      fontSize: { type: "number", default: 24, min: 18, max: 72, unit: "px" },
      fontWeight: { 
        type: "select", 
        options: ["normal", "medium", "semibold", "bold"],
        default: "semibold"
      },
      fontFamily: {
        type: "select",
        options: ["sans", "serif", "mono"],
        default: "sans"
      },
      letterSpacing: { type: "number", default: -0.25, min: -2, max: 10, unit: "px" },
      lineHeight: { type: "number", default: 1.3, min: 1, max: 2, step: 0.1 },
      color: { type: "color", default: "#000000" },
      alignment: {
        type: "select",
        options: ["left", "center", "right"],
        default: "left"
      },
      marginBottom: { type: "number", default: 20, min: 0, max: 96, unit: "px" }
    },
    paragraph: {
      text: { type: "string", default: "Paragraph text" },
      fontSize: { type: "number", default: 16, min: 8, max: 72, unit: "px" },
      fontWeight: { 
        type: "select", 
        options: ["normal", "medium", "semibold", "bold"],
        default: "normal"
      },
      fontFamily: {
        type: "select",
        options: ["sans", "serif", "mono"],
        default: "sans"
      },
      letterSpacing: { type: "number", default: 0, min: -2, max: 10, unit: "px" },
      lineHeight: { type: "number", default: 1.6, min: 1, max: 3, step: 0.1 },
      color: { type: "color", default: "#000000" },
      alignment: {
        type: "select",
        options: ["left", "center", "right", "justify"],
        default: "left"
      },
      marginBottom: { type: "number", default: 16, min: 0, max: 96, unit: "px" }
    },
    link: {
      text: { type: "string", default: "Link text" },
      url: { type: "string", default: "https://" },
      color: { type: "color", default: "#0000FF" },
      underline: { type: "boolean", default: true },
      fontSize: { type: "number", default: 16, min: 8, max: 72, unit: "px" },
      fontWeight: { 
        type: "select", 
        options: ["normal", "medium", "semibold", "bold"],
        default: "normal"
      },
      target: {
        type: "select",
        options: ["_self", "_blank", "_parent", "_top"],
        default: "_self"
      },
      rel: {
        type: "select",
        options: ["none", "nofollow", "noopener", "noreferrer"],
        default: "none"
      },
      hoverColor: { type: "color", default: "#0000CC" },
      hoverUnderline: { type: "boolean", default: true },
      ariaLabel: { type: "string", default: "" }
    },
  
    // Form Elements
    button: {
      text: { type: "string", default: "Button" },
      variant: {
        type: "select",
        options: ["default", "secondary", "destructive", "outline", "ghost", "link"],
        default: "default"
      },
      size: {
        type: "select",
        options: ["default", "sm", "lg", "icon"],
        default: "default"
      },
      width: {
        type: "select",
        options: ["auto", "full"],
        default: "auto"
      },
      loading: { type: "boolean", default: false },
      disabled: { type: "boolean", default: false },
      icon: {
        type: "select",
        options: ["none", "start", "end"],
        default: "none"
      },
      iconType: {
        type: "select",
        options: ["arrow", "plus", "minus", "check", "x"],
        default: "arrow"
      },
      animation: {
        type: "select",
        options: ["none", "pulse", "bounce", "spin"],
        default: "none"
      },
      tooltip: { type: "string", default: "" },
      ariaLabel: { type: "string", default: "" }
    },
    input: {
        placeholder: { type: "string", default: "Enter text..." },
        type: {
          type: "select",
          options: ["text", "email", "password", "number", "tel", "url", "search", "date", "time", "datetime-local"],
          default: "text"
        },
        required: { type: "boolean", default: false },
        disabled: { type: "boolean", default: false },
        readOnly: { type: "boolean", default: false },
        autoComplete: { type: "boolean", default: true },
        validation: {
          type: "select",
          options: ["none", "email", "url", "phone", "custom"],
          default: "none"
        },
        pattern: { type: "string", default: "" },
        minLength: { type: "number", default: 0, min: 0, max: 100 },
        maxLength: { type: "number", default: 100, min: 0, max: 1000 },
        prefix: { type: "string", default: "" },
        suffix: { type: "string", default: "" },
        icon: {
          type: "select",
          options: ["none", "search", "mail", "lock", "user", "calendar", "clock", "phone", "link"],
          default: "none"
        },
        iconPosition: {
          type: "select",
          options: ["left", "right"],
          default: "left"
        },
        clearable: { type: "boolean", default: false },
        labelText: { type: "string", default: "" },
        helperText: { type: "string", default: "" },
        errorText: { type: "string", default: "" },
        size: {
          type: "select",
          options: ["default", "sm", "lg"],
          default: "default"
        },
        variant: {
          type: "select",
          options: ["default", "filled", "outline", "underline"],
          default: "default"
        },
        fullWidth: { type: "boolean", default: false },
        spellCheck: { type: "boolean", default: true },
        autoCapitalize: {
          type: "select",
          options: ["none", "sentences", "words", "characters"],
          default: "none"
        },
        min: { type: "string", default: "" },
        max: { type: "string", default: "" },
        step: { type: "string", default: "" }
      },
    textarea: {
      placeholder: { type: "string", default: "Enter text..." },
      rows: { type: "number", default: 4, min: 1, max: 20 },
      required: { type: "boolean", default: false },
      disabled: { type: "boolean", default: false }
    },
    checkbox: {
      label: { type: "string", default: "Checkbox" },
      checked: { type: "boolean", default: false },
      disabled: { type: "boolean", default: false }
    },
    radio: {
      options: { type: "string", default: "Option 1, Option 2, Option 3" },
      defaultValue: { type: "string", default: "Option 1" },
      disabled: { type: "boolean", default: false }
    },
    select: {
      placeholder: { type: "string", default: "Select an option" },
      options: { type: "string", default: "Option 1, Option 2, Option 3" },
      disabled: { type: "boolean", default: false }
    },
    switch: {
      label: { type: "string", default: "Toggle" },
      checked: { type: "boolean", default: false },
      disabled: { type: "boolean", default: false }
    },
  
    // Layout Elements
    container: {
      padding: { type: "number", default: 16, min: 0, max: 64, unit: "px" },
      background: { type: "color", default: "transparent" },
      borderStyle: {
        type: "select",
        options: ["none", "solid", "dashed", "dotted"],
        default: "none"
      },
      borderWidth: { type: "number", default: 1, min: 0, max: 8, unit: "px" },
      borderColor: { type: "color", default: "#e2e8f0" },
      borderRadius: { type: "number", default: 8, min: 0, max: 32, unit: "px" }
    },
    card: {
      padding: { type: "number", default: 16, min: 0, max: 64, unit: "px" },
      background: { type: "color", default: "#ffffff" },
      shadow: {
        type: "select",
        options: ["none", "sm", "md", "lg", "xl"],
        default: "md"
      },
      borderRadius: { type: "number", default: 8, min: 0, max: 32, unit: "px" }
    },
    divider: {
      style: {
        type: "select",
        options: ["solid", "dashed", "dotted"],
        default: "solid"
      },
      color: { type: "color", default: "#e2e8f0" },
      thickness: { type: "number", default: 1, min: 1, max: 8, unit: "px" }
    },
    spacer: {
      height: { type: "number", default: 16, min: 0, max: 128, unit: "px" }
    },
  
    // Media Elements
    image: {
      src: { type: "string", default: "https://via.placeholder.com/300x200" },
      alt: { type: "string", default: "Image" },
      width: { type: "number", default: 300, min: 0, max: 1200, unit: "px" },
      height: { type: "number", default: 200, min: 0, max: 1200, unit: "px" },
      objectFit: {
        type: "select",
        options: ["contain", "cover", "fill", "none"],
        default: "cover"
      }
    },
    video: {
      src: { type: "string", default: "" },
      autoplay: { type: "boolean", default: false },
      controls: { type: "boolean", default: true },
      loop: { type: "boolean", default: false },
      muted: { type: "boolean", default: false }
    },
    icon: {
      name: {
        type: "select",
        options: ["heart", "star", "user", "search", "settings"],
        default: "heart"
      },
      size: { type: "number", default: 24, min: 12, max: 64, unit: "px" },
      color: { type: "color", default: "#000000" }
    },
    avatar: {
      src: { type: "string", default: "https://via.placeholder.com/40x40" },
      alt: { type: "string", default: "Avatar" },
      size: {
        type: "select",
        options: ["sm", "md", "lg", "xl"],
        default: "md"
      }
    },
  
    // Data Elements
    table: {
      columns: { type: "string", default: "Column 1, Column 2, Column 3" },
      data: { type: "string", default: "Row 1 Data, Row 1 Data, Row 1 Data\nRow 2 Data, Row 2 Data, Row 2 Data" },
      striped: { type: "boolean", default: true },
      hoverable: { type: "boolean", default: true }
    },
    list: {
      type: {
        type: "select",
        options: ["bullet", "number", "check"],
        default: "bullet"
      },
      items: { type: "string", default: "Item 1\nItem 2\nItem 3" }
    },
    badge: {
      text: { type: "string", default: "Badge" },
      variant: {
        type: "select",
        options: ["default", "secondary", "destructive", "outline"],
        default: "default"
      }
    },
    tag: {
      text: { type: "string", default: "Tag" },
      color: { type: "color", default: "#e2e8f0" },
      removable: { type: "boolean", default: true }
    },
  
    // Interactive Elements
    alert: {
      title: { type: "string", default: "Alert Title" },
      description: { type: "string", default: "Alert description goes here." },
      variant: {
        type: "select",
        options: ["default", "destructive"],
        default: "default"
      },
      dismissible: { type: "boolean", default: true }
    },
    progress: {
      value: { type: "number", default: 50, min: 0, max: 100 },
      showValue: { type: "boolean", default: true },
      size: {
        type: "select",
        options: ["sm", "md", "lg"],
        default: "md"
      }
    },
  
    // Social Elements
    rating: {
      value: { type: "number", default: 3, min: 0, max: 5 },
      size: {
        type: "select",
        options: ["sm", "md", "lg"],
        default: "md"
      },
      color: { type: "color", default: "#FFD700" }
    },
    like: {
      count: { type: "number", default: 0, min: 0 },
      liked: { type: "boolean", default: false },
      showCount: { type: "boolean", default: true }
    },
    share: {
      platforms: {
        type: "select",
        options: ["all", "social", "messaging"],
        default: "all"
      },
      showCount: { type: "boolean", default: true }
    },
    comment: {
      placeholder: { type: "string", default: "Write a comment..." },
      showAvatar: { type: "boolean", default: true },
      allowReplies: { type: "boolean", default: true }
    }
  };
  
  // ... (rest of the code remains the same)

// Draggable Widget Component
function DraggableWidget({
  type,
  label,
  icon: Icon,
}: {
  type: string;
  label: string;
  icon: React.ComponentType<any>;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: type,
    data: { type, label },
  });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "aspect-square flex flex-col items-center justify-center gap-2 p-2",
        "rounded-lg border border-border/40 bg-card hover:bg-accent/40",
        "transition-colors cursor-grab active:cursor-grabbing",
        isDragging && "opacity-50"
      )}
      {...attributes}
      {...listeners}
    >
      <Icon className="h-6 w-6 text-muted-foreground" />
      <span className="text-xs text-center text-muted-foreground">{label}</span>
    </div>
  );
}

// Droppable Canvas Component
function DroppableCanvas({ children }: { children: React.ReactNode }) {
  const { setNodeRef } = useDroppable({
    id: "canvas",
  });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "min-h-[calc(100vh-8rem)] w-full rounded-lg",
        "bg-background/50 transition-colors",
        "relative overflow-hidden"
      )}
    >
      {/* Grid Background */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]" 
        style={{ backgroundSize: '20px 20px', opacity: 0 }}
      />
      
      {/* Content Layer */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Properties Panel Component
function PropertiesPanel({ 
  selectedElement, 
  elements, 
  onChange 
}: { 
  selectedElement: string | null;
  elements: Array<any>;
  onChange: (elements: Array<any>) => void;
}) {
  const element = elements.find(el => el.id === selectedElement);
  if (!element) return null;

  const properties = widgetProperties[element.type as keyof typeof widgetProperties];
  if (!properties) return null;

  const updateProperty = (property: string, value: any) => {
    const updatedElements = elements.map(el => {
      if (el.id === selectedElement) {
        return {
          ...el,
          props: {
            ...el.props,
            [property]: value
          }
        };
      }
      return el;
    });
    onChange(updatedElements);
  };

  return (
    <div className="w-80 border-l bg-background overflow-y-auto">
      <div className="p-4 border-b bg-muted/20">
        <h2 className="font-semibold">Properties</h2>
        <p className="text-xs text-muted-foreground mt-1">
          Edit {element.type} properties
        </p>
      </div>
      
      <div className="p-4 space-y-4">
        {Object.entries(properties).map(([key, config]: [string, any]) => (
          <div key={key} className="space-y-2">
            <label className="text-sm font-medium flex items-center justify-between">
              {key.charAt(0).toUpperCase() + key.slice(1)}
              {config.unit && (
                <span className="text-xs text-muted-foreground">{config.unit}</span>
              )}
            </label>
            
            {config.type === "string" && (
              <Input
                value={element.props[key] ?? config.default}
                onChange={e => updateProperty(key, e.target.value)}
                className="h-8"
              />
            )}
            
            {config.type === "number" && (
              <div className="flex gap-2">
                <Input
                  type="number"
                  value={element.props[key] ?? config.default}
                  onChange={e => updateProperty(key, Number(e.target.value))}
                  min={config.min}
                  max={config.max}
                  className="h-8"
                />
                <Slider
                  value={[element.props[key] ?? config.default]}
                  onValueChange={([value]) => updateProperty(key, value)}
                  min={config.min}
                  max={config.max}
                  step={1}
                  className="flex-1"
                />
              </div>
            )}
            
            {config.type === "select" && (
              <Select
                value={element.props[key] ?? config.default}
                onValueChange={value => updateProperty(key, value)}
              >
                <SelectTrigger className="h-8">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {config.options.map((option: string) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            
            {config.type === "boolean" && (
              <Switch
                checked={element.props[key] ?? config.default}
                onCheckedChange={value => updateProperty(key, value)}
              />
            )}
            
            {config.type === "color" && (
              <div className="flex gap-2">
                <div 
                  className="w-8 h-8 rounded border"
                  style={{ backgroundColor: element.props[key] ?? config.default }}
                />
                <Input
                  value={element.props[key] ?? config.default}
                  onChange={e => updateProperty(key, e.target.value)}
                  className="h-8 flex-1"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

import { WidgetPreview } from './preview/widget-preview';

export default function EditorPage() {
  const [elements, setElements] = useState<Array<any>>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [history, setHistory] = useState<Array<any>>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const { toast } = useToast();
  const params = useParams();
  const projectId = params.slug as string;

  // History management
  const addToHistory = useCallback((newElements: Array<any>) => {
    setHistory(prev => {
      const newHistory = [...prev.slice(0, historyIndex + 1), newElements];
      if (newHistory.length > 50) { // Limit history size
        newHistory.shift();
      }
      return newHistory;
    });
    setHistoryIndex(prev => prev + 1);
  }, [historyIndex]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      setElements(history[historyIndex - 1]);
    }
  }, [history, historyIndex]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      setElements(history[historyIndex + 1]);
    }
  }, [history, historyIndex]);

  // Save changes
  const handleSave = async () => {
    try {
      // TODO: Implement save to backend
      toast({
        title: "Changes saved",
        description: "Your changes have been saved successfully.",
      });
    } catch (error) {
      toast({
        title: "Error saving changes",
        description: "There was an error saving your changes. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Publish project
  const handlePublish = async () => {
    try {
      // TODO: Implement publish to backend
      toast({
        title: "Project published",
        description: "Your project has been published successfully.",
      });
    } catch (error) {
      toast({
        title: "Error publishing project",
        description: "There was an error publishing your project. Please try again.",
        variant: "destructive",
      });
    }
  };

  // Update elements with history tracking
  const handleElementUpdate = (updatedElements: Array<any>) => {
    setElements(updatedElements);
    addToHistory(updatedElements);
  };

  const selectedWidgets = elements.filter((widget) => widget.id === selectedElement);

  return (
    <div className="flex flex-col h-screen bg-background">
      <EditorNavbar
        projectId={projectId}
        isPreviewMode={isPreviewMode}
        onPreviewToggle={() => setIsPreviewMode(!isPreviewMode)}
        onPublish={handlePublish}
        onSave={handleSave}
        canUndo={historyIndex > 0}
        canRedo={historyIndex < history.length - 1}
        onUndo={handleUndo}
        onRedo={handleRedo}
      />

      <div className="flex flex-1 overflow-hidden">
        {!isPreviewMode ? (
          <DndContext
            sensors={sensors}
            onDragEnd={handleDragEnd}
            onDragStart={handleDragStart}
          >
            {/* Existing editor content */}
            {/* ... */}
          </DndContext>
        ) : (
          <div className="flex-1 p-8 overflow-auto">
            <div className="max-w-5xl mx-auto space-y-4">
              {elements.map((widget) => (
                <WidgetPreview
                  key={widget.id}
                  type={widget.type}
                  properties={widget.props}
                  className="w-full"
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
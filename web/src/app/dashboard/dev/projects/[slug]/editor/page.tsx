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
    icon: Type,
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
    icon: Type,
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
    icon: Square,
    defaultProps: { text: "Button", variant: "default", size: "default" }
  },
  input: {
    type: "input",
    label: "Input",
    icon: Square,
    defaultProps: { type: "text", placeholder: "Enter text..." }
  },
  textarea: {
    type: "textarea",
    label: "Textarea",
    icon: Square,
    defaultProps: { placeholder: "Enter text..." }
  },
  checkbox: {
    type: "checkbox",
    label: "Checkbox",
    icon: Square,
    defaultProps: { label: "Checkbox" }
  },
  radio: {
    type: "radio",
    label: "Radio",
    icon: Square,
    defaultProps: { label: "Radio" }
  },
  select: {
    type: "select",
    label: "Select",
    icon: Square,
    defaultProps: { placeholder: "Select..." }
  },
  switch: {
    type: "switch",
    label: "Switch",
    icon: Square,
    defaultProps: { label: "Switch" }
  },

  // Layout Elements
  container: {
    type: "container",
    label: "Container",
    icon: Layout,
    defaultProps: {}
  },
  card: {
    type: "card",
    label: "Card",
    icon: Square,
    defaultProps: {}
  },
  divider: {
    type: "divider",
    label: "Divider",
    icon: Square,
    defaultProps: {}
  },
  spacer: {
    type: "spacer",
    label: "Spacer",
    icon: Square,
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
    icon: Square,
    defaultProps: { text: "Badge" }
  },
  tag: {
    type: "tag",
    label: "Tag",
    icon: Square,
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
    icon: Square,
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
  text: {
    text: { type: "string", default: "Text content" },
    fontSize: { type: "number", default: 16, min: 8, max: 72, unit: "px" },
    fontWeight: { 
      type: "select", 
      options: ["normal", "medium", "semibold", "bold"],
      default: "normal"
    },
    color: { type: "color", default: "#000000" },
    alignment: {
      type: "select",
      options: ["left", "center", "right"],
      default: "left"
    }
  },
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
    }
  },
  input: {
    placeholder: { type: "string", default: "Enter text..." },
    type: {
      type: "select",
      options: ["text", "email", "password", "number", "tel"],
      default: "text"
    },
    required: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false }
  },
  container: {
    padding: { type: "number", default: 16, min: 0, max: 64, unit: "px" },
    background: { type: "color", default: "transparent" },
    borderStyle: {
      type: "select",
      options: ["none", "solid", "dashed", "dotted"],
      default: "solid"
    },
    borderWidth: { type: "number", default: 1, min: 0, max: 8, unit: "px" },
    borderColor: { type: "color", default: "#e2e8f0" },
    borderRadius: { type: "number", default: 8, min: 0, max: 32, unit: "px" }
  }
};

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

export default function EditorPage() {
  const [elements, setElements] = useState<Array<any>>([]);
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [deviceSize, setDeviceSize] = useState(deviceSizes[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSidebarItem, setActiveSidebarItem] = useState("layers");
  const [showGrid, setShowGrid] = useState(false);
  const [showFrame, setShowFrame] = useState(true);

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const handleDragStart = (event: any) => {
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveId(null);

    if (over && over.id === "canvas") {
      const type = active.id;
      const widget = widgetDefinitions[type as keyof typeof widgetDefinitions];
      if (widget) {
        const newElement = {
          id: nanoid(),
          type: widget.type,
          props: { ...widget.defaultProps },
        };
        setElements((prev) => [...prev, newElement]);
      }
    }
  };

  const handleElementUpdate = (updatedElements: Array<any>) => {
    setElements(updatedElements);
  };

  return (
    <div className="flex h-screen bg-background">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        modifiers={[restrictToWindowEdges]}
      >
        {/* Top Navbar */}
        <div className="fixed top-0 left-0 right-0 flex items-center justify-between gap-4 border-b bg-background/95 backdrop-blur px-4 h-14 z-50">
          {/* Left Side */}
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <ImageIcon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Code className="h-4 w-4" />
            </Button>
          </div>

          {/* Center - Device Size Selector */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-muted/30 rounded-lg p-1 gap-1">
              {deviceSizes.map((size) => (
                <Button
                  key={size.id}
                  size="sm"
                  variant={deviceSize.id === size.id ? "default" : "ghost"}
                  className={cn(
                    "h-8 gap-2",
                    deviceSize.id === size.id && "bg-emerald-500 text-white hover:bg-emerald-600"
                  )}
                  onClick={() => setDeviceSize(size)}
                >
                  <size.icon className="h-4 w-4" />
                  <span className="text-xs">{size.label}</span>
                </Button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-1">
              <Button
                size="sm"
                variant={showGrid ? "default" : "ghost"}
                className={cn(
                  "h-8 gap-2",
                  showGrid && "bg-emerald-500 text-white hover:bg-emerald-600"
                )}
                onClick={() => setShowGrid(!showGrid)}
              >
                <Grid3X3 className="h-4 w-4" />
                <span className="text-xs">Grid</span>
              </Button>
              <Button
                size="sm"
                variant={showFrame ? "default" : "ghost"}
                className={cn(
                  "h-8 gap-2",
                  showFrame && "bg-emerald-500 text-white hover:bg-emerald-600"
                )}
                onClick={() => setShowFrame(!showFrame)}
              >
                <Square className="h-4 w-4" />
                <span className="text-xs">Frame</span>
              </Button>
            </div>
          </div>

          {/* Right Side Tools */}
          <div className="flex items-center gap-1">
            <ModeToggle />
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Keyboard className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Moon className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Play className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Main Layout */}
        <div className="flex w-full mt-14">
          {/* Left Sidebar */}
          <div className="w-14 border-r bg-background flex flex-col">
            {/* Widget Library Icon */}
            <div className="p-3">
              <div className="bg-emerald-500 text-white rounded-lg p-2">
                <Layout className="h-5 w-5" />
              </div>
            </div>

            {/* Sidebar Navigation */}
            <div className="flex flex-col items-center gap-1 py-2">
              {sidebarItems.map((item) => (
                <Button
                  key={item.id}
                  variant={activeSidebarItem === item.id ? "secondary" : "ghost"}
                  size="icon"
                  className={cn(
                    "h-10 w-10",
                    activeSidebarItem === item.id && "bg-muted"
                  )}
                  onClick={() => setActiveSidebarItem(item.id)}
                >
                  <item.icon className="h-5 w-5" />
                </Button>
              ))}
            </div>
          </div>

          {/* Widget Library Panel */}
          <div className="w-72 border-r bg-background">
            {/* Search Bar */}
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search widgets..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            {/* Widget Categories */}
            <ScrollArea className="h-[calc(100vh-8rem)]">
              <div className="px-4">
                {Object.entries(widgetCategories).map(([category, { label, widgets }]) => (
                  <div key={category}>
                    <h2 className="text-sm font-medium text-muted-foreground mb-3">
                      {label}
                    </h2>
                    <div className="grid grid-cols-3 gap-2">
                      {widgets.map((widget) => (
                        <DraggableWidget
                          key={widget}
                          type={widget}
                          label={widgetDefinitions[widget as keyof typeof widgetDefinitions].label}
                          icon={widgetDefinitions[widget as keyof typeof widgetDefinitions].icon}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Canvas Area */}
          <div className="flex-1 bg-background overflow-hidden">
            <div className="h-full p-6 overflow-auto bg-muted/30">
              <div className="mx-auto" style={{ width: deviceSize.width }}>
                <div className={cn(
                  "bg-card rounded-lg shadow-md",
                  !showFrame && "shadow-none bg-transparent"
                )}>
                  {/* Device Frame */}
                  {showFrame && (
                    <div className="flex items-center justify-between border-b px-4 py-2 bg-muted/20">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500/80" />
                        <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
                        <div className="h-3 w-3 rounded-full bg-green-500/80" />
                      </div>
                      <div className="flex-1 text-center">
                        <span className="text-xs text-muted-foreground font-medium">
                          {deviceSize.label} - {deviceSize.width}
                        </span>
                      </div>
                      <div className="w-16" />
                    </div>
                  )}

                  {/* Canvas Content */}
                  <DroppableCanvas>
                    <div 
                      className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]" 
                      style={{ 
                        backgroundSize: '20px 20px',
                        opacity: showGrid ? 0.5 : 0
                      }}
                    />
                    <div className="p-4 space-y-4">
                      {elements.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                          <LayoutGrid className="h-12 w-12 mb-4 opacity-50" />
                          <p className="text-sm font-medium">Drag widgets here to start building</p>
                        </div>
                      )}
                      {elements.map((element) => (
                        <div
                          key={element.id}
                          className={cn(
                            "relative transition-all hover:ring-2 hover:ring-border",
                            selectedElement === element.id && "ring-2 ring-emerald-500"
                          )}
                          onClick={() => setSelectedElement(element.id)}
                        >
                          {/* Widget Preview */}
                          {element.type === "text" && (
                            <p 
                              className="p-2"
                              style={{
                                fontSize: `${element.props.fontSize ?? 16}px`,
                                fontWeight: element.props.fontWeight ?? "normal",
                                color: element.props.color ?? "#000000",
                                textAlign: element.props.alignment ?? "left"
                              }}
                            >
                              {element.props.text}
                            </p>
                          )}
                          {element.type === "heading1" && (
                            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
                              {element.props.text}
                            </h1>
                          )}
                          {element.type === "heading2" && (
                            <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">
                              {element.props.text}
                            </h2>
                          )}
                          {element.type === "paragraph" && (
                            <p className="leading-7 [&:not(:first-child)]:mt-6">
                              {element.props.text}
                            </p>
                          )}
                          {element.type === "link" && (
                            <a 
                              href={element.props.href}
                              className="font-medium text-primary underline underline-offset-4"
                            >
                              {element.props.text}
                            </a>
                          )}

                          {element.type === "button" && (
                            <Button
                              variant={element.props.variant}
                              size={element.props.size}
                              className={cn(
                                element.props.width === "full" && "w-full"
                              )}
                            >
                              {element.props.text}
                            </Button>
                          )}
                          {element.type === "input" && (
                            <Input
                              type={element.props.type}
                              placeholder={element.props.placeholder}
                              required={element.props.required}
                              disabled={element.props.disabled}
                            />
                          )}
                          {element.type === "textarea" && (
                            <textarea
                              className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                              placeholder={element.props.placeholder}
                            />
                          )}
                          {element.type === "checkbox" && (
                            <div className="flex items-center space-x-2">
                              <Checkbox id={element.id} />
                              <label
                                htmlFor={element.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {element.props.label}
                              </label>
                            </div>
                          )}
                          {element.type === "radio" && (
                            <div className="flex items-center space-x-2">
                              <RadioGroup>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="default" id={element.id} />
                                  <Label htmlFor={element.id}>{element.props.label}</Label>
                                </div>
                              </RadioGroup>
                            </div>
                          )}
                          {element.type === "select" && (
                            <Select>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder={element.props.placeholder} />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="default">Default</SelectItem>
                              </SelectContent>
                            </Select>
                          )}
                          {element.type === "switch" && (
                            <div className="flex items-center space-x-2">
                              <Switch id={element.id} />
                              <Label htmlFor={element.id}>{element.props.label}</Label>
                            </div>
                          )}

                          {element.type === "container" && (
                            <div
                              className="min-h-[100px]"
                              style={{
                                padding: `${element.props.padding ?? 16}px`,
                                background: element.props.background ?? "transparent",
                                borderStyle: element.props.borderStyle ?? "solid",
                                borderWidth: `${element.props.borderWidth ?? 1}px`,
                                borderColor: element.props.borderColor ?? "#e2e8f0",
                                borderRadius: `${element.props.borderRadius ?? 8}px`
                              }}
                            >
                              Container
                            </div>
                          )}
                          {element.type === "card" && (
                            <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
                              Card
                            </div>
                          )}
                          {element.type === "divider" && (
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                              </div>
                            </div>
                          )}
                          {element.type === "spacer" && (
                            <div style={{ height: `${element.props.height}px` }} />
                          )}

                          {element.type === "image" && (
                            <div className="relative h-40 w-full overflow-hidden rounded-lg bg-muted">
                              <div className="flex h-full items-center justify-center">
                                <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
                              </div>
                            </div>
                          )}
                          {element.type === "video" && (
                            <div className="relative h-40 w-full overflow-hidden rounded-lg bg-muted">
                              <div className="flex h-full items-center justify-center">
                                <FileText className="h-8 w-8 text-muted-foreground/40" />
                              </div>
                            </div>
                          )}
                          {element.type === "icon" && (
                            <div className="h-8 w-8">
                              <Star className="h-full w-full" />
                            </div>
                          )}
                          {element.type === "avatar" && (
                            <div className="relative h-10 w-10 rounded-full bg-muted">
                              <div className="flex h-full items-center justify-center">
                                <User className="h-6 w-6 text-muted-foreground/40" />
                              </div>
                            </div>
                          )}

                          {element.type === "table" && (
                            <div className="relative w-full overflow-auto">
                              <table className="w-full caption-bottom text-sm">
                                <thead className="[&_tr]:border-b">
                                  <tr className="border-b transition-colors hover:bg-muted/50">
                                    <th className="h-12 px-4 text-left align-middle font-medium">
                                      Column
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="[&_tr:last-child]:border-0">
                                  <tr className="border-b transition-colors hover:bg-muted/50">
                                    <td className="p-4 align-middle">Cell</td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          )}
                          {element.type === "list" && (
                            <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
                              <li>List item 1</li>
                              <li>List item 2</li>
                              <li>List item 3</li>
                            </ul>
                          )}
                          {element.type === "badge" && (
                            <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                              {element.props.text}
                            </span>
                          )}
                          {element.type === "tag" && (
                            <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                              {element.props.text}
                            </span>
                          )}

                          {element.type === "alert" && (
                            <div className="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground">
                              <AlertCircle className="h-4 w-4" />
                              <h5 className="mb-1 font-medium leading-none tracking-tight">
                                {element.props.text}
                              </h5>
                            </div>
                          )}
                          {element.type === "progress" && (
                            <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
                              <div
                                className="h-full w-full flex-1 bg-primary transition-all"
                                style={{ transform: `translateX(-${100 - (element.props.value ?? 0)}%)` }}
                              />
                            </div>
                          )}

                          {element.type === "rating" && (
                            <div className="flex space-x-1">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={cn(
                                    "h-4 w-4",
                                    i < (element.props.value ?? 5)
                                      ? "fill-primary text-primary"
                                      : "fill-muted text-muted"
                                  )}
                                />
                              ))}
                            </div>
                          )}
                          {element.type === "like" && (
                            <Button variant="ghost" size="icon">
                              <Heart className="h-4 w-4" />
                            </Button>
                          )}
                          {element.type === "share" && (
                            <Button variant="ghost" size="icon">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          )}
                          {element.type === "comment" && (
                            <Button variant="ghost" size="icon">
                              <MessageCircle className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      ))}
                    </div>
                  </DroppableCanvas>
                </div>
              </div>
            </div>
          </div>

          {/* Properties Panel */}
          <PropertiesPanel
            selectedElement={selectedElement}
            elements={elements}
            onChange={handleElementUpdate}
          />
        </div>

        <DragOverlay>
          {activeId && (
            <div className="bg-background border rounded-lg shadow-lg p-2 opacity-80">
              {(() => {
                const widget = widgetDefinitions[activeId as keyof typeof widgetDefinitions];
                if (!widget) return null;
                return (
                  <div className="flex items-center gap-2 px-2 py-1">
                    <widget.icon className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{widget.label}</span>
                  </div>
                );
              })()}
            </div>
          )}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
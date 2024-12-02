"use client";

import { useCallback, useEffect, useRef, useState } from "react"
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
  DragStartEvent,
  DragEndEvent,
  DragMoveEvent,
  DragOverEvent,
  Active,
  Over
} from "@dnd-kit/core"
import { restrictToWindowEdges } from "@dnd-kit/modifiers"
import { cn } from "@/lib/utils"
import { 
  Layers as LayersIcon,
  Sun,
  Settings,
  Wallet,
  Coins,
  Grid,
  ArrowRightLeft,
  RefreshCw,
  Code,
  Text as TextIcon,
  Type,
  Link as LinkIcon,
  Radio as RadioIcon,
  Container as ContainerIcon,
  Image as ImageIcon,
  FileText,
  Star,
  User,
  Table2,
  List,
  Badge as BadgeIcon,
  Tag as TagIcon,
  AlertCircle,
  Heart,
  Share2,
  MessageCircle,
  Smartphone,
  Tablet,
  Monitor,
  Layout,
  Moon,
  ChevronLeft,
  Grid3X3,
  Square,
  Play,
  Keyboard,
  Search,
  LayoutGrid,
  Redo2,
  Save,
  Undo2,
  X, 
  Folder
} from "lucide-react";

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

// Solana Widgets
import {
  TokenBalance,
  NFTGallery,
  SolanaTransfer,
  TokenSwap,
  TokenMint,
  ProgramInteraction
} from "@/components/solana/widgets"

// Widget Categories
const widgetCategories = {
  solana: {
    label: "Solana",
    widgets: ["walletConnect", "tokenBalance", "nftGallery", "solanaTransfer", "tokenSwap", "tokenMint", "programInteraction"]
  },
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
    widgets: ["container", "row", "column", "card", "divider", "spacer"]
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
  // Solana Elements
  walletConnect: {
    type: "walletConnect",
    label: "Wallet Connect",
    icon: Wallet,
    defaultProps: {
      text: "Connect Wallet",
      variant: "default",
      size: "default",
      width: "auto",
      showBalance: true,
      showAddress: true,
      addressFormat: "short",
      className: ""
    }
  },
  tokenBalance: {
    type: "tokenBalance",
    label: "Token Balance",
    icon: Coins,
    defaultProps: {
      mint: "",
      showSymbol: true,
      showIcon: true,
      className: ""
    }
  },
  nftGallery: {
    type: "nftGallery",
    label: "NFT Gallery",
    icon: Grid,
    defaultProps: {
      walletAddress: "",
      gridColumns: 3,
      showName: true,
      className: ""
    }
  },
  solanaTransfer: {
    type: "solanaTransfer",
    label: "Transfer SOL/SPL",
    icon: ArrowRightLeft,
    defaultProps: {
      recipient: "",
      amount: "0",
      mint: "",
      className: ""
    }
  },
  tokenSwap: {
    type: "tokenSwap",
    label: "Token Swap",
    icon: RefreshCw,
    defaultProps: {
      fromMint: "",
      toMint: "",
      slippage: "1",
      className: ""
    }
  },
  tokenMint: {
    type: "tokenMint",
    label: "Token Mint",
    icon: Coins,
    defaultProps: {
      mintAuthority: "",
      decimals: "9",
      className: ""
    }
  },
  programInteraction: {
    type: "programInteraction",
    label: "Program Interaction",
    icon: Code,
    defaultProps: {
      programId: "",
      instruction: "",
      className: ""
    }
  },
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
  row: {
    type: "row",
    label: "Row",
    icon: LayoutGrid,
    defaultProps: {
      gap: 2,
      alignItems: "start",
      justifyContent: "start",
      padding: 2,
    }
  },
  column: {
    type: "column",
    label: "Column",
    icon: Layout,
    defaultProps: {
      gap: 2,
      alignItems: "start",
      width: "auto",
      padding: 2,
    }
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

  // Data Elements
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

// Widget Property Definitions
const widgetProperties = {
  // Solana Elements
  walletConnect: {
    text: { type: "string", default: "Connect Wallet" },
    variant: {
      type: "select",
      options: ["default", "secondary", "outline", "ghost"],
      default: "default"
    },
    size: {
      type: "select",
      options: ["sm", "default", "lg"],
      default: "default"
    },
    width: {
      type: "select",
      options: ["auto", "full"],
      default: "auto"
    },
    showBalance: { type: "boolean", default: true },
    showAddress: { type: "boolean", default: true },
    addressFormat: {
      type: "select",
      options: ["full", "short", "hidden"],
      default: "short"
    },
    className: { type: "string", default: "" }
  },
  tokenBalance: {
    mint: { type: "string", default: "" },
    showSymbol: { type: "boolean", default: true },
    showIcon: { type: "boolean", default: true },
    className: { type: "string", default: "" }
  },
  nftGallery: {
    walletAddress: { type: "string", default: "" },
    gridColumns: { type: "number", default: 3, min: 1, max: 6 },
    showName: { type: "boolean", default: true },
    className: { type: "string", default: "" }
  },
  solanaTransfer: {
    recipient: { type: "string", default: "" },
    amount: { type: "string", default: "0" },
    mint: { type: "string", default: "" },
    className: { type: "string", default: "" }
  },
  tokenSwap: {
    fromMint: { type: "string", default: "" },
    toMint: { type: "string", default: "" },
    slippage: { type: "string", default: "1" },
    className: { type: "string", default: "" }
  },
  tokenMint: {
    mintAuthority: { type: "string", default: "" },
    decimals: { type: "string", default: "9" },
    className: { type: "string", default: "" }
  },
  programInteraction: {
    programId: { type: "string", default: "" },
    instruction: { type: "string", default: "" },
    className: { type: "string", default: "" }
  },
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
  row: {
    gap: { type: "number", default: 2, min: 0, max: 12 },
    alignItems: {
      type: "select",
      default: "start",
      options: ["start", "center", "end", "stretch"]
    },
    justifyContent: {
      type: "select",
      default: "start",
      options: ["start", "center", "end", "between", "around"]
    },
    padding: { type: "number", default: 2, min: 0, max: 12 },
  },
  column: {
    gap: { type: "number", default: 2, min: 0, max: 12 },
    alignItems: {
      type: "select",
      default: "start",
      options: ["start", "center", "end", "stretch"]
    },
    width: {
      type: "select",
      default: "auto",
      options: ["auto", "1/2", "1/3", "2/3", "1/4", "3/4", "full"]
    },
    padding: { type: "number", default: 2, min: 0, max: 12 },
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

// Canvas settings
interface canvasBackgroundColor {
  backgroundColor: string;
}

const canvasProperties = {
  backgroundColor: {
    type: 'color',
    label: 'Background Color',
    defaultValue: '#ffffff'
  }
};

// ... (rest of the code remains the same)  

// Device sizes
const deviceSizes = [
  { id: "mobile", icon: Smartphone, label: "Mobile", width: 390 },
  { id: "tablet", icon: Tablet, label: "Tablet", width: 768 },
  { id: "desktop", icon: Monitor, label: "Desktop", width: 1280 },
] as const;

// Sidebar items
const sidebarItems = [
  { id: "widgets", icon: Grid, label: "Widgets" },
  { id: "layers", icon: LayersIcon, label: "Layers" },
  { id: "assets", icon: Folder, label: "Assets" },
  { id: "settings", icon: Settings, label: "Settings" },
] as const;

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

// Canvas Component
function Canvas({
  children,
  backgroundColor = '#ffffff',
  onSelect,
  isDragging = false
}: {
  children: React.ReactNode;
  backgroundColor?: string;
  onSelect?: (id: string | null) => void;
  isDragging?: boolean;
}) {
  const { setNodeRef } = useDroppable({ id: "canvas" });

  return (
    <div
      ref={setNodeRef}
      className="relative flex-1 h-full overflow-auto"
      style={{ backgroundColor }}
      onClick={() => onSelect?.(null)}
    >
      {/* Grid Background */}
      <div
        className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)]"
        style={{
          backgroundSize: '20px 20px',
          opacity: isDragging ? 0.5 : 0
        }}
      />

      {/* Content Layer */}
      <div className="relative z-10 p-6 min-h-full" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

import { usePropertyValidation } from "@/hooks/use-property-validation";
import { toast } from "@/hooks/use-toast";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { ButtonIcon, InputIcon, TextareaIcon, CheckboxIcon, SwitchIcon, CardIcon, DividerIcon, SpacerIcon, ProgressIcon, SelectIcon } from "@/components/icons/custom-icons";
import { CodeGenerator } from "@/components/code-generator/code-generator";

function useGuides(elementRefs: Map<string, HTMLElement>) {
  const [guides, setGuides] = useState<Array<{ x: number, y: number }>>([]);

  const updateGuides = useCallback((activeId: string) => {
    const guides: Array<{ x: number, y: number }> = [];
    const activeEl = elementRefs.get(activeId);

    if (!activeEl) return;

    const activeRect = activeEl.getBoundingClientRect();

    elementRefs.forEach((el, id) => {
      if (id === activeId) return;

      const rect = el.getBoundingClientRect();

      // Vertical guides
      if (Math.abs(rect.left - activeRect.left) < 5) {
        guides.push({ x: rect.left, y: 0 });
      }
      if (Math.abs(rect.right - activeRect.right) < 5) {
        guides.push({ x: rect.right, y: 0 });
      }

      // Horizontal guides
      if (Math.abs(rect.top - activeRect.top) < 5) {
        guides.push({ x: 0, y: rect.top });
      }
      if (Math.abs(rect.bottom - activeRect.bottom) < 5) {
        guides.push({ x: 0, y: rect.bottom });
      }
    });

    setGuides(guides);
  }, [elementRefs]);

  return { guides, updateGuides };
}

interface PropertyPanelProps {
  selectedElement: string | null;
  elements: any[];
  onChange: (elements: any[]) => void;
  onDelete: (id: string) => void;
}

function PropertyPanel({ selectedElement, elements, onChange, onDelete }: PropertyPanelProps) {
  const element = elements.find(el => el.id === selectedElement);
  if (!element) return null;

  const handlePropertyChange = (property: string, value: any) => {
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
        {Object.entries(widgetProperties[element.type as keyof typeof widgetProperties]).map(([key, config]) => (
          <PropertyField
            key={key}
            elementId={element.id}
            propertyName={key}
            propertyConfig={config}
            currentValue={element.props[key]}
            onUpdate={(value) => handlePropertyChange(key, value)}
          />
        ))}
      </div>
      <Button variant="destructive" onClick={() => onDelete(element.id)}>Delete</Button>
    </div>
  );
}

function PropertyField({
  elementId,
  propertyName,
  propertyConfig,
  currentValue,
  onUpdate
}: {
  elementId: string;
  propertyName: string;
  propertyConfig: any;
  currentValue: any;
  onUpdate: (value: any) => void;
}) {
  const {
    isValid,
    error,
    value,
    validate
  } = usePropertyValidation({
    type: propertyConfig.type,
    initialValue: currentValue ?? propertyConfig.default,
    constraints: {
      min: propertyConfig.min,
      max: propertyConfig.max,
      step: propertyConfig.step,
      pattern: propertyConfig.pattern,
      options: propertyConfig.options,
    },
    onChange: onUpdate
  });

  const handleChange = (newValue: any) => {
    if (validate(newValue)) {
      onUpdate(newValue);
    } else if (error) {
      toast({
        title: "Invalid Value",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium flex items-center justify-between">
        {propertyName.charAt(0).toUpperCase() + propertyName.slice(1)}
        {propertyConfig.unit && (
          <span className="text-xs text-muted-foreground">{propertyConfig.unit}</span>
        )}
      </label>

      {propertyConfig.type === "string" && (
        <Input
          value={value as string}
          onChange={e => handleChange(e.target.value)}
          className={cn("h-8", !isValid && "border-destructive")}
        />
      )}

      {propertyConfig.type === "number" && (
        <div className="flex gap-2">
          <Input
            type="number"
            value={value as number}
            onChange={e => handleChange(Number(e.target.value))}
            min={propertyConfig.min}
            max={propertyConfig.max}
            className={cn("h-8", !isValid && "border-destructive")}
          />
          <Slider
            value={[value as number]}
            onValueChange={([newValue]) => handleChange(newValue)}
            min={propertyConfig.min}
            max={propertyConfig.max}
            step={propertyConfig.step ?? 1}
            className="flex-1"
          />
        </div>
      )}

      {propertyConfig.type === "select" && (
        <Select
          value={value as string}
          onValueChange={handleChange}
        >
          <SelectTrigger className={cn("h-8", !isValid && "border-destructive")}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {propertyConfig.options.map((option: string) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {propertyConfig.type === "boolean" && (
        <Switch
          checked={value as boolean}
          onCheckedChange={handleChange}
        />
      )}

      {propertyConfig.type === "color" && (
        <div className="flex gap-2">
          <div
            className="w-8 h-8 rounded border"
            style={{ backgroundColor: value as string }}
          />
          <Input
            value={value as string}
            onChange={e => handleChange(e.target.value)}
            className={cn("h-8 flex-1", !isValid && "border-destructive")}
          />
        </div>
      )}

      {error && (
        <p className="text-xs text-destructive mt-1">{error.message}</p>
      )}
    </div>
  );
}

interface HistoryState {
  past: any[][];
  present: any[];
  future: any[][];
}

function renderElement(element: any, onSelect: (id: string) => void) {
  const isContainer = ["row", "column", "container"].includes(element.type);

  const commonProps = {
    id: `element-${element.id}`,
    onClick: (e: React.MouseEvent) => {
      e.stopPropagation();
      onSelect(element.id);
    },
    className: cn(
      "relative group transition-all duration-200",
      isContainer && "border-2 border-transparent hover:border-border",
      element.isSelected && "ring-2 ring-primary ring-offset-2"
    )
  };

  const renderChildren = (children: any[]) => {
    return children?.map((child: any) => renderElement(child, onSelect));
  };

  switch (element.type) {
    case "row":
      return (
        <div
          {...commonProps}
          className={cn(
            commonProps.className,
            "flex flex-row w-full",
            `gap-${element.props.gap}`,
            `items-${element.props.alignItems}`,
            `justify-${element.props.justifyContent}`,
            `p-${element.props.padding}`
          )}
        >
          {renderChildren(element.children)}
          {/* Dropzone indicator */}
          {element.isSelected && (
            <div className="absolute inset-0 border-2 border-dashed border-primary pointer-events-none" />
          )}
        </div>
      );

    case "column":
      return (
        <div
          {...commonProps}
          className={cn(
            commonProps.className,
            "flex flex-col",
            `gap-${element.props.gap}`,
            `items-${element.props.alignItems}`,
            element.props.width === "auto" ? "w-auto" : `w-${element.props.width}`,
            `p-${element.props.padding}`
          )}
        >
          {renderChildren(element.children)}
          {/* Dropzone indicator */}
          {element.isSelected && (
            <div className="absolute inset-0 border-2 border-dashed border-primary pointer-events-none" />
          )}
        </div>
      );
    case "walletConnect":
      return (
        <WalletMultiButton
          className={cn(
            element.props.width === "full" && "w-full",
            "flex items-center gap-2",
            element.props.className
          )}
        />
      );
    case "tokenBalance":
      return (
        <TokenBalance
          mint={element.props.mint}
          showSymbol={element.props.showSymbol}
          showIcon={element.props.showIcon}
          className={element.props.className}
        />
      );
    case "nftGallery":
      return (
        <NFTGallery
          walletAddress={element.props.walletAddress}
          gridColumns={element.props.gridColumns}
          showName={element.props.showName}
          className={element.props.className}
        />
      );
    case "solanaTransfer":
      return (
        <SolanaTransfer
          recipient={element.props.recipient}
          amount={element.props.amount}
          mint={element.props.mint}
          className={element.props.className}
        />
      );
    case "tokenSwap":
      return (
        <TokenSwap
          fromMint={element.props.fromMint}
          toMint={element.props.toMint}
          slippage={element.props.slippage}
          className={element.props.className}
        />
      );
    case "tokenMint":
      return (
        <TokenMint
          // mintAuthority={element.props.mintAuthority}
          // decimals={element.props.decimals}
          className={element.props.className}
        />
      );
    case "programInteraction":
      return (
        <ProgramInteraction
          programId={element.props.programId}
          instruction={element.props.instruction}
          className={element.props.className}
        />
      );
    case "text":
      return (
        <div {...commonProps}>
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
        </div>
      );
    case "heading1":
      return (
        <div {...commonProps}>
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
            {element.props.text}
          </h1>
        </div>
      );
    case "heading2":
      return (
        <div {...commonProps}>
          <h2 className="scroll-m-20 pb-2 text-3xl font-semibold tracking-tight">
            {element.props.text}
          </h2>
        </div>
      );
    case "paragraph":
      return (
        <div {...commonProps}>
          <p className="leading-7 [&:not(:first-child)]:mt-6">
            {element.props.text}
          </p>
        </div>
      );
    case "link":
      return (
        <div {...commonProps}>
          <a
            href={element.props.href}
            className="font-medium text-primary underline underline-offset-4"
          >
            {element.props.text}
          </a>
        </div>
      );

    case "button":
      return (
        <Button
          variant={element.props.variant}
          size={element.props.size}
          className={cn(
            element.props.width === "full" && "w-full"
          )}
        >
          {element.props.text}
        </Button>
      );
    case "input":
      return (
        <Input
          type={element.props.type}
          placeholder={element.props.placeholder}
          required={element.props.required}
          disabled={element.props.disabled}
        />
      );
    case "textarea":
      return (
        <textarea
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          placeholder={element.props.placeholder}
        />
      );
    case "checkbox":
      return (
        <div className="flex items-center space-x-2">
          <Checkbox id={element.id} />
          <label
            htmlFor={element.id}
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            {element.props.label}
          </label>
        </div>
      );
    case "radio":
      return (
        <div className="flex items-center space-x-2">
          <RadioGroup>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="default" id={element.id} />
              <Label htmlFor={element.id}>{element.props.label}</Label>
            </div>
          </RadioGroup>
        </div>
      );
    case "select":
      return (
        <Select>
          <SelectTrigger className="w-full">
            <SelectValue placeholder={element.props.placeholder} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
          </SelectContent>
        </Select>
      );
    case "switch":
      return (
        <div className="flex items-center space-x-2">
          <Switch id={element.id} />
          <Label htmlFor={element.id}>{element.props.label}</Label>
        </div>
      );

    case "container":
      return (
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
      );
    case "card":
      return (
        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          Card
        </div>
      );
    case "divider":
      return (
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
        </div>
      );
    case "spacer":
      return (
        <div style={{ height: `${element.props.height}px` }} />
      );

    case "image":
      return (
        <div className="relative h-40 w-full overflow-hidden rounded-lg bg-muted">
          <div className="flex h-full items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
          </div>
        </div>
      );
    case "video":
      return (
        <div className="relative h-40 w-full overflow-hidden rounded-lg bg-muted">
          <div className="flex h-full items-center justify-center">
            <FileText className="h-8 w-8 text-muted-foreground/40" />
          </div>
        </div>
      );
    case "icon":
      return (
        <div className="h-8 w-8">
          <Star className="h-full w-full" />
        </div>
      );
    case "avatar":
      return (
        <div className="relative h-10 w-10 rounded-full bg-muted">
          <div className="flex h-full items-center justify-center">
            <User className="h-6 w-6 text-muted-foreground/40" />
          </div>
        </div>
      );

    case "table":
      return (
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
      );
    case "list":
      return (
        <ul className="my-6 ml-6 list-disc [&>li]:mt-2">
          <li>List item 1</li>
          <li>List item 2</li>
          <li>List item 3</li>
        </ul>
      );
    case "badge":
      return (
        <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          {element.props.text}
        </span>
      );
    case "tag":
      return (
        <span className="inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
          {element.props.text}
        </span>
      );

    case "alert":
      return (
        <div className="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground">
          <AlertCircle className="h-4 w-4" />
          <h5 className="mb-1 font-medium leading-none tracking-tight">
            {element.props.text}
          </h5>
        </div>
      );
    case "progress":
      return (
        <div className="relative h-4 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full w-full flex-1 bg-primary transition-all"
            style={{ transform: `translateX(-${100 - (element.props.value ?? 0)}%)` }}
          />
        </div>
      );

    case "rating":
      return (
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
      );
    case "like":
      return (
        <Button variant="ghost" size="icon">
          <Heart className="h-4 w-4" />
        </Button>
      );
    case "share":
      return (
        <Button variant="ghost" size="icon">
          <Share2 className="h-4 w-4" />
        </Button>
      );
    case "comment":
      return (
        <Button variant="ghost" size="icon">
          <MessageCircle className="h-4 w-4" />
        </Button>
      );
    default:
      return null;
  }
}

// Sidebar Content Component
function SidebarContent({
  activeSidebarItem,
  history,
  selectedElement,
  setSelectedElement,
  showGrid,
  setShowGrid,
  showFrame,
  setShowFrame,
  searchQuery,
  setSearchQuery
}: {
  activeSidebarItem: string;
  history: HistoryState;
  selectedElement: string | null;
  setSelectedElement: (id: string | null) => void;
  showGrid: boolean;
  setShowGrid: (show: boolean) => void;
  showFrame: boolean;
  setShowFrame: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}) {
  return (
    <>
      {activeSidebarItem === "widgets" && (
        <div className="h-full overflow-auto">
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
                <div key={category} className="mt-4">
                  <h2 className="text-sm font-medium text-muted-foreground mb-3">
                    {label}
                  </h2>
                  <div className="grid grid-cols-3 gap-2">
                    {widgets.map((widget) => (
                      <DraggableWidget
                        key={widget}
                        type={widget}
                        label={widgetDefinitions[widget as keyof typeof widgetDefinitions].label}
                        icon={widgetDefinitions[widget as keyof typeof widgetDefinitions].icon || TextIcon}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {activeSidebarItem === "layers" && (
        <div className="h-full overflow-auto">
          <div className="p-4">
            <div className="space-y-2">
              {history.present.map((element) => (
                <button
                  key={element.id}
                  onClick={() => setSelectedElement(element.id)}
                  className={cn(
                    "w-full flex items-center gap-2 p-2 text-sm hover:bg-muted/50 rounded-md",
                    selectedElement === element.id && "bg-muted"
                  )}
                >
                  <LayersIcon className="h-4 w-4" />
                  <span>{element.type}</span>
                  <span className="text-xs text-muted-foreground">#{element.id}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeSidebarItem === "assets" && (
        <div className="h-full overflow-auto">
          <div className="p-4">
            <div className="text-center p-8 border-2 border-dashed rounded-lg">
              <Folder className="mx-auto h-8 w-8 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-medium">No assets yet</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Upload images and other assets to use in your project
              </p>
              <button className="mt-4 text-sm text-primary hover:underline">
                Upload assets
              </button>
            </div>
          </div>
        </div>
      )}

      {activeSidebarItem === "settings" && (
        <div className="h-full overflow-auto">
          <div className="p-4 space-y-4">
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Theme</h3>
              <div className="flex items-center space-x-2">
                <button className="w-6 h-6 rounded-full bg-background border" />
                <button className="w-6 h-6 rounded-full bg-zinc-950" />
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Grid</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showGrid}
                  onCheckedChange={setShowGrid}
                />
                <Label>Show grid</Label>
              </div>
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Frame</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  checked={showFrame}
                  onCheckedChange={setShowFrame}
                />
                <Label>Show frame</Label>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default function EditorPage({ params }: { params: { slug: string } }) {
  const [isLoading, setIsLoading] = useState(true);

  const [history, setHistory] = useState<HistoryState>({
    past: [],
    present: [],
    future: []
  });
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [deviceSize, setDeviceSize] = useState(deviceSizes[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSidebarItem, setActiveSidebarItem] = useState("layers");
  const [showGrid, setShowGrid] = useState(false);
  const [showFrame, setShowFrame] = useState(true);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showCodeGen, setShowCodeGen] = useState(false);
  const [canvasBackgroundColor, setCanvasBackgroundColor] = useState('#ffffff');

  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor)
  );

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = useCallback((event: DragStartEvent) => {
    setIsDragging(true);
    const { active } = event;

    if (typeof active.id === 'string' && active.id.startsWith('element-')) {
      setSelectedElement(active.id.replace('element-', ''));
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    setIsDragging(false);
    const { active, over } = event;

    if (over?.id === "canvas") {
      if (active.data?.current?.type) {
        const newElement = {
          id: nanoid(),
          type: active.data.current.type,
          props: widgetDefinitions[active.data.current.type as keyof typeof widgetDefinitions].defaultProps,
          children: []
        };

        setHistory(prev => ({
          past: [...prev.past, prev.present],
          present: [...prev.present, newElement],
          future: []
        }));
      }
    } else if (over?.id && typeof over.id === 'string' && over.id.startsWith('element-')) {
      const containerId = over.id.replace('element-', '');
      const containerElement = history.present.find(el => el.id === containerId);

      if (containerElement && ["row", "column", "container"].includes(containerElement.type)) {
        if (active.data?.current?.type) {
          // Adding new widget to container
          const newElement = {
            id: nanoid(),
            type: active.data.current.type,
            props: widgetDefinitions[active.data.current.type as keyof typeof widgetDefinitions].defaultProps,
            children: []
          };

          setHistory(prev => ({
            past: [...prev.past, prev.present],
            present: prev.present.map(el => {
              if (el.id === containerId) {
                return {
                  ...el,
                  children: [...(el.children || []), newElement]
                };
              }
              return el;
            }),
            future: []
          }));
        }
      }
    }

    setSelectedElement(null);
  }, [history]);

  const handleElementUpdate = useCallback((id: string, updates: any) => {
    setHistory(currentHistory => {
      const { past, present } = currentHistory;
      const newPresent = present.map((el: any) =>
        el.id === id ? { ...el, ...updates } : el
      );
      return {
        past: [...past, present],
        present: newPresent,
        future: []
      };
    });
  }, []);

  const deleteElement = useCallback((id: string) => {
    setHistory(currentHistory => {
      const { past, present } = currentHistory;
      const newPresent = present.filter((el: any) => el.id !== id);
      return {
        past: [...past, present],
        present: newPresent,
        future: []
      };
    });
    setSelectedElement(null);
  }, []);

  const undo = useCallback(() => {
    setHistory(currentHistory => {
      const { past, present, future } = currentHistory;
      if (past.length === 0) return currentHistory;

      const previous = past[past.length - 1];
      const newPast = past.slice(0, past.length - 1);

      return {
        past: newPast,
        present: previous,
        future: [present, ...future]
      };
    });
  }, []);

  const redo = useCallback(() => {
    setHistory(currentHistory => {
      const { past, present, future } = currentHistory;
      if (future.length === 0) return currentHistory;

      const next = future[0];
      const newFuture = future.slice(1);

      return {
        past: [...past, present],
        present: next,
        future: newFuture
      };
    });
  }, []);

  const saveProject = useCallback(async () => {
    try {
      setIsSaving(true);
      const response = await fetch(`/api/projects/${params.slug}/editor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          elements: history.present,
          canvasBackgroundColor
        }),
      });

      if (!response.ok) throw new Error('Failed to save project');
      toast({
        description: "Project saved successfully.",
      });
    } catch (error) {
      console.error('Save error:', error);
      toast({
        description: "Failed to save project.",
      });
    } finally {
      setIsSaving(false);
    }
  }, [history.present, canvasBackgroundColor, params.slug]);

  useEffect(() => {
    const autoSaveTimeout = setTimeout(() => {
      if (history.present.length > 0) {
        saveProject();
      }
    }, 5000); // Auto-save after 5 seconds of inactivity

    return () => clearTimeout(autoSaveTimeout);
  }, [history.present, saveProject]);

  useEffect(() => {
    const loadEditorState = async () => {
      try {
        const response = await fetch(`/api/projects/${params.slug}/editor`);
        if (!response.ok) throw new Error('Failed to load editor state');

        const data = await response.json();
        if (data.editorState?.elements) {
          setHistory({
            past: [],
            present: data.editorState.elements,
            future: []
          });
        }
        if (data.editorState?.canvasBackgroundColor) {
          setCanvasBackgroundColor(data.editorState.canvasBackgroundColor);
        }
      } catch (error) {
        console.error('Error loading editor state:', error);
        toast({
          description: 'Failed to load editor state',
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadEditorState();
  }, [params.slug]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 's') {
        e.preventDefault();
        saveProject();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === 'Delete' && selectedElement) {
        e.preventDefault();
        deleteElement(selectedElement);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, saveProject, deleteElement, selectedElement]);

  const handlePropertyChange = (updatedElements: any[]) => {
    setHistory(prev => ({
      past: [...prev.past, prev.present],
      present: updatedElements,
      future: []
    }));
  };

  // const handleCanvasPropertyChange = (property: string, value: any) => {
  //   setCanvasBackgroundColor(prev => ({ ...prev, [property]: value }));
  // };

  return (
    <div className="flex h-screen bg-background">
      {isLoading ? (
        <div className="flex items-center justify-center w-full">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
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
                    {/* <span className="text-xs">{size.label}</span> */}
                  </Button>
                ))}
              </div>

              {/* View Controls */}
              <div className="flex items-center gap-2 bg-muted/30 rounded-lg p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={undo}
                  disabled={history.past.length === 0}
                  title="Undo (Ctrl+Z)"
                >
                  <Undo2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={redo}
                  disabled={history.future.length === 0}
                  title="Redo (Ctrl+Shift+Z)"
                >
                  <Redo2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={saveProject}
                  disabled={isSaving}
                  title="Save (Ctrl+S)"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsPreview(!isPreview)}
                >
                  {isPreview ? "Edit" : "Preview"}
                </Button>
              </div>
            </div>

            {/* Right Side Tools */}
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowCodeGen(!showCodeGen)}
                className="h-8 gap-2"
              >
                <Code className="h-4 w-4" />
                <span className="text-xs">Generate Code</span>
              </Button>
              <Button
                variant={isPreview ? "default" : "ghost"}
                size="sm"
                className={cn(
                  "h-8 gap-2",
                  isPreview && "bg-emerald-500 text-white hover:bg-emerald-600"
                )}
                onClick={() => setIsPreview(!isPreview)}
              >
                {isPreview ? (
                  <>
                    <Code className="h-4 w-4" />
                    <span className="text-xs">Edit</span>
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    <span className="text-xs">Preview</span>
                  </>
                )}
              </Button>
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
            <div className="flex border-r bg-background">
              {/* Icon Sidebar */}
              <div className="w-14 border-r bg-background flex flex-col">
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
                      <item.icon className="h-4 w-4" />
                    </Button>
                  ))}
                </div>
              </div>

              {/* Content Panel */}
              <div className="w-72 overflow-hidden">
                <SidebarContent 
                  activeSidebarItem={activeSidebarItem}
                  history={history}
                  selectedElement={selectedElement}
                  setSelectedElement={setSelectedElement}
                  showGrid={showGrid}
                  setShowGrid={setShowGrid}
                  showFrame={showFrame}
                  setShowFrame={setShowFrame}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                />
              </div>
            </div>

            {/* Canvas Area */}
            <div className="flex-1 bg-background overflow-hidden">
              <div className="h-full p-6 overflow-auto bg-muted/30">
                <div
                  className="mx-auto transition-all duration-300"
                  style={{ width: deviceSize.width }}
                >
                  <div className={cn(
                    "bg-card rounded-lg shadow-md",
                    !showFrame && "shadow-none bg-transparent"
                  )}>
                    {/* Device Frame */}
                    {showFrame && !isPreview && (
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
                    {isPreview ? (
                      <div className="p-4" style={{ backgroundColor: canvasBackgroundColor }}>
                        {history.present.map((element) => (
                          renderElement(element, setSelectedElement)
                        ))}
                      </div>
                    ) : (
                      <Canvas
                        backgroundColor={canvasBackgroundColor}
                        onSelect={setSelectedElement}
                        isDragging={isDragging}
                      >
                        {history.present.map((element) =>
                          renderElement(element, setSelectedElement)
                        )}
                      </Canvas>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Properties Panel */}
            {selectedElement ? (
              <PropertyPanel
                selectedElement={selectedElement}
                elements={history.present}
                onChange={handlePropertyChange}
                onDelete={deleteElement}
              />
            ) : (
              <div className="w-80 border-l bg-background">
                <div className="p-4 border-b bg-muted/20">
                  <h2 className="font-semibold">Canvas Settings</h2>
                </div>
                <div className="p-4 space-y-4">
                  <div className="space-y-2">
                    <Label>Background Color</Label>
                    <Input
                      type="color"
                      value={canvasBackgroundColor}
                      onChange={(e) => setCanvasBackgroundColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Code Generator Panel */}
            {showCodeGen && (
              <div className="min-w-fit px-4 border-l bg-background">
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Generate Code</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowCodeGen(false)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <CodeGenerator elements={history.present} />
                </div>
              </div>
            )}
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
      )}
    </div>
  );
}
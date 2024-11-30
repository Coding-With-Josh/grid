import { LucideIcon, Type, Button as ButtonIcon, Image, FormInput, List, Layout, Heading1, Heading2, Link as LinkIcon, TextArea, CheckSquare, Radio, ListFilter, Toggle, Square, FileImage, FileVideo, Star, User, Table } from "lucide-react";

export interface WidgetDefinition {
  type: string;
  label: string;
  icon: LucideIcon;
  defaultProps: Record<string, any>;
}

export const widgetDefinitions: Record<string, WidgetDefinition> = {
  text: {
    type: "text",
    label: "Text",
    icon: Type,
    defaultProps: {
      text: "Text block",
      fontSize: 16,
      fontWeight: "normal",
      color: "#000000",
      textAlign: "left",
    },
  },
  heading1: {
    type: "heading1",
    label: "Heading 1",
    icon: Heading1,
    defaultProps: {
      text: "Heading 1",
      color: "#000000",
      textAlign: "left",
    },
  },
  heading2: {
    type: "heading2",
    label: "Heading 2",
    icon: Heading2,
    defaultProps: {
      text: "Heading 2",
      color: "#000000",
      textAlign: "left",
    },
  },
  paragraph: {
    type: "paragraph",
    label: "Paragraph",
    icon: Type,
    defaultProps: {
      text: "Paragraph text",
      fontSize: 16,
      lineHeight: 1.6,
      color: "#000000",
      textAlign: "left",
    },
  },
  link: {
    type: "link",
    label: "Link",
    icon: LinkIcon,
    defaultProps: {
      text: "Link text",
      href: "#",
      target: "_blank",
      color: "#0000FF",
    },
  },
  button: {
    type: "button",
    label: "Button",
    icon: ButtonIcon,
    defaultProps: {
      text: "Button",
      variant: "default",
      size: "default",
      width: "auto",
      disabled: false,
    },
  },
  input: {
    type: "input",
    label: "Input",
    icon: FormInput,
    defaultProps: {
      type: "text",
      placeholder: "Enter text...",
      required: false,
      disabled: false,
      width: "full",
    },
  },
  textarea: {
    type: "textarea",
    label: "Textarea",
    icon: TextArea,
    defaultProps: {
      placeholder: "Enter text...",
      rows: 4,
      required: false,
      disabled: false,
      resize: "vertical",
    },
  },
  checkbox: {
    type: "checkbox",
    label: "Checkbox",
    icon: CheckSquare,
    defaultProps: {
      label: "Checkbox label",
      checked: false,
      disabled: false,
    },
  },
  radio: {
    type: "radio",
    label: "Radio",
    icon: Radio,
    defaultProps: {
      label: "Radio label",
      checked: false,
      disabled: false,
    },
  },
  select: {
    type: "select",
    label: "Select",
    icon: ListFilter,
    defaultProps: {
      placeholder: "Select an option",
      options: ["Option 1", "Option 2", "Option 3"],
      disabled: false,
      width: "full",
    },
  },
  switch: {
    type: "switch",
    label: "Switch",
    icon: Toggle,
    defaultProps: {
      label: "Switch label",
      checked: false,
      disabled: false,
    },
  },
  container: {
    type: "container",
    label: "Container",
    icon: Layout,
    defaultProps: {
      padding: 16,
      background: "transparent",
      borderStyle: "solid",
      borderWidth: 1,
      borderColor: "#e2e8f0",
      borderRadius: 8,
    },
  },
  card: {
    type: "card",
    label: "Card",
    icon: Square,
    defaultProps: {
      padding: 16,
      shadow: "sm",
      borderRadius: 8,
      background: "white",
    },
  },
  divider: {
    type: "divider",
    label: "Divider",
    icon: Square,
    defaultProps: {
      type: "horizontal",
      color: "#e2e8f0",
      thickness: 1,
      margin: 16,
    },
  },
  spacer: {
    type: "spacer",
    label: "Spacer",
    icon: Square,
    defaultProps: {
      height: 16,
    },
  },
  image: {
    type: "image",
    label: "Image",
    icon: FileImage,
    defaultProps: {
      src: "",
      alt: "Image",
      width: "100%",
      height: "auto",
      objectFit: "cover",
      borderRadius: 8,
    },
  },
  video: {
    type: "video",
    label: "Video",
    icon: FileVideo,
    defaultProps: {
      src: "",
      controls: true,
      autoplay: false,
      loop: false,
      muted: false,
      width: "100%",
      height: "auto",
    },
  },
  icon: {
    type: "icon",
    label: "Icon",
    icon: Star,
    defaultProps: {
      name: "star",
      size: 24,
      color: "#000000",
    },
  },
  avatar: {
    type: "avatar",
    label: "Avatar",
    icon: User,
    defaultProps: {
      src: "",
      alt: "Avatar",
      size: 40,
      shape: "circle",
    },
  },
  table: {
    type: "table",
    label: "Table",
    icon: Table,
    defaultProps: {
      columns: ["Column 1", "Column 2", "Column 3"],
      rows: [
        ["Cell 1", "Cell 2", "Cell 3"],
        ["Cell 4", "Cell 5", "Cell 6"],
      ],
      bordered: true,
      hoverable: true,
    },
  },
};

// Widget property definitions for the properties panel
export const widgetProperties: Record<string, Record<string, any>> = {
  text: {
    text: { type: "string", default: "Text block" },
    fontSize: { type: "number", default: 16, min: 8, max: 72, unit: "px" },
    fontWeight: { type: "select", default: "normal", options: ["normal", "medium", "semibold", "bold"] },
    color: { type: "color", default: "#000000" },
    textAlign: { type: "select", default: "left", options: ["left", "center", "right", "justify"] },
  },
  heading1: {
    text: { type: "string", default: "Heading 1" },
    color: { type: "color", default: "#000000" },
    textAlign: { type: "select", default: "left", options: ["left", "center", "right"] },
  },
  heading2: {
    text: { type: "string", default: "Heading 2" },
    color: { type: "color", default: "#000000" },
    textAlign: { type: "select", default: "left", options: ["left", "center", "right"] },
  },
  paragraph: {
    text: { type: "string", default: "Paragraph text" },
    fontSize: { type: "number", default: 16, min: 8, max: 72, unit: "px" },
    lineHeight: { type: "number", default: 1.6, min: 1, max: 3, step: 0.1 },
    color: { type: "color", default: "#000000" },
    textAlign: { type: "select", default: "left", options: ["left", "center", "right", "justify"] },
  },
  link: {
    text: { type: "string", default: "Link text" },
    href: { type: "string", default: "#" },
    target: { type: "select", default: "_blank", options: ["_blank", "_self"] },
    color: { type: "color", default: "#0000FF" },
  },
  button: {
    text: { type: "string", default: "Button" },
    variant: { type: "select", default: "default", options: ["default", "secondary", "outline", "ghost", "link"] },
    size: { type: "select", default: "default", options: ["sm", "default", "lg"] },
    width: { type: "select", default: "auto", options: ["auto", "full"] },
    disabled: { type: "boolean", default: false },
  },
  input: {
    type: { type: "select", default: "text", options: ["text", "email", "password", "number"] },
    placeholder: { type: "string", default: "Enter text..." },
    required: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
    width: { type: "select", default: "full", options: ["auto", "full"] },
  },
  textarea: {
    placeholder: { type: "string", default: "Enter text..." },
    rows: { type: "number", default: 4, min: 2, max: 20 },
    required: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
    resize: { type: "select", default: "vertical", options: ["none", "vertical", "horizontal", "both"] },
  },
  checkbox: {
    label: { type: "string", default: "Checkbox label" },
    checked: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
  },
  radio: {
    label: { type: "string", default: "Radio label" },
    checked: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
  },
  select: {
    placeholder: { type: "string", default: "Select an option" },
    options: { type: "array", default: ["Option 1", "Option 2", "Option 3"] },
    disabled: { type: "boolean", default: false },
    width: { type: "select", default: "full", options: ["auto", "full"] },
  },
  switch: {
    label: { type: "string", default: "Switch label" },
    checked: { type: "boolean", default: false },
    disabled: { type: "boolean", default: false },
  },
  container: {
    padding: { type: "number", default: 16, min: 0, max: 100, unit: "px" },
    background: { type: "color", default: "transparent" },
    borderStyle: { type: "select", default: "solid", options: ["none", "solid", "dashed", "dotted"] },
    borderWidth: { type: "number", default: 1, min: 0, max: 20, unit: "px" },
    borderColor: { type: "color", default: "#e2e8f0" },
    borderRadius: { type: "number", default: 8, min: 0, max: 50, unit: "px" },
  },
  card: {
    padding: { type: "number", default: 16, min: 0, max: 100, unit: "px" },
    shadow: { type: "select", default: "sm", options: ["none", "sm", "md", "lg", "xl"] },
    borderRadius: { type: "number", default: 8, min: 0, max: 50, unit: "px" },
    background: { type: "color", default: "white" },
  },
  divider: {
    type: { type: "select", default: "horizontal", options: ["horizontal", "vertical"] },
    color: { type: "color", default: "#e2e8f0" },
    thickness: { type: "number", default: 1, min: 1, max: 20, unit: "px" },
    margin: { type: "number", default: 16, min: 0, max: 100, unit: "px" },
  },
  spacer: {
    height: { type: "number", default: 16, min: 0, max: 200, unit: "px" },
  },
  image: {
    src: { type: "string", default: "" },
    alt: { type: "string", default: "Image" },
    width: { type: "string", default: "100%" },
    height: { type: "string", default: "auto" },
    objectFit: { type: "select", default: "cover", options: ["contain", "cover", "fill", "none"] },
    borderRadius: { type: "number", default: 8, min: 0, max: 50, unit: "px" },
  },
  video: {
    src: { type: "string", default: "" },
    controls: { type: "boolean", default: true },
    autoplay: { type: "boolean", default: false },
    loop: { type: "boolean", default: false },
    muted: { type: "boolean", default: false },
    width: { type: "string", default: "100%" },
    height: { type: "string", default: "auto" },
  },
  icon: {
    name: { type: "string", default: "star" },
    size: { type: "number", default: 24, min: 12, max: 96, unit: "px" },
    color: { type: "color", default: "#000000" },
  },
  avatar: {
    src: { type: "string", default: "" },
    alt: { type: "string", default: "Avatar" },
    size: { type: "number", default: 40, min: 20, max: 200, unit: "px" },
    shape: { type: "select", default: "circle", options: ["circle", "square"] },
  },
  table: {
    columns: { type: "array", default: ["Column 1", "Column 2", "Column 3"] },
    rows: { type: "array", default: [["Cell 1", "Cell 2", "Cell 3"], ["Cell 4", "Cell 5", "Cell 6"]] },
    bordered: { type: "boolean", default: true },
    hoverable: { type: "boolean", default: true },
  },
};

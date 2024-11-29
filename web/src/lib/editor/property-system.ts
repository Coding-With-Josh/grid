import { nanoid } from 'nanoid';

// Property Types
export type PropertyValue = string | number | boolean | object;

export interface PropertyChange {
  id: string;
  timestamp: number;
  elementId: string;
  propertyName: string;
  oldValue: PropertyValue;
  newValue: PropertyValue;
}

export interface PropertyPreset {
  id: string;
  name: string;
  category: string;
  properties: Record<string, PropertyValue>;
}

export interface CustomPropertyType {
  name: string;
  type: 'string' | 'number' | 'boolean' | 'object' | 'color' | 'dimension' | 'expression';
  validator?: (value: PropertyValue) => boolean;
  transformer?: (value: PropertyValue) => PropertyValue;
}

// Property History Manager
export class PropertyHistoryManager {
  private undoStack: PropertyChange[] = [];
  private redoStack: PropertyChange[] = [];
  private maxHistorySize: number = 100;

  addChange(change: Omit<PropertyChange, 'id' | 'timestamp'>): void {
    const fullChange: PropertyChange = {
      ...change,
      id: nanoid(),
      timestamp: Date.now(),
    };

    this.undoStack.push(fullChange);
    this.redoStack = []; // Clear redo stack on new change

    // Maintain history size limit
    if (this.undoStack.length > this.maxHistorySize) {
      this.undoStack.shift();
    }
  }

  undo(): PropertyChange | null {
    const change = this.undoStack.pop();
    if (change) {
      this.redoStack.push(change);
      return change;
    }
    return null;
  }

  redo(): PropertyChange | null {
    const change = this.redoStack.pop();
    if (change) {
      this.undoStack.push(change);
      return change;
    }
    return null;
  }

  canUndo(): boolean {
    return this.undoStack.length > 0;
  }

  canRedo(): boolean {
    return this.redoStack.length > 0;
  }

  getHistory(): PropertyChange[] {
    return [...this.undoStack];
  }
}

// Property Manager
export class PropertyManager {
  private historyManager: PropertyHistoryManager;
  private customTypes: Map<string, CustomPropertyType>;
  private presets: Map<string, PropertyPreset>;
  private properties: Map<string, Record<string, PropertyValue>>;

  constructor() {
    this.historyManager = new PropertyHistoryManager();
    this.customTypes = new Map();
    this.presets = new Map();
    this.properties = new Map();

    // Register default custom types
    this.registerDefaultTypes();
  }

  private registerDefaultTypes(): void {
    this.registerCustomType({
      name: 'color',
      type: 'string',
      validator: (value) => /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value as string),
    });

    this.registerCustomType({
      name: 'dimension',
      type: 'string',
      validator: (value) => /^[0-9]+(%|px|em|rem|vh|vw)$/.test(value as string),
    });

    this.registerCustomType({
      name: 'expression',
      type: 'string',
      validator: (value) => {
        try {
          // Basic expression validation
          new Function(`return ${value}`);
          return true;
        } catch {
          return false;
        }
      },
    });
  }

  registerCustomType(type: CustomPropertyType): void {
    this.customTypes.set(type.name, type);
  }

  addPreset(preset: PropertyPreset): void {
    this.presets.set(preset.id, preset);
  }

  applyPreset(elementId: string, presetId: string): void {
    const preset = this.presets.get(presetId);
    if (!preset) return;

    Object.entries(preset.properties).forEach(([propertyName, value]) => {
      this.setProperty(elementId, propertyName, value);
    });
  }

  setProperty(elementId: string, propertyName: string, value: PropertyValue): void {
    if (!this.properties.has(elementId)) {
      this.properties.set(elementId, {});
    }

    const elementProperties = this.properties.get(elementId)!;
    const oldValue = elementProperties[propertyName];

    // Validate value if custom type exists
    const customType = this.customTypes.get(propertyName);
    if (customType?.validator && !customType.validator(value)) {
      throw new Error(`Invalid value for property ${propertyName}`);
    }

    // Transform value if transformer exists
    const transformedValue = customType?.transformer ? customType.transformer(value) : value;

    // Record change in history
    this.historyManager.addChange({
      elementId,
      propertyName,
      oldValue,
      newValue: transformedValue,
    });

    // Update property
    elementProperties[propertyName] = transformedValue;
  }

  getProperty(elementId: string, propertyName: string): PropertyValue | undefined {
    return this.properties.get(elementId)?.[propertyName];
  }

  getAllProperties(elementId: string): Record<string, PropertyValue> | undefined {
    return this.properties.get(elementId);
  }

  generateCode(elementId: string): string {
    const properties = this.properties.get(elementId);
    if (!properties) return '';

    // Generate CSS properties
    const cssProperties = Object.entries(properties)
      .map(([key, value]) => {
        // Handle different property types
        if (typeof value === 'string') {
          return `${key}: ${value};`;
        } else if (typeof value === 'number') {
          return `${key}: ${value}px;`;
        } else if (typeof value === 'boolean') {
          return value ? `${key}: true;` : '';
        } else if (typeof value === 'object') {
          return `${key}: ${JSON.stringify(value)};`;
        }
        return '';
      })
      .filter(Boolean)
      .join('\n');

    return cssProperties;
  }

  undo(): void {
    const change = this.historyManager.undo();
    if (change) {
      const { elementId, propertyName, oldValue } = change;
      const elementProperties = this.properties.get(elementId);
      if (elementProperties) {
        elementProperties[propertyName] = oldValue;
      }
    }
  }

  redo(): void {
    const change = this.historyManager.redo();
    if (change) {
      const { elementId, propertyName, newValue } = change;
      const elementProperties = this.properties.get(elementId);
      if (elementProperties) {
        elementProperties[propertyName] = newValue;
      }
    }
  }
}

// Export a singleton instance
export const propertyManager = new PropertyManager();

import { PropertyPreset, propertyManager } from './property-system';

export const buttonPresets: PropertyPreset[] = [
  {
    id: 'button-primary',
    name: 'Primary Button',
    category: 'buttons',
    properties: {
      backgroundColor: '#14F195',
      color: '#000000',
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: '600',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      hoverBackgroundColor: '#0FD584',
    },
  },
  {
    id: 'button-secondary',
    name: 'Secondary Button',
    category: 'buttons',
    properties: {
      backgroundColor: 'transparent',
      color: '#14F195',
      padding: '12px 24px',
      borderRadius: '8px',
      fontWeight: '600',
      border: '2px solid #14F195',
      cursor: 'pointer',
      transition: 'all 0.2s ease-in-out',
      hoverBackgroundColor: '#14F195',
      hoverColor: '#000000',
    },
  },
];

export const cardPresets: PropertyPreset[] = [
  {
    id: 'card-default',
    name: 'Default Card',
    category: 'cards',
    properties: {
      backgroundColor: '#1A1A1A',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      border: '1px solid rgba(255, 255, 255, 0.1)',
    },
  },
  {
    id: 'card-gradient',
    name: 'Gradient Card',
    category: 'cards',
    properties: {
      background: 'linear-gradient(135deg, #14F195 0%, #9945FF 100%)',
      borderRadius: '12px',
      padding: '24px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    },
  },
];

export const textPresets: PropertyPreset[] = [
  {
    id: 'text-heading',
    name: 'Heading',
    category: 'typography',
    properties: {
      fontSize: '24px',
      fontWeight: '700',
      lineHeight: '1.2',
      letterSpacing: '-0.025em',
      color: '#FFFFFF',
    },
  },
  {
    id: 'text-body',
    name: 'Body Text',
    category: 'typography',
    properties: {
      fontSize: '16px',
      fontWeight: '400',
      lineHeight: '1.5',
      color: 'rgba(255, 255, 255, 0.8)',
    },
  },
];

// Register all presets with the property manager
export function registerPresets(): void {
  [...buttonPresets, ...cardPresets, ...textPresets].forEach((preset) => {
    propertyManager.addPreset(preset);
  });
}

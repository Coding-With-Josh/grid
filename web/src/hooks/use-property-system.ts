import { useState, useCallback, useEffect } from 'react';
import { propertyManager, PropertyValue, PropertyPreset } from '@/lib/editor/property-system';

export function usePropertySystem(elementId: string) {
  const [properties, setProperties] = useState<Record<string, PropertyValue>>(
    propertyManager.getAllProperties(elementId) || {}
  );

  // Update property
  const setProperty = useCallback(
    (propertyName: string, value: PropertyValue) => {
      try {
        propertyManager.setProperty(elementId, propertyName, value);
        setProperties(propertyManager.getAllProperties(elementId) || {});
      } catch (error) {
        console.error('Failed to set property:', error);
      }
    },
    [elementId]
  );

  // Apply preset
  const applyPreset = useCallback(
    (presetId: string) => {
      propertyManager.applyPreset(elementId, presetId);
      setProperties(propertyManager.getAllProperties(elementId) || {});
    },
    [elementId]
  );

  // Undo/Redo
  const undo = useCallback(() => {
    propertyManager.undo();
    setProperties(propertyManager.getAllProperties(elementId) || {});
  }, [elementId]);

  const redo = useCallback(() => {
    propertyManager.redo();
    setProperties(propertyManager.getAllProperties(elementId) || {});
  }, [elementId]);

  // Generate code
  const generateCode = useCallback(() => {
    return propertyManager.generateCode(elementId);
  }, [elementId]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'z') {
        if (e.shiftKey) {
          redo();
        } else {
          undo();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  return {
    properties,
    setProperty,
    applyPreset,
    undo,
    redo,
    generateCode,
  };
}

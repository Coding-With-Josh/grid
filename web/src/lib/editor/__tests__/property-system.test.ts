import { PropertyManager } from '../property-system';
import { createValidator } from '../property-validators';

describe('PropertyManager', () => {
  let manager: PropertyManager;

  beforeEach(() => {
    manager = new PropertyManager();
  });

  describe('Property Management', () => {
    it('sets and gets properties', () => {
      manager.setProperty('element1', 'color', '#ff0000');
      expect(manager.getProperty('element1', 'color')).toBe('#ff0000');
    });

    it('gets all properties for an element', () => {
      manager.setProperty('element1', 'color', '#ff0000');
      manager.setProperty('element1', 'size', 100);

      const properties = manager.getAllProperties('element1');
      expect(properties).toEqual({
        color: '#ff0000',
        size: 100
      });
    });

    it('validates properties before setting', () => {
      manager.registerCustomType({
        name: 'color',
        type: 'string',
        validator: createValidator('color')
      });

      expect(() => {
        manager.setProperty('element1', 'color', 'invalid');
      }).toThrow();

      expect(() => {
        manager.setProperty('element1', 'color', '#ff0000');
      }).not.toThrow();
    });

    it('transforms properties when setting', () => {
      manager.registerCustomType({
        name: 'uppercase',
        type: 'string',
        transformer: (value) => String(value).toUpperCase()
      });

      manager.setProperty('element1', 'uppercase', 'test');
      expect(manager.getProperty('element1', 'uppercase')).toBe('TEST');
    });
  });

  describe('History Management', () => {
    it('tracks property changes', () => {
      manager.setProperty('element1', 'color', '#ff0000');
      manager.setProperty('element1', 'color', '#00ff00');

      manager.undo();
      expect(manager.getProperty('element1', 'color')).toBe('#ff0000');

      manager.redo();
      expect(manager.getProperty('element1', 'color')).toBe('#00ff00');
    });

    it('clears redo stack on new change', () => {
      manager.setProperty('element1', 'color', '#ff0000');
      manager.setProperty('element1', 'color', '#00ff00');
      
      manager.undo();
      manager.setProperty('element1', 'color', '#0000ff');
      
      manager.redo(); // Should do nothing
      expect(manager.getProperty('element1', 'color')).toBe('#0000ff');
    });
  });

  describe('Preset Management', () => {
    it('applies presets', () => {
      manager.addPreset({
        id: 'preset1',
        name: 'Test Preset',
        category: 'test',
        properties: {
          color: '#ff0000',
          size: 100
        }
      });

      manager.applyPreset('element1', 'preset1');

      expect(manager.getProperty('element1', 'color')).toBe('#ff0000');
      expect(manager.getProperty('element1', 'size')).toBe(100);
    });

    it('validates preset properties', () => {
      manager.registerCustomType({
        name: 'color',
        type: 'string',
        validator: createValidator('color')
      });

      manager.addPreset({
        id: 'preset1',
        name: 'Test Preset',
        category: 'test',
        properties: {
          color: '#ff0000' // Valid color
        }
      });

      manager.addPreset({
        id: 'preset2',
        name: 'Invalid Preset',
        category: 'test',
        properties: {
          color: 'invalid' // Invalid color
        }
      });

      expect(() => {
        manager.applyPreset('element1', 'preset1');
      }).not.toThrow();

      expect(() => {
        manager.applyPreset('element1', 'preset2');
      }).toThrow();
    });
  });

  describe('Code Generation', () => {
    it('generates CSS code', () => {
      manager.setProperty('element1', 'color', '#ff0000');
      manager.setProperty('element1', 'width', 100);
      manager.setProperty('element1', 'visible', true);

      const code = manager.generateCode('element1');
      expect(code).toContain('color: #ff0000;');
      expect(code).toContain('width: 100px;');
      expect(code).toContain('visible: true;');
    });
  });

  describe('Custom Types', () => {
    it('registers custom types', () => {
      manager.registerCustomType({
        name: 'custom',
        type: 'string',
        validator: createValidator('string', { minLength: 3 }),
        transformer: (value) => String(value).toUpperCase()
      });

      expect(() => {
        manager.setProperty('element1', 'custom', 'ab');
      }).toThrow();

      manager.setProperty('element1', 'custom', 'abc');
      expect(manager.getProperty('element1', 'custom')).toBe('ABC');
    });

    it('includes default types', () => {
      expect(() => {
        manager.setProperty('element1', 'color', 'invalid');
      }).toThrow();

      expect(() => {
        manager.setProperty('element1', 'dimension', 'invalid');
      }).toThrow();

      expect(() => {
        manager.setProperty('element1', 'expression', 'invalid{');
      }).toThrow();
    });
  });
});

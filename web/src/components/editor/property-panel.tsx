import { useState, useEffect } from 'react';
import { usePropertySystem } from '@/hooks/use-property-system';
import { propertyManager } from '@/lib/editor/property-system';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Undo2, Redo2, Copy, Paintbrush } from 'lucide-react';
import { toast } from 'sonner';

interface PropertyPanelProps {
  elementId: string;
  onPropertyChange: (elementId: string, propertyName: string, value: any) => void;
}

export function PropertyPanel({ elementId, onPropertyChange }: PropertyPanelProps) {
  const [activeTab, setActiveTab] = useState('properties');
  const { properties, setProperty, applyPreset, undo, redo, generateCode } = usePropertySystem(elementId);

  const handlePropertyChange = (propertyName: string, value: any) => {
    try {
      setProperty(propertyName, value);
      onPropertyChange(elementId, propertyName, value);
    } catch (error) {
      console.error('Error updating property:', error);
      toast.error('Failed to update property');
    }
  };

  const handlePresetApply = async (presetId: string) => {
    try {
      await applyPreset(presetId);
      toast.success('Preset applied successfully');
    } catch (error) {
      console.error('Error applying preset:', error);
      toast.error('Failed to apply preset');
    }
  };

  const copyGeneratedCode = async () => {
    try {
      const code = generateCode();
      await navigator.clipboard.writeText(code);
      toast.success('Code copied to clipboard');
    } catch (error) {
      console.error('Error copying code:', error);
      toast.error('Failed to copy code');
    }
  };

  const handleUndo = () => {
    try {
      undo();
      toast.info('Undo successful');
    } catch (error) {
      console.error('Error during undo:', error);
      toast.error('Failed to undo');
    }
  };

  const handleRedo = () => {
    try {
      redo();
      toast.info('Redo successful');
    } catch (error) {
      console.error('Error during redo:', error);
      toast.error('Failed to redo');
    }
  };

  return (
    <Card className="h-full border-none rounded-none">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Properties</CardTitle>
        <div className="flex gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={handleRedo}
            title="Redo (Ctrl+Shift+Z)"
          >
            <Redo2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-[calc(100vh-5rem)]">
          <TabsList className="w-full rounded-none border-b">
            <TabsTrigger value="properties" className="flex-1">Properties</TabsTrigger>
            <TabsTrigger value="presets" className="flex-1">Presets</TabsTrigger>
            <TabsTrigger value="code" className="flex-1">Code</TabsTrigger>
          </TabsList>

          <ScrollArea className="h-[calc(100vh-8rem)] rounded-none">
            <div className="p-4">
              <TabsContent value="properties" className="m-0">
                <div className="space-y-4">
                  {Object.entries(properties).map(([name, value]) => (
                    <div key={name} className="space-y-2">
                      <Label htmlFor={name} className="text-xs font-medium">
                        {name.charAt(0).toUpperCase() + name.slice(1)}
                      </Label>
                      <Input
                        id={name}
                        value={value as string}
                        onChange={(e) => handlePropertyChange(name, e.target.value)}
                        className="h-8"
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="presets" className="m-0">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-medium">Quick Styles</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePresetApply('button-primary')}
                        className="justify-start"
                      >
                        <Paintbrush className="mr-2 h-4 w-4" />
                        Primary
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handlePresetApply('button-secondary')}
                        className="justify-start"
                      >
                        <Paintbrush className="mr-2 h-4 w-4" />
                        Secondary
                      </Button>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="code" className="m-0">
                <div className="space-y-4">
                  <div className="relative">
                    <pre className="p-4 rounded-lg bg-muted font-mono text-sm">
                      {generateCode()}
                    </pre>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2"
                      onClick={copyGeneratedCode}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </ScrollArea>
        </Tabs>
      </CardContent>
    </Card>
  );
}

import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { Copy, Code, Download } from "lucide-react";

interface CodeGeneratorProps {
  elements: any[];
  className?: string;
}

export function CodeGenerator({ elements, className }: CodeGeneratorProps) {
  const [activeTab, setActiveTab] = useState("react");

  const generateImports = (elements: any[]): string => {
    const imports = new Set<string>();
    imports.add(`import React from 'react';\n`);
    
    const addImport = (importStatement: string) => imports.add(importStatement);

    const processElement = (element: any) => {
      switch (element.type) {
        case "button":
          addImport(`import { Button } from "@/components/ui/button";\n`);
          break;
        case "walletConnect":
          addImport(`import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";\n`);
          break;
        case "tokenBalance":
          addImport(`import { TokenBalance } from "@/components/solana/widgets/token-balance";\n`);
          break;
        case "tokenMint":
          addImport(`import { TokenMint } from "@/components/solana/widgets/token-mint";\n`);
          break;
        case "tokenSwap":
          addImport(`import { TokenSwap } from "@/components/solana/widgets/token-swap";\n`);
          break;
        case "nftGallery":
          addImport(`import { NFTGallery } from "@/components/solana/widgets/nft-gallery";\n`);
          break;
        case "list":
          addImport(`import { ScrollArea } from "@/components/ui/scroll-area";\n`);
          break;
        case "badge":
          addImport(`import { Badge } from "@/components/ui/badge";\n`);
          break;
        case "divider":
          addImport(`import { Separator } from "@/components/ui/separator";\n`);
          break;
        case "image":
          addImport(`import Image from "next/image";\n`);
          break;
      }

      if (element.children) {
        element.children.forEach(processElement);
      }
    };

    elements.forEach(processElement);
    return Array.from(imports).join('');
  };

  const generateReactCode = (elements: any[]): string => {
    const imports = generateImports(elements);
    let componentCode = `\nexport default function GeneratedComponent() {\n  return (\n`;

    const generateElementCode = (element: any, indent: number = 4): string => {
      const indentation = " ".repeat(indent);
      const className = element.props?.className || '';
      
      switch (element.type) {
        case "container":
          return `${indentation}<div className="${className}">\n` +
                 `${element.children?.map((child: any) => generateElementCode(child, indent + 2)).join("\n") || ''}\n` +
                 `${indentation}</div>`;
        case "row":
          return `${indentation}<div className="flex ${className}">\n` +
                 `${element.children?.map((child: any) => generateElementCode(child, indent + 2)).join("\n") || ''}\n` +
                 `${indentation}</div>`;
        case "column":
          return `${indentation}<div className="flex flex-col ${className}">\n` +
                 `${element.children?.map((child: any) => generateElementCode(child, indent + 2)).join("\n") || ''}\n` +
                 `${indentation}</div>`;
        case "button":
          return `${indentation}<Button variant="${element.props?.variant || 'default'}" className="${className}">\n` +
                 `${indentation}  ${element.props?.text || 'Button'}\n` +
                 `${indentation}</Button>`;
        case "text":
          return `${indentation}<p className="${className}">${element.props?.text || ''}</p>`;
        case "heading1":
          return `${indentation}<h1 className="${className}">${element.props?.text || ''}</h1>`;
        case "walletConnect":
          return `${indentation}<WalletMultiButton className="${className}" />`;
        case "tokenBalance":
          return `${indentation}<TokenBalance mint="${element.props?.mint || ''}" className="${className}" />`;
        case "tokenMint":
          return `${indentation}<TokenMint className="${className}" />`;
        case "tokenSwap":
          return `${indentation}<TokenSwap className="${className}" />`;
        case "nftGallery":
          return `${indentation}<NFTGallery className="${className}" />`;
        case "list":
          return `${indentation}<ScrollArea className="${className}">\n` +
                 `${element.children?.map((child: any) => generateElementCode(child, indent + 2)).join("\n") || ''}\n` +
                 `${indentation}</ScrollArea>`;
        case "badge":
          return `${indentation}<Badge variant="${element.props?.variant || 'default'}" className="${className}">\n` +
                 `${indentation}  ${element.props?.text || ''}\n` +
                 `${indentation}</Badge>`;
        case "divider":
          return `${indentation}<Separator className="${className}" />`;
        case "spacer":
          return `${indentation}<div className="h-${element.props?.size || '4'} ${className}" />`;
        case "image":
          return `${indentation}<Image\n` +
                 `${indentation}  src="${element.props?.src || '/placeholder.jpg'}"\n` +
                 `${indentation}  alt="${element.props?.alt || ''}"\n` +
                 `${indentation}  width={${element.props?.width || 400}}\n` +
                 `${indentation}  height={${element.props?.height || 300}}\n` +
                 `${indentation}  className="${className}"\n` +
                 `${indentation}/>`;
        case "icon":
          return `${indentation}<span className="icon ${className}">${element.props?.icon || ''}</span>`;
        default:
          return `${indentation}<div className="${className}">Element type: ${element.type}</div>`;
      }
    };

    componentCode += elements.map(element => generateElementCode(element)).join("\n") + "\n  );\n}\n";
    return imports + componentCode;
  };

  const generateTailwindCode = (elements: any[]): string => {
    // For Tailwind, we'll generate a pure HTML/CSS version without React components
    let code = `<!-- Tailwind CSS Component -->\n`;

    const generateElementCode = (element: any, indent: number = 0): string => {
      const indentation = " ".repeat(indent);
      const className = element.props?.className || '';
      
      switch (element.type) {
        case "container":
          return `${indentation}<div class="${className}">\n` +
                 `${element.children?.map((child: any) => generateElementCode(child, indent + 2)).join("\n") || ''}\n` +
                 `${indentation}</div>`;
        case "row":
          return `${indentation}<div class="flex ${className}">\n` +
                 `${element.children?.map((child: any) => generateElementCode(child, indent + 2)).join("\n") || ''}\n` +
                 `${indentation}</div>`;
        case "column":
          return `${indentation}<div class="flex flex-col ${className}">\n` +
                 `${element.children?.map((child: any) => generateElementCode(child, indent + 2)).join("\n") || ''}\n` +
                 `${indentation}</div>`;
        case "button":
          return `${indentation}<button class="px-4 py-2 rounded-md bg-primary text-white hover:bg-primary/90 ${className}">\n` +
                 `${indentation}  ${element.props?.text || 'Button'}\n` +
                 `${indentation}</button>`;
        case "text":
          return `${indentation}<p class="${className}">${element.props?.text || ''}</p>`;
        case "heading1":
          return `${indentation}<h1 class="text-2xl font-bold ${className}">${element.props?.text || ''}</h1>`;
        case "walletConnect":
          return `${indentation}<button class="px-4 py-2 rounded-md bg-purple-500 text-white hover:bg-purple-600 ${className}">Connect Wallet</button>`;
        case "tokenBalance":
          return `${indentation}<div class="p-4 rounded-md border ${className}">Token Balance Component</div>`;
        case "tokenMint":
          return `${indentation}<div class="p-4 rounded-md border ${className}">Token Mint Component</div>`;
        case "tokenSwap":
          return `${indentation}<div class="p-4 rounded-md border ${className}">Token Swap Component</div>`;
        case "nftGallery":
          return `${indentation}<div class="grid grid-cols-3 gap-4 ${className}">NFT Gallery Component</div>`;
        case "list":
          return `${indentation}<div class="overflow-auto max-h-[400px] ${className}">\n` +
                 `${element.children?.map((child: any) => generateElementCode(child, indent + 2)).join("\n") || ''}\n` +
                 `${indentation}</div>`;
        case "badge":
          return `${indentation}<span class="px-2 py-1 rounded-full text-sm bg-primary/10 text-primary ${className}">${element.props?.text || ''}</span>`;
        case "divider":
          return `${indentation}<hr class="my-4 ${className}" />`;
        case "spacer":
          return `${indentation}<div class="h-${element.props?.size || '4'} ${className}"></div>`;
        case "image":
          return `${indentation}<img\n` +
                 `${indentation}  src="${element.props?.src || '/placeholder.jpg'}"\n` +
                 `${indentation}  alt="${element.props?.alt || ''}"\n` +
                 `${indentation}  class="object-cover ${className}"\n` +
                 `${indentation}/>`;
        case "icon":
          return `${indentation}<span class="icon ${className}">${element.props?.icon || ''}</span>`;
        default:
          return `${indentation}<div class="${className}">Element type: ${element.type}</div>`;
      }
    };

    code += elements.map(element => generateElementCode(element)).join("\n");
    return code;
  };

  const getGeneratedCode = () => {
    switch (activeTab) {
      case "react":
        return generateReactCode(elements);
      case "tailwind":
        return generateTailwindCode(elements);
      default:
        return "// Select a framework to generate code";
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(getGeneratedCode());
      toast({
        description: "Code copied to clipboard",
      });
    } catch (err) {
      toast({
        variant: "destructive",
        description: "Failed to copy code",
      });
    }
  };

  const downloadCode = () => {
    const blob = new Blob([getGeneratedCode()], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `generated-component.${activeTab === "react" ? "tsx" : "html"}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    toast({
      description: "Code downloaded successfully",
    });
  };

  return (
    <Card className={`p-4 ${className}`}>
      <Tabs defaultValue="react" className="w-full" onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4 gap-3">
          <TabsList>
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="tailwind">Tailwind</TabsTrigger>
          </TabsList>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={copyToClipboard}>
              <Copy className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button variant="outline" size="sm" onClick={downloadCode}>
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
          </div>
        </div>

        <TabsContent value="react" className="mt-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              <Label>Generated React Code</Label>
            </div>
            <Textarea
              value={generateReactCode(elements)}
              readOnly
              className="font-mono text-sm h-[400px]"
            />
          </div>
        </TabsContent>

        <TabsContent value="tailwind" className="mt-0">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Code className="h-5 w-5" />
              <Label>Generated Tailwind Code</Label>
            </div>
            <Textarea
              value={generateTailwindCode(elements)}
              readOnly
              className="font-mono text-sm h-[400px]"
            />
          </div>
        </TabsContent>
      </Tabs>
    </Card>
  );
}

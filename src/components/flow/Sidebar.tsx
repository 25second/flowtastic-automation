
import { Search } from 'lucide-react';
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { nodeCategories } from './nodeConfig';
import { useState } from 'react';
import type { NodeCategory, FlowNode } from '@/types/flow';

interface SidebarProps {
  onDragStart: (event: React.DragEvent, nodeType: string, nodeLabel: string, settings: any, description: string) => void;
}

export const Sidebar = ({ onDragStart }: SidebarProps) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCategories = nodeCategories.map(category => ({
    ...category,
    nodes: category.nodes.filter(node => 
      node.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.nodes.length > 0);

  return (
    <div className="w-64 border-r bg-background">
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search nodes..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        {filteredCategories.map((category) => (
          <div key={category.name} className="p-4">
            <h2 className="mb-2 text-sm font-semibold">{category.name}</h2>
            {category.nodes.map((node) => (
              <div
                key={node.type}
                className={cn(
                  "mb-2 rounded-md border bg-card p-3 cursor-move hover:border-primary",
                  "transition-colors duration-200"
                )}
                draggable
                onDragStart={(event) => onDragStart(event, node.type, node.label, node.settings, node.description)}
              >
                <div className="text-sm font-medium">{node.label}</div>
                <div className="text-xs text-muted-foreground">{node.description}</div>
              </div>
            ))}
          </div>
        ))}
      </ScrollArea>
    </div>
  );
};


import { Button } from "@/components/ui/button";
import { LayoutGrid, List, Table } from "lucide-react";

interface ViewToggleProps {
    currentView: 'table' | 'list' | 'grid';
    onViewChange: (view: 'table' | 'list' | 'grid') => void;
}

export function ViewToggle({ currentView, onViewChange }: ViewToggleProps) {
    return (
        <div className="flex items-center gap-2">
            <Button
                variant={currentView === 'table' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onViewChange('table')}
            >
                <Table className="h-4 w-4" />
            </Button>
            <Button
                variant={currentView === 'list' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onViewChange('list')}
            >
                <List className="h-4 w-4" />
            </Button>
            <Button
                variant={currentView === 'grid' ? 'default' : 'ghost'}
                size="icon"
                onClick={() => onViewChange('grid')}
            >
                <LayoutGrid className="h-4 w-4" />
            </Button>
        </div>
    );
} 
"use client";
import { Plus, History, List, Trash2, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RaffleList } from '@/lib/types';
import { Logo } from '@/components/icons/logo';
import { ScrollArea } from './ui/scroll-area';
import { cn } from '@/lib/utils';

interface ListsSidebarProps {
  lists: RaffleList[];
  activeView: string;
  setActiveView: (view: string) => void;
  createList: () => void;
}

export function ListsSidebar({ lists, activeView, setActiveView, createList }: ListsSidebarProps) {
  return (
    <aside className="w-64 flex-shrink-0 border-r bg-card flex flex-col">
      <div className="h-16 flex items-center px-4 border-b">
        <Logo />
        <h1 className="text-xl font-bold ml-2 text-primary">RaffleFlow</h1>
      </div>
      <div className="p-4">
        <Button onClick={createList} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" /> Create New List
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="px-4 pb-4">
          <h2 className="text-sm font-semibold text-muted-foreground px-2 mb-2">My Lists</h2>
          <ul className="space-y-1">
            {lists.map(list => (
              <li key={list.id}>
                <Button
                  variant="ghost"
                  className={cn("w-full justify-start", activeView === list.id && "bg-secondary font-semibold")}
                  onClick={() => setActiveView(list.id)}
                >
                  <List className="mr-2 h-4 w-4" />
                  <span className="truncate">{list.name}</span>
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className={cn("w-full justify-start", activeView === 'history' && "bg-secondary font-semibold")}
          onClick={() => setActiveView('history')}
        >
          <History className="mr-2 h-4 w-4" /> Raffle History
        </Button>
      </div>
    </aside>
  );
}

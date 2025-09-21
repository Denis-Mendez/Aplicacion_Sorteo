"use client";
import { Plus, History, List, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { RaffleList } from '@/lib/types';
import { Logo } from '@/components/icons/logo';
import { ScrollArea } from './ui/scroll-area';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import React from 'react';

interface ListsSidebarProps {
  lists: RaffleList[];
  activeView: string;
  setActiveView: (view: string) => void;
  createList: () => void;
}

export function ListsSidebar({ lists, activeView, setActiveView, createList }: ListsSidebarProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLinkClick = (view: string) => {
    setActiveView(view);
    setIsMobileMenuOpen(false);
  };

  const SidebarContent = () => (
    <>
      <div className="h-16 flex items-center px-4 border-b">
        <Logo />
        <h1 className="text-xl font-bold ml-2 text-primary">Sorteos</h1>
      </div>
      <div className="p-4">
        <Button onClick={createList} className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" /> Crear Nueva Lista
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <nav className="px-4 pb-4">
          <h2 className="text-sm font-semibold text-muted-foreground px-2 mb-2">Mis Listas</h2>
          {lists.length > 0 ? (
            <ul className="space-y-1">
              {lists.map(list => (
                <li key={list.id}>
                  <Button
                    variant="ghost"
                    className={cn("w-full justify-start", activeView === list.id && "bg-secondary font-semibold")}
                    onClick={() => handleLinkClick(list.id)}
                  >
                    <List className="mr-2 h-4 w-4" />
                    <span className="truncate">{list.name}</span>
                  </Button>
                </li>
              ))}
            </ul>
          ) : (
             <p className="text-sm text-muted-foreground px-2">No hay listas aún.</p>
          )}
        </nav>
      </ScrollArea>
      <div className="p-4 border-t">
        <Button
          variant="ghost"
          className={cn("w-full justify-start", activeView === 'history' && "bg-secondary font-semibold")}
          onClick={() => handleLinkClick('history')}
        >
          <History className="mr-2 h-4 w-4" /> Historial de Sorteos
        </Button>
      </div>
    </>
  );

  return (
    <>
      {/* Mobile Sidebar */}
      <div className="md:hidden p-2 absolute top-0 left-0 z-10">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 flex flex-col">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Desktop Sidebar */}
      <aside className="w-64 flex-shrink-0 border-r bg-card flex-col hidden md:flex">
        <SidebarContent />
      </aside>
    </>
  );
}

"use client";

import React, { useState, useMemo } from 'react';
import type { RaffleList, RaffleResult } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { ListsSidebar } from '@/components/lists-sidebar';
import { ParticipantView } from '@/components/participant-view';
import { HistoryView } from '@/components/history-view';
import { EmptyState } from '@/components/empty-state';
import { Ticket } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';

export function MainPage() {
  const [lists, setLists, listsInitialized] = useLocalStorage<RaffleList[]>('raffle-lists', []);
  const [history, setHistory, historyInitialized] = useLocalStorage<RaffleResult[]>('raffle-history', []);
  const [activeView, setActiveView] = useState<string>('welcome'); // Can be list ID, 'history', or 'welcome'

  const activeList = useMemo(() => lists.find(l => l.id === activeView), [lists, activeView]);

  const createList = () => {
    const newList: RaffleList = {
      id: `list-${Date.now()}`,
      name: 'Lista sin título',
      participants: [],
      createdAt: new Date().toISOString(),
    };
    setLists(prev => [...prev, newList]);
    setActiveView(newList.id);
  };

  const updateList = (updatedList: RaffleList) => {
    setLists(prev => prev.map(l => l.id === updatedList.id ? updatedList : l));
  };

  const deleteList = (listId: string) => {
    setLists(prev => prev.filter(l => l.id !== listId));
    setActiveView('welcome');
  };

  const addRaffleToHistory = (result: RaffleResult) => {
    setHistory(prev => [result, ...prev]);
  };

  if (!listsInitialized || !historyInitialized) {
    return (
      <div className="flex h-screen bg-background">
        <div className="w-64 border-r p-4 hidden md:block">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-full mb-2" />
          <Skeleton className="h-6 w-5/6" />
        </div>
        <div className="flex-1 p-8">
          <Skeleton className="h-12 w-1/3 mb-8" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-background font-body">
      <ListsSidebar
        lists={lists}
        activeView={activeView}
        setActiveView={setActiveView}
        createList={createList}
      />
      <main className="flex-1 overflow-y-auto">
        {activeList ? (
          <ParticipantView
            key={activeList.id}
            list={activeList}
            updateList={updateList}
            deleteList={deleteList}
            addRaffleToHistory={addRaffleToHistory}
          />
        ) : activeView === 'history' ? (
          <HistoryView history={history} />
        ) : (
          <EmptyState
            icon={<Ticket className="w-16 h-16 text-primary" />}
            title="Bienvenido a Sorteos"
            description="Selecciona una lista de la barra lateral o crea una nueva para comenzar."
          />
        )}
      </main>
    </div>
  );
}

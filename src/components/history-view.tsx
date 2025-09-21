"use client";

import type { RaffleResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Calendar, UserCheck } from 'lucide-react';

interface HistoryViewProps {
  history: RaffleResult[];
}

export function HistoryView({ history }: HistoryViewProps) {
  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <header className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><History /> Historial de Selecciones</h1>
        <p className="text-muted-foreground">Un registro de todas tus selecciones anteriores.</p>
      </header>
      <ScrollArea className="flex-1 -mx-4 md:-mx-8 px-4 md:px-8">
        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map(item => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-accent flex items-center gap-2">
                    <UserCheck className="h-5 w-5" /> 
                    {item.winners[0]?.name || 'Operario desconocido'}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 pt-2">
                    <Calendar className="h-4 w-4" />
                    <span>Selección de la lista "{item.listName}" el {new Date(item.date).toLocaleString()}</span>
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-20">
            <History className="mx-auto h-12 w-12 mb-4" />
            <p>Aún no hay historial de selecciones.</p>
            <p>Realiza una selección para ver sus resultados aquí.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

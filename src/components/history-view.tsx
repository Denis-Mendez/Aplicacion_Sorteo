"use client";

import type { RaffleResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History, Calendar, Trophy, Hash } from 'lucide-react';

interface HistoryViewProps {
  history: RaffleResult[];
}

export function HistoryView({ history }: HistoryViewProps) {
  return (
    <div className="p-4 md:p-8 h-full flex flex-col">
      <header className="mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2"><History /> Historial de Sorteos</h1>
        <p className="text-muted-foreground">Un registro de todos tus sorteos anteriores.</p>
      </header>
      <ScrollArea className="flex-1 -mx-4 md:-mx-8 px-4 md:px-8">
        {history.length > 0 ? (
          <div className="space-y-4">
            {history.map(item => (
              <Card key={item.id}>
                <CardHeader>
                  <CardTitle className="text-accent">{item.listName}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {new Date(item.date).toLocaleString()}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <h4 className="font-semibold mb-2">Ganadores</h4>
                      <ul className="list-disc list-inside">
                        {item.winners.map(winner => (
                          <li key={winner.id} className="truncate">{winner.name}</li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Configuración</h4>
                      <div className="space-y-1 text-muted-foreground">
                        <p className="flex items-center gap-2"><Trophy className="h-4 w-4" />{item.settings.numberOfWinners} ganadores</p>
                        {item.settings.seed && <p className="flex items-center gap-2 truncate"><Hash className="h-4 w-4" />Semilla: {item.settings.seed}</p>}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground mt-20">
            <History className="mx-auto h-12 w-12 mb-4" />
            <p>Aún no hay historial de sorteos.</p>
            <p>Realiza un sorteo para ver sus resultados aquí.</p>
          </div>
        )}
      </ScrollArea>
    </div>
  );
}

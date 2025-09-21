"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Ticket, Dices, RotateCw, UserCheck } from 'lucide-react';
import type { RaffleList, RaffleResult, Participant } from '@/lib/types';
import { runRaffle } from '@/lib/raffle';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from './ui/badge';

interface RaffleDialogProps {
  list: RaffleList;
  addRaffleToHistory: (result: RaffleResult) => void;
}

type RaffleState = 'idle' | 'drawing' | 'results';

export function RaffleDialog({ list, addRaffleToHistory }: RaffleDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<RaffleState>('idle');
  const [winner, setWinner] = useState<Participant | null>(null);

  const participantCount = list.participants.length;

  const handleRunRaffle = () => {
    if (participantCount < 1) return;
    
    setState('drawing');
    const [drawnWinner] = runRaffle(list.participants, 1);
    setWinner(drawnWinner);

    const result: RaffleResult = {
      id: `hist-${Date.now()}`,
      listId: list.id,
      listName: list.name,
      date: new Date().toISOString(),
      winners: [drawnWinner],
      settings: { numberOfWinners: 1 },
    };
    addRaffleToHistory(result);

    setTimeout(() => {
        setState('results');
    }, 2000);
  };
  
  const reset = () => {
    setState('idle');
    setWinner(null);
  };

  useEffect(() => {
    if (isOpen) {
      handleRunRaffle();
    } else {
      reset();
    }
  }, [isOpen]);
  
  const renderContent = () => {
    switch (state) {
      case 'drawing':
        return (
          <div className="py-8 text-center">
            <Dices className="mx-auto h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg font-medium">Seleccionando operario...</p>
          </div>
        );
      case 'results':
        return (
          <div>
             <DialogHeader className="text-center mb-4">
               <DialogTitle className="text-2xl">Operario Seleccionado</DialogTitle>
            </DialogHeader>
            <div className="grid gap-2 my-4">
              {winner && (
                <Card className="animate-in fade-in-0 slide-in-from-bottom-5">
                  <CardContent className="p-3 flex items-center gap-3">
                    <Badge variant="secondary" className="text-lg bg-accent text-accent-foreground"><UserCheck className="h-5 w-5"/></Badge>
                    <div className="flex-1">
                      <p className="font-semibold text-xl">{winner.name}</p>
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
            <DialogFooter>
              <Button onClick={handleRunRaffle} variant="outline"><RotateCw className="mr-2 h-4 w-4" /> Seleccionar de nuevo</Button>
            </DialogFooter>
          </div>
        );
      case 'idle':
      default:
         return (
          <div className="py-8 text-center">
            <Dices className="mx-auto h-16 w-16 text-primary" />
            <p className="mt-4 text-lg font-medium">Preparando selección...</p>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={participantCount === 0}>
          <Ticket className="mr-2 h-4 w-4" /> Realizar Sorteo
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]" onInteractOutside={(e) => e.preventDefault()}>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

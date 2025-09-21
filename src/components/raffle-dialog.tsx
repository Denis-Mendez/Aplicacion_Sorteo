"use client";

import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Wand2, Ticket, Trophy, Dices, RotateCw } from 'lucide-react';
import type { RaffleList, RaffleResult, Participant } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { runRaffle } from '@/lib/raffle';
import { getRaffleSuggestions } from '@/app/actions';
import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';

interface RaffleDialogProps {
  list: RaffleList;
  addRaffleToHistory: (result: RaffleResult) => void;
}

type RaffleState = 'configuring' | 'drawing' | 'results';

export function RaffleDialog({ list, addRaffleToHistory }: RaffleDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [numberOfWinners, setNumberOfWinners] = useState(1);
  const [seed, setSeed] = useState('');
  const [isAISuggesting, setIsAISuggesting] = useState(false);
  const [state, setState] = useState<RaffleState>('configuring');
  const [winners, setWinners] = useState<Participant[]>([]);
  const { toast } = useToast();

  const participantCount = list.participants.length;

  const handleAISuggestions = async () => {
    setIsAISuggesting(true);
    try {
      const result = await getRaffleSuggestions(participantCount);
      setNumberOfWinners(result.suggestedWinnerCount);
      toast({
        title: "AI Suggestion Applied",
        description: `Suggested ${result.suggestedWinnerCount} winners. ${result.additionalNotes || ''}`,
      });
    } catch (error) {
      toast({ title: "Error", description: (error as Error).message, variant: 'destructive' });
    } finally {
      setIsAISuggesting(false);
    }
  };

  const handleRunRaffle = () => {
    if (numberOfWinners < 1 || numberOfWinners > participantCount) {
      toast({ title: "Invalid Input", description: `Number of winners must be between 1 and ${participantCount}.`, variant: 'destructive' });
      return;
    }
    setState('drawing');
    const drawnWinners = runRaffle(list.participants, numberOfWinners, seed);
    setWinners(drawnWinners);

    const result: RaffleResult = {
      id: `hist-${Date.now()}`,
      listId: list.id,
      listName: list.name,
      date: new Date().toISOString(),
      winners: drawnWinners,
      settings: { numberOfWinners, seed },
    };
    addRaffleToHistory(result);

    setTimeout(() => {
        setState('results');
    }, 2000 + Math.min(drawnWinners.length * 300, 3000));
  };

  const reset = () => {
    setState('configuring');
    setWinners([]);
    setSeed('');
  };

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen]);

  const renderContent = () => {
    switch (state) {
      case 'drawing':
        return (
          <div className="py-8 text-center">
            <Dices className="mx-auto h-16 w-16 animate-spin text-primary" />
            <p className="mt-4 text-lg font-medium">Drawing winners...</p>
          </div>
        );
      case 'results':
        return (
          <div>
             <DialogHeader className="text-center mb-4">
               <DialogTitle className="text-2xl">🎉 Congratulations to the Winners! 🎉</DialogTitle>
            </DialogHeader>
            <div className="grid gap-2 my-4 max-h-64 overflow-y-auto pr-4">
              {winners.map((winner, index) => (
                <Card key={winner.id} className="animate-in fade-in-0 slide-in-from-bottom-5" style={{animationDelay: `${index * 150}ms`}}>
                  <CardContent className="p-3 flex items-center gap-3">
                    <Badge variant="secondary" className="text-lg bg-accent text-accent-foreground">{index + 1}</Badge>
                    <div className="flex-1">
                      <p className="font-semibold">{winner.name}</p>
                      {winner.email && <p className="text-xs text-muted-foreground">{winner.email}</p>}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <DialogFooter>
              <Button onClick={reset} variant="outline"><RotateCw className="mr-2 h-4 w-4" /> Run Again</Button>
            </DialogFooter>
          </div>
        );
      case 'configuring':
      default:
        return (
          <div>
            <DialogHeader>
              <DialogTitle>Run Raffle: {list.name}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{participantCount} participants</p>
                <Button variant="outline" size="sm" onClick={handleAISuggestions} disabled={isAISuggesting || participantCount === 0}>
                  <Wand2 className={cn("mr-2 h-4 w-4", isAISuggesting && "animate-spin")} />
                  Get AI Suggestions
                </Button>
              </div>
              <Separator />
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="winners" className="text-right">Winners</Label>
                <Input
                  id="winners"
                  type="number"
                  value={numberOfWinners}
                  onChange={e => setNumberOfWinners(Math.max(1, parseInt(e.target.value) || 1))}
                  className="col-span-3"
                  min="1"
                  max={participantCount}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="seed" className="text-right">Seed</Label>
                <Input
                  id="seed"
                  placeholder="Optional for reproducible results"
                  value={seed}
                  onChange={e => setSeed(e.target.value)}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleRunRaffle} disabled={participantCount === 0}>
                <Trophy className="mr-2 h-4 w-4" /> Draw {numberOfWinners} {numberOfWinners > 1 ? 'Winners' : 'Winner'}
              </Button>
            </DialogFooter>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button disabled={participantCount === 0}>
          <Ticket className="mr-2 h-4 w-4" /> Run Raffle
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}

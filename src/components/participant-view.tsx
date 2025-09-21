"use client";

import React, { useState, useRef } from 'react';
import type { Participant, RaffleList, RaffleResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Trash2, Edit, UserPlus, Upload, Download } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { exportToCSV, importFromCSV } from '@/lib/csv';
import { RaffleDialog } from './raffle-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { ScrollArea } from './ui/scroll-area';

interface ParticipantViewProps {
  list: RaffleList;
  updateList: (updatedList: RaffleList) => void;
  deleteList: (listId: string) => void;
  addRaffleToHistory: (result: RaffleResult) => void;
}

export function ParticipantView({ list, updateList, deleteList, addRaffleToHistory }: ParticipantViewProps) {
  const [listName, setListName] = useState(list.name);
  const [editingParticipant, setEditingParticipant] = useState<Participant | null>(null);
  const [isParticipantDialogOpen, setIsParticipantDialogOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleNameChange = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.trim() && e.target.value !== list.name) {
      updateList({ ...list, name: e.target.value.trim() });
    } else {
      setListName(list.name);
    }
  };

  const handleSaveParticipant = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name') as string;

    if (!name.trim()) {
      toast({ title: "Error", description: "El nombre del operario es obligatorio.", variant: 'destructive' });
      return;
    }

    if (editingParticipant) {
      const updatedParticipants = list.participants.map(p =>
        p.id === editingParticipant.id ? { ...p, name } : p
      );
      updateList({ ...list, participants: updatedParticipants });
    } else {
      const newParticipant: Participant = { id: `p-${Date.now()}`, name };
      updateList({ ...list, participants: [...list.participants, newParticipant] });
    }
    setIsParticipantDialogOpen(false);
    setEditingParticipant(null);
  };
  
  const openParticipantDialog = (participant: Participant | null) => {
    setEditingParticipant(participant);
    setIsParticipantDialogOpen(true);
  };

  const deleteParticipant = (participantId: string) => {
    updateList({ ...list, participants: list.participants.filter(p => p.id !== participantId) });
  };
  
  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const newParticipantsData = await importFromCSV(file);
      const newParticipants: Participant[] = newParticipantsData.map(p => ({ ...p, id: `p-${Date.now()}-${Math.random()}` }));
      updateList({ ...list, participants: [...list.participants, ...newParticipants] });
      toast({ title: "Éxito", description: `${newParticipants.length} operarios importados.` });
    } catch (error) {
      toast({ title: "Error de Importación", description: (error as Error).message, variant: 'destructive' });
    }
    e.target.value = ''; // Reset file input
  };
  
  return (
    <div className="p-4 pt-16 md:pt-8 md:p-8 h-full flex flex-col">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <Input
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          onBlur={handleNameChange}
          className="text-2xl font-bold border-0 shadow-none focus-visible:ring-0 p-0 h-auto w-full md:w-auto"
        />
        <div className="flex items-center gap-2 self-end">
           <RaffleDialog list={list} addRaffleToHistory={addRaffleToHistory} />
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon"><Trash2 className="h-4 w-4" /></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Esto eliminará permanentemente la lista
                  "{list.name}" y todos sus operarios.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => deleteList(list.id)}>Continuar</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Button onClick={() => openParticipantDialog(null)}>
          <UserPlus className="mr-2 h-4 w-4" /> Añadir Operario
        </Button>
        <input type="file" accept=".csv" ref={fileInputRef} onChange={handleImport} className="hidden" />
        <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
          <Upload className="mr-2 h-4 w-4" /> Importar CSV
        </Button>
        <Button variant="outline" onClick={() => exportToCSV(list.participants, list.name)} disabled={list.participants.length === 0}>
          <Download className="mr-2 h-4 w-4" /> Exportar CSV
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden flex-1">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader className="sticky top-0 bg-card z-10">
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {list.participants.length > 0 ? (
                list.participants.map(p => (
                  <TableRow key={p.id}>
                    <TableCell className="font-medium">
                      {p.name}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8"><MoreVertical className="h-4 w-4" /></Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => openParticipantDialog(p)}><Edit className="mr-2 h-4 w-4" /> Editar</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => deleteParticipant(p.id)} className="text-red-500"><Trash2 className="mr-2 h-4 w-4" /> Eliminar</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={2} className="h-24 text-center text-muted-foreground">
                    Aún no hay operarios. Añade uno para empezar.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </ScrollArea>
      </div>

      <Dialog open={isParticipantDialogOpen} onOpenChange={setIsParticipantDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingParticipant ? 'Editar' : 'Añadir'} Operario</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSaveParticipant}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">Nombre</Label>
                <Input id="name" name="name" defaultValue={editingParticipant?.name} className="col-span-3" required />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="secondary">Cancelar</Button>
              </DialogClose>
              <Button type="submit">Guardar</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

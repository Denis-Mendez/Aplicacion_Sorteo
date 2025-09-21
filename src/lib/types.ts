export interface Participant {
  id: string;
  name: string;
}

export interface RaffleList {
  id: string;
  name: string;
  participants: Participant[];
  createdAt: string;
}

export interface RaffleResult {
  id: string;
  listId: string;
  listName: string;
  date: string;
  winners: Participant[];
  settings: {
    numberOfWinners: number;
    seed?: string;
  };
}

export type RoomStatus = "waiting" | "in_progress" | "finished";

export interface Player {
  playerId: string;
  name: string;
  joinedAt: string;
  progress: number;
}

export interface Room {
  roomId: string;
  hostId: string;
  maxPlayers: number;
  players: Player[];
  status: RoomStatus;
  durationSeconds: number;
}


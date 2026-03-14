## TypeBoster Backend

Production-ready Node.js backend for the TypeBoster multiplayer typing game, built with **TypeScript**, **Express**, and **Socket.IO**. The architecture is minimal but structured so that Redis, PostgreSQL, authentication, and social features can be added later without major refactors.

### Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Web Framework**: Express
- **Realtime**: Socket.IO
- **Validation**: Zod
- **ID generation**: nanoid
- **Config**: dotenv

### Installation

1. **Install dependencies**

```bash
npm install
```

2. **Create a `.env` file in the project root**

```bash
PORT=4000
CORS_ORIGINS=http://localhost:3000
NODE_ENV=development
```

Multiple origins can be provided as a comma-separated list in `CORS_ORIGINS`.

### Running the Server

- **Development (with auto-reload)**

```bash
npm run dev
```

- **Production build**

```bash
npm run build
npm start
```

### Folder Structure

```text
src/
 ├─ main.ts                 // HTTP server + Socket.IO bootstrap
 ├─ app.ts                  // Express app factory and DI wiring
 ├─ config/
 │   └─ env.ts              // Typed environment configuration
 ├─ common/
 │   ├─ errors/
 │   │   ├─ ApiError.ts     // ApiError class with error codes
 │   │   └─ errorMiddleware.ts // Global error handler
 │   ├─ middleware/
 │   │   └─ validate.ts     // Zod-based request validation middleware
 │   └─ utils/
 │       └─ id.ts           // Short human-friendly ID generator
 ├─ realtime/
 │   ├─ index.ts            // Socket.IO server initialization
 │   └─ rooms.gateway.ts    // Rooms-specific websocket gateway
 ├─ modules/
 │   └─ rooms/
 │       ├─ rooms.routes.ts     // Express routes for /rooms
 │       ├─ rooms.controller.ts // HTTP controllers
 │       ├─ rooms.service.ts    // Business logic (Room lifecycle)
 │       ├─ rooms.schemas.ts    // Zod schemas for validation
 │       ├─ rooms.types.ts      // Room/Player types
 │       ├─ rooms.repository.ts // Repository interface
 │       └─ rooms.memory.ts     // In-memory repository implementation
 └─ routes.ts               // Root router combining all modules
```

The core dependency flow follows:

`Controller → Service → Repository → Store (in-memory Map)`

Services depend only on repository interfaces, so swapping in Redis/PostgreSQL later will not require service or controller changes.

### Data storage (no database)

There is **no database**. All data is kept **in memory**:

- **Where**: `InMemoryRoomsRepository` in `src/modules/rooms/rooms.memory.ts` uses a single `Map<string, Room>` to store rooms by `roomId`.
- **Lifetime**: Data exists only while the Node process is running. Restarting the server clears all rooms and players.
- **Flow**: HTTP and Socket.IO handlers → `RoomsService` → `RoomsRepository` (interface) → `InMemoryRoomsRepository` (Map).

This is intentional for a minimal setup. To add persistence later:

1. Implement the same `RoomsRepository` interface in a new file (e.g. `rooms.postgres.ts` or `rooms.redis.ts`).
2. In `src/app.ts`, replace `new InMemoryRoomsRepository()` with your new repository instance.
3. No changes are needed in controllers or services.

### HTTP API

All routes are prefixed with `/api`.

#### Create Room

- **Endpoint**: `POST /api/rooms`
- **Body**

```json
{
  "hostName": "John",
  "maxPlayers": 4
}
```

- **Response 201**

```json
{
  "roomId": "ABC1234",
  "hostId": "XYZ5678",
  "maxPlayers": 4
}
```

#### Join Room

- **Endpoint**: `POST /api/rooms/:roomId/join`
- **Body**

```json
{
  "playerName": "Alice"
}
```

- **Response 200**

```json
{
  "roomId": "ABC1234",
  "playerId": "P123456",
  "players": [
    {
      "playerId": "XYZ5678",
      "name": "John",
      "joinedAt": "2026-03-04T10:00:00.000Z",
      "progress": 0
    },
    {
      "playerId": "P123456",
      "name": "Alice",
      "joinedAt": "2026-03-04T10:01:00.000Z",
      "progress": 0
    }
  ]
}
```

- **Error cases**
  - Room not found
  - Room full
  - Game already started

#### Start Game

- **Endpoint**: `POST /api/rooms/:roomId/start`
- **Body**

```json
{
  "playerId": "XYZ5678"
}
```

Only the host can start the game.

- **Response 204**

Empty body.

### Error Format

All errors follow a consistent structure:

```json
{
  "error": {
    "code": "ROOM_NOT_FOUND",
    "message": "Room does not exist"
  }
}
```

Validation errors additionally include details:

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Request validation failed",
    "details": { "...": "..." }
  }
}
```

### WebSocket API (Socket.IO)

The Socket.IO server is initialized on the same port as HTTP. CORS origins are controlled by `CORS_ORIGINS`.

#### Connection

```javascript
import { io } from "socket.io-client";

const socket = io("http://10.0.2.2:4000", {
  transports: ["websocket"]
});
```

#### Client → Server Events

- **Join room**

Event: `game_event`

```json
{
  "type": "join_room",
  "roomId": "ABC1234",
  "playerId": "P123456"
}
```

- **Update player progress**

Event: `game_event`

```json
{
  "type": "player_progress",
  "roomId": "ABC1234",
  "playerId": "P123456",
  "progress": 42
}
```

#### Server → Client Events

- **room_updated**

Emitted when players join/leave or host changes:

```json
{
  "roomId": "ABC1234",
  "players": [
    {
      "playerId": "XYZ5678",
      "name": "John",
      "joinedAt": "2026-03-04T10:00:00.000Z",
      "progress": 0
    }
  ],
  "hostId": "XYZ5678",
  "status": "waiting"
}
```

- **game_started**

Emitted when the host starts the game:

```json
{
  "roomId": "ABC1234"
}
```

- **player_progress**

Emitted when any player’s progress is updated:

```json
{
  "roomId": "ABC1234",
  "playerId": "P123456",
  "progress": 42
}
```

- **room_joined**

Confirmation to a successful `join_room` client event:

```json
{
  "roomId": "ABC1234",
  "playerId": "P123456"
}
```

- **error**

WebSocket-level errors (e.g., invalid room or player):

```json
{
  "error": {
    "code": "ROOM_NOT_FOUND",
    "message": "Room does not exist"
  }
}
```

### Disconnect Handling

- When a socket disconnects, its associated player is removed from the room.
- If the host disconnects and other players remain, host is transferred to the next player in the room.
- If the room becomes empty, it is deleted from the in-memory store.
- In all cases where the room still exists, a `room_updated` event is broadcast with the updated player list and host.

### Extensibility Notes

- The `RoomsService` depends on the `RoomsRepository` interface only. Swapping `InMemoryRoomsRepository` for a Redis/PostgreSQL-backed implementation will not affect controllers or realtime gateways.
- Additional modules (authentication, leaderboards, social features) can follow the same pattern: `types` → `schemas` → `repository` → `service` → `controller` → `routes` → `gateway` (for realtime).


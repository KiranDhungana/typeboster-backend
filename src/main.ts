import http from "http";
import { env } from "./config/env";
import { createApp } from "./app";
import { initializeRealtime } from "./realtime";

const { app, roomsService } = createApp();

const server = http.createServer(app);

initializeRealtime(server, roomsService);

server.listen(env.PORT, () => {
  console.log(`TypeBoster backend listening on port ${env.PORT} (${env.NODE_ENV})`);
});


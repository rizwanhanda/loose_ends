// Aegis relay: deliberately stateless and CRDT-agnostic. It forwards opaque
// encrypted WebSocket frames to every other connected client.
import { WebSocket, WebSocketServer } from 'ws';

const port = Number(process.env.RELAY_PORT || 8080);
const relay = new WebSocketServer({ port });

relay.on('connection', socket => {
  socket.on('message', (data, isBinary) => {
    for (const peer of relay.clients) {
      if (peer !== socket && peer.readyState === WebSocket.OPEN) peer.send(data, { binary:isBinary });
    }
  });
});

relay.on('listening', () => console.log(`Aegis opaque relay listening on ws://0.0.0.0:${port}`));

import { Elysia } from "elysia";

type WSMessage = {
  type: 'EVENT_CREATED' | 'EVENT_UPDATED' | 'EVENT_DELETED' | 'EVENT_APPROVED' | 'RSVP_UPDATED';
  payload: any;
};

// Use any to accept the server websocket wrapper Elysia provides and avoid DOM WebSocket type mismatch
const connections = new Set<any>();

export const websocketPlugin = (app: Elysia) => {
  return app.ws('/ws', {
    open(ws) {
      connections.add(ws);
      console.log('Client connected');
    },
    close(ws) {
      connections.delete(ws);
      console.log('Client disconnected');
    },
    message(ws, message) {
      console.log('Received message:', message);
    }
  });
};

export const broadcastMessage = (message: WSMessage) => {
  const messageStr = JSON.stringify(message);
  connections.forEach((client) => {
    try {
      // Elysia provides a wrapper with `raw` (ServerWebSocket) or a direct socket. Try both.
      if (client && client.raw && typeof client.raw.send === 'function') {
        client.raw.send(messageStr);
      } else if (typeof client.send === 'function') {
        client.send(messageStr);
      }
    } catch (err) {
      console.warn('Failed to send WS message to a client', err);
    }
  });
};

const server = Bun.serve<{ username: string }>({
  port: 3001,
  fetch(req, server) {
    const url = new URL(req.url);
    const username = url.searchParams.get('name');
    const success = server.upgrade(req, { data: { username } });
    if (success) return;
    return new Response('Upgrade failed', { status: 500 });
  },
  websocket: {
    open(ws) {
      console.log('Websocket opened');
      ws.subscribe('chat');
      server.publish('chat', `Welcome ${ws.data.username}!`);
    },
    message(ws, message) {
      console.log(`Received ${message}`);
      server.publish('chat', `${ws.data.username}: ${message}`);
    },
    close(ws) {
      console.log('Websocket closed');
      const msg = `${ws.data.username} has left the chat`;
      server.publish('chat', msg);
      ws.unsubscribe('chat');
    },
  },
});

console.log(`Listening on ${server.hostname}:${server.port}`);

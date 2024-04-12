const server = Bun.serve({
  port: 3000,
  fetch(_req) {
    const file = Bun.file('./server/index.html');
    return new Response(file);
  },
});

console.log(`Client listening on ${server.hostname}:${server.port}`);

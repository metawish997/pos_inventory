let clients = [];

const addClient = (req, res) => {
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  });

  // Keep connection alive with simple comments every 20 seconds
  const keepAlive = setInterval(() => {
    res.write(': keepalive\n\n');
  }, 20000);

  const clientId = Date.now();
  const newClient = { id: clientId, res };
  clients.push(newClient);

  req.on('close', () => {
    clearInterval(keepAlive);
    clients = clients.filter(c => c.id !== clientId);
  });
};

const broadcast = (data) => {
  clients.forEach(c => {
    try {
      c.res.write(`data: ${JSON.stringify(data)}\n\n`);
    } catch (err) {
      console.error('Error writing to client:', err);
    }
  });
};

module.exports = { addClient, broadcast };

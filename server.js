const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3051;

// Serve static files from the project root
app.use(express.static(path.join(__dirname)));

// Fallback to index.html for SPA behavior
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Agein rodando na porta ${PORT}`);
  console.log(`Acesse: http://localhost:${PORT}`);
});

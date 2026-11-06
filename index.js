import express from 'express';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import alunosRoutes from './routes/alunosRoutes.js';
import turmasRoutes from './routes/turmasRoutes.js';

const app = express();

app.use(express.json());
app.use('/api/alunos', alunosRoutes);
app.use('/api/turmas', turmasRoutes);

app.use((req, res) => {
  res.status(404).json({ erro: 'Rota não encontrada.' });
});

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ erro: 'O corpo da requisição contém JSON inválido.' });
  }

  return res.status(500).json({ erro: 'Erro interno do servidor.' });
});

const port = process.env.PORT || 3000;

if (process.argv[1] && fileURLToPath(import.meta.url) === resolve(process.argv[1])) {
  app.listen(port, () => {
    console.log(`API de gestão escolar disponível em http://localhost:${port}`);
  });
}

export default app;
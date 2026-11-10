import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import app from '../index.js';

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  await new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
});

async function requisitar(caminho, metodo = 'GET', body) {
  const resposta = await fetch(`${baseUrl}${caminho}`, {
    method: metodo,
    headers: body === undefined ? {} : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  const dados = await resposta.json();
  return { status: resposta.status, dados };
}

test('apresenta os formulários de cadastro na rota raiz', async () => {
  const resposta = await fetch(`${baseUrl}/`);
  assert.equal(resposta.status, 200);
  assert.match(resposta.headers.get('content-type'), /text\/html/);
  const pagina = await resposta.text();
  assert.match(pagina, /<form id="form-aluno">/);
  assert.match(pagina, /<form id="form-turma">/);
  assert.match(pagina, /\/api\/alunos/);
  assert.match(pagina, /\/api\/turmas/);
});

test('retorna 404 para rotas não registradas', async () => {
  const resposta = await requisitar('/rota-inexistente');
  assert.equal(resposta.status, 404);
  assert.deepEqual(resposta.dados, { erro: 'Rota não encontrada.' });
});

test('carrega dados iniciais e filtra recursos com parâmetros validados', async () => {
  const alunos = await requisitar('/api/alunos');
  const turmas = await requisitar('/api/turmas');
  assert.equal(alunos.status, 200);
  assert.equal(turmas.status, 200);
  assert.ok(alunos.dados.length >= 2);
  assert.ok(turmas.dados.length >= 2);
  assert.ok(alunos.dados.some((aluno) => aluno.turmaId === 1));

  const alunoFiltrado = await requisitar('/api/alunos?nome=ana&turmaId=1');
  assert.equal(alunoFiltrado.dados.length, 1);
  assert.equal(alunoFiltrado.dados[0].email, 'ana@example.com');

  const turmaFiltrada = await requisitar('/api/turmas?ano=2026&turno=MATUTINO');
  assert.equal(turmaFiltrada.dados.length, 1);
  assert.equal(turmaFiltrada.dados[0].nome, '8º Ano A');

  assert.equal((await requisitar('/api/alunos?turmaId=abc')).status, 400);
  assert.equal((await requisitar('/api/turmas?campo=valor')).status, 400);
});

test('disponibiliza as rotas solicitadas sem o prefixo /api e lista alunos por turma', async () => {
  const alunos = await requisitar('/alunos');
  const turmas = await requisitar('/turmas');
  assert.equal(alunos.status, 200);
  assert.equal(turmas.status, 200);
  assert.ok(alunos.dados.length >= 2);
  assert.ok(turmas.dados.length >= 2);

  const turmaId = turmas.dados[0].id;
  const alunosDaTurma = await requisitar(`/turmas/${turmaId}/alunos`);
  assert.equal(alunosDaTurma.status, 200);
  assert.ok(alunosDaTurma.dados.length > 0);
  assert.ok(alunosDaTurma.dados.every((aluno) => aluno.turmaId === turmaId));
  assert.equal((await requisitar('/turmas/9999/alunos')).status, 404);
  assert.equal((await requisitar('/turmas/invalido/alunos')).status, 400);
});

test('gerencia turmas e alunos e protege os vínculos entre eles', async () => {
  const turmaCriada = await requisitar('/turmas', 'POST', {
    nome: '7º Ano A',
    ano: 2026,
    turno: 'matutino',
  });
  assert.equal(turmaCriada.status, 201);
  assert.equal((await requisitar(`/turmas/${turmaCriada.dados.id}`)).dados.id, turmaCriada.dados.id);

  const alunoCriado = await requisitar('/alunos', 'POST', {
    nome: 'Ana Souza',
    email: 'ana@example.com',
    dataNascimento: '2010-05-12',
    turmaId: turmaCriada.dados.id,
  });
  assert.equal(alunoCriado.status, 201);
  assert.equal(alunoCriado.dados.turmaId, turmaCriada.dados.id);
  assert.equal((await requisitar(`/alunos/${alunoCriado.dados.id}`)).dados.id, alunoCriado.dados.id);

  assert.equal((await requisitar(`/turmas/${turmaCriada.dados.id}`, 'DELETE')).status, 400);
  assert.equal((await requisitar(`/alunos/${alunoCriado.dados.id}`, 'PUT', {
    nome: 'Ana Souza',
    email: 'ana-nova@example.com',
    dataNascimento: '2010-05-12',
    turmaId: turmaCriada.dados.id,
  })).dados.email, 'ana-nova@example.com');
  assert.equal((await requisitar(`/alunos/${alunoCriado.dados.id}`, 'PATCH', { nome: 'Ana Silva' })).dados.nome, 'Ana Silva');
  const alunoExcluido = await requisitar(`/alunos/${alunoCriado.dados.id}`, 'DELETE');
  assert.equal(alunoExcluido.status, 200);
  assert.equal(alunoExcluido.dados.mensagem, 'Aluno excluído com sucesso.');
  assert.equal((await requisitar(`/turmas/${turmaCriada.dados.id}`, 'PUT', {
    nome: '8º Ano A',
    ano: 2027,
    turno: 'vespertino',
  })).dados.nome, '8º Ano A');
  assert.equal((await requisitar(`/turmas/${turmaCriada.dados.id}`, 'PATCH', { turno: 'noturno' })).dados.turno, 'noturno');
  const turmaExcluida = await requisitar(`/turmas/${turmaCriada.dados.id}`, 'DELETE');
  assert.equal(turmaExcluida.status, 200);
  assert.equal(turmaExcluida.dados.mensagem, 'Turma excluída com sucesso.');
  assert.equal((await requisitar('/alunos', 'POST', {
    nome: 'João',
    email: 'joao@example.com',
    turmaId: 99,
  })).status, 400);
});

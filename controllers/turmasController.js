import alunoModel from '../models/alunoModel.js';
import turmaModel from '../models/turmaModel.js';
import { filtrarRegistros, validarFiltros } from '../helpers/filtros.js';

function obterId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validarDados(body, atual = {}, parcial = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { erro: 'Envie um objeto JSON com os dados da turma.' };
  }

  const dados = parcial ? { ...atual, ...body } : body;
  const campos = ['nome', 'ano', 'turno'];
  const desconhecidos = Object.keys(body).filter((campo) => !campos.includes(campo));

  if (desconhecidos.length) {
    return { erro: `Campo(s) não permitido(s): ${desconhecidos.join(', ')}.` };
  }
  if (parcial && Object.keys(body).length === 0) {
    return { erro: 'Informe ao menos um campo para atualizar.' };
  }
  if (typeof dados.nome !== 'string' || !dados.nome.trim()) {
    return { erro: 'O campo "nome" é obrigatório e deve ser um texto.' };
  }

  const ano = Number(dados.ano);
  if (!Number.isInteger(ano) || ano < 2000 || ano > 2100) {
    return { erro: 'O campo "ano" deve ser um inteiro entre 2000 e 2100.' };
  }

  const turnos = ['matutino', 'vespertino', 'noturno'];
  if (typeof dados.turno !== 'string' || !turnos.includes(dados.turno.toLowerCase())) {
    return { erro: 'O campo "turno" deve ser matutino, vespertino ou noturno.' };
  }

  return { dados: { nome: dados.nome.trim(), ano, turno: dados.turno.toLowerCase() } };
}

function listar(req, res) {
  const validacao = validarFiltros(req.query, {
    nome: { tipo: 'texto' },
    ano: { tipo: 'inteiro', min: 2000, max: 2100 },
    turno: { tipo: 'texto' },
  });
  if (validacao.erro) {
    return res.status(400).json({ erro: validacao.erro });
  }

  const filtros = { ...validacao.filtros };
  if (filtros.turno !== undefined) {
    filtros.turno = filtros.turno.toLowerCase();
  }
  return res.json(filtrarRegistros(turmaModel.listar(), filtros));
}

function buscarPorId(req, res) {
  const id = obterId(req.params.id);
  if (!id) {
    return res.status(400).json({ erro: 'O identificador da turma deve ser um inteiro positivo.' });
  }

  const turma = turmaModel.buscarPorId(id);
  if (!turma) {
    return res.status(404).json({ erro: 'Turma não encontrada.' });
  }
  return res.json(turma);
}

function criar(req, res) {
  const validacao = validarDados(req.body);
  if (validacao.erro) {
    return res.status(400).json({ erro: validacao.erro });
  }
  const turma = turmaModel.criar(validacao.dados);
  console.info(`[CADASTRO] Turma: ${JSON.stringify(turma)}`);
  return res.status(201).json(turma);
}

function atualizar(req, res) {
  const id = obterId(req.params.id);
  if (!id) {
    return res.status(400).json({ erro: 'O identificador da turma deve ser um inteiro positivo.' });
  }

  const atual = turmaModel.buscarPorId(id);
  if (!atual) {
    return res.status(404).json({ erro: 'Turma não encontrada.' });
  }

  const parcial = req.method === 'PATCH';
  const validacao = validarDados(req.body, atual, parcial);
  if (validacao.erro) {
    return res.status(400).json({ erro: validacao.erro });
  }
  return res.json(turmaModel.atualizar(id, validacao.dados));
}

function excluir(req, res) {
  const id = obterId(req.params.id);
  if (!id) {
    return res.status(400).json({ erro: 'O identificador da turma deve ser um inteiro positivo.' });
  }
  if (!turmaModel.buscarPorId(id)) {
    return res.status(404).json({ erro: 'Turma não encontrada.' });
  }
  if (alunoModel.existeNaTurma(id)) {
    return res.status(409).json({ erro: 'Não é possível excluir uma turma que possui alunos vinculados.' });
  }
  turmaModel.excluir(id);
  return res.status(204).end();
}

export default { listar, buscarPorId, criar, atualizar, excluir };

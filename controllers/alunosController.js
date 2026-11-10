import alunoModel from '../models/alunoModel.js';
import turmaModel from '../models/turmaModel.js';
import { filtrarRegistros, validarFiltros } from '../helpers/filtros.js';

function obterId(valor) {
  const id = Number(valor);
  return Number.isInteger(id) && id > 0 ? id : null;
}

function validarDados(body, atual = {}, parcial = false) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return { erro: 'Envie um objeto JSON com os dados do aluno.' };
  }

  const dados = parcial ? { ...atual, ...body } : body;
  const campos = ['nome', 'email', 'dataNascimento', 'turmaId'];
  const desconhecidos = Object.keys(body).filter((campo) => !campos.includes(campo));

  if (desconhecidos.length) {
    return { erro: `Campo(s) não permitido(s): ${desconhecidos.join(', ')}.` };
  }

  if (parcial && Object.keys(body).length === 0) {
    return { erro: 'Informe ao menos um campo para atualizar.' };
  }

  for (const campo of ['nome', 'email']) {
    if (typeof dados[campo] !== 'string' || !dados[campo].trim()) {
      return { erro: `O campo "${campo}" é obrigatório e deve ser um texto.` };
    }
    dados[campo] = dados[campo].trim();
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(dados.email)) {
    return { erro: 'Informe um endereço de e-mail válido.' };
  }

  if (dados.dataNascimento !== undefined && dados.dataNascimento !== null && dados.dataNascimento !== '') {
    if (
      typeof dados.dataNascimento !== 'string'
      || !/^\d{4}-\d{2}-\d{2}$/.test(dados.dataNascimento)
      || Number.isNaN(Date.parse(`${dados.dataNascimento}T00:00:00`))
      || new Date(`${dados.dataNascimento}T00:00:00`).toISOString().slice(0, 10) !== dados.dataNascimento
    ) {
      return { erro: 'O campo "dataNascimento" deve usar o formato AAAA-MM-DD.' };
    }
  } else {
    dados.dataNascimento = null;
  }

  if (dados.turmaId !== undefined && dados.turmaId !== null && dados.turmaId !== '') {
    const turmaId = Number(dados.turmaId);
    if (!Number.isInteger(turmaId) || turmaId < 1) {
      return { erro: 'O campo "turmaId" deve ser um identificador válido ou null.' };
    }
    if (!turmaModel.buscarPorId(turmaId)) {
      return { erro: 'A turma informada não existe.' };
    }
    dados.turmaId = turmaId;
  } else {
    dados.turmaId = null;
  }

  return { dados: { nome: dados.nome, email: dados.email, dataNascimento: dados.dataNascimento, turmaId: dados.turmaId } };
}

function listar(req, res) {
  const validacao = validarFiltros(req.query, {
    nome: { tipo: 'texto' },
    email: { tipo: 'texto' },
    turmaId: { tipo: 'inteiro', min: 1 },
  });
  if (validacao.erro) {
    return res.status(400).json({ erro: validacao.erro });
  }
  return res.json(filtrarRegistros(alunoModel.listar(), validacao.filtros));
}

function buscarPorId(req, res) {
  const id = obterId(req.params.id);
  if (!id) {
    return res.status(400).json({ erro: 'O identificador do aluno deve ser um inteiro positivo.' });
  }

  const aluno = alunoModel.buscarPorId(id);
  if (!aluno) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' });
  }
  return res.json(aluno);
}

function criar(req, res) {
  const validacao = validarDados(req.body);
  if (validacao.erro) {
    return res.status(400).json({ erro: validacao.erro });
  }
  const aluno = alunoModel.criar(validacao.dados);
  console.info(`[CADASTRO] Aluno: ${JSON.stringify(aluno)}`);
  return res.status(201).json(aluno);
}

function atualizar(req, res) {
  const id = obterId(req.params.id);
  if (!id) {
    return res.status(400).json({ erro: 'O identificador do aluno deve ser um inteiro positivo.' });
  }

  const atual = alunoModel.buscarPorId(id);
  if (!atual) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' });
  }

  const parcial = req.method === 'PATCH';
  const validacao = validarDados(req.body, atual, parcial);
  if (validacao.erro) {
    return res.status(400).json({ erro: validacao.erro });
  }
  return res.json(alunoModel.atualizar(id, validacao.dados));
}

function excluir(req, res) {
  const id = obterId(req.params.id);
  if (!id) {
    return res.status(400).json({ erro: 'O identificador do aluno deve ser um inteiro positivo.' });
  }
  if (!alunoModel.excluir(id)) {
    return res.status(404).json({ erro: 'Aluno não encontrado.' });
  }
  return res.status(200).json({ mensagem: 'Aluno excluído com sucesso.' });
}

export default { listar, buscarPorId, criar, atualizar, excluir };

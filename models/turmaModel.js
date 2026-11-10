const dadosIniciais = [
  { id: 1, nome: '8º Ano A', ano: 2026, turno: 'matutino' },
  { id: 2, nome: '9º Ano B', ano: 2026, turno: 'vespertino' },
];
const turmas = new Map(dadosIniciais.map((turma) => [turma.id, { ...turma }]));
let proximoId = Math.max(...turmas.keys()) + 1;

function listar() {
  return [...turmas.values()];
}

function buscarPorId(id) {
  return turmas.get(id) ?? null;
}

function criar(dados) {
  const turma = { id: proximoId++, ...dados };
  turmas.set(turma.id, turma);
  return turma;
}

function atualizar(id, dados) {
  if (!turmas.has(id)) {
    return null;
  }

  const turma = { id, ...dados };
  turmas.set(id, turma);
  return turma;
}

function excluir(id) {
  return turmas.delete(id);
}

export default { listar, buscarPorId, criar, atualizar, excluir };

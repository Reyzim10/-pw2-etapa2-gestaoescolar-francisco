const alunos = new Map();
let proximoId = 1;

function listar() {
  return [...alunos.values()];
}

function buscarPorId(id) {
  return alunos.get(id) ?? null;
}

function criar(dados) {
  const aluno = { id: proximoId++, ...dados };
  alunos.set(aluno.id, aluno);
  return aluno;
}

function atualizar(id, dados) {
  if (!alunos.has(id)) {
    return null;
  }

  const aluno = { id, ...dados };
  alunos.set(id, aluno);
  return aluno;
}

function excluir(id) {
  return alunos.delete(id);
}

function existeNaTurma(turmaId) {
  return [...alunos.values()].some((aluno) => aluno.turmaId === turmaId);
}

export default { listar, buscarPorId, criar, atualizar, excluir, existeNaTurma };

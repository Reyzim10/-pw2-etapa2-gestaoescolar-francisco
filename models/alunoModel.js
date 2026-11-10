const dadosIniciais = [
  { id: 1, nome: 'Ana Souza', email: 'ana@example.com', dataNascimento: '2010-05-12', turmaId: 1 },
  { id: 2, nome: 'Bruno Lima', email: 'bruno@example.com', dataNascimento: '2011-09-23', turmaId: 2 },
];
const alunos = new Map(dadosIniciais.map((aluno) => [aluno.id, { ...aluno }]));
let proximoId = Math.max(...alunos.keys()) + 1;

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

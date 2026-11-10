# Gestão escolar

API REST de gestão escolar organizada em MVC com Express. Os dados ficam em memória, incluindo registros iniciais para testes, e são reiniciados quando o servidor é encerrado.

## Executar

```bash
npm install
npm start
```

O `npm install` instala as dependências listadas em `package.json` e `package-lock.json`.
O servidor inicia em `http://localhost:3000`. Para escolher outra porta, defina a variável de ambiente `PORT`.

Ao abrir `http://localhost:3000`, você pode cadastrar alunos e turmas. Para acessar a API diretamente, use `/api/alunos` e `/api/turmas`.
Cada cadastro bem-sucedido aparece como uma linha no terminal onde `npm start` está rodando, com o tipo de recurso, o ID e os dados cadastrados.

## Recursos

Todas as respostas usam JSON, exceto exclusões bem-sucedidas, que retornam `204 No Content`.

### Alunos

Base: `/api/alunos`

| Método | Caminho | Ação |
|---|---|---|
| GET | `/api/alunos` | Lista os alunos |
| GET | `/api/alunos/:id` | Consulta um aluno |
| POST | `/api/alunos` | Cadastra um aluno |
| PUT | `/api/alunos/:id` | Substitui os dados de um aluno |
| PATCH | `/api/alunos/:id` | Atualiza parcialmente um aluno |
| DELETE | `/api/alunos/:id` | Exclui um aluno |

Filtros opcionais combináveis para a listagem: `nome` e `email` (busca parcial, sem diferenciar maiúsculas de minúsculas) e `turmaId` (correspondência exata). Exemplo: `/api/alunos?nome=ana&turmaId=1`.

Exemplo de cadastro:

```json
{
  "nome": "Ana Souza",
  "email": "ana@example.com",
  "dataNascimento": "2010-05-12",
  "turmaId": 1
}
```

`dataNascimento` e `turmaId` são opcionais; use `null` em `turmaId` para deixar o aluno sem turma.

### Turmas

Base: `/api/turmas`

| Método | Caminho | Ação |
|---|---|---|
| GET | `/api/turmas` | Lista as turmas |
| GET | `/api/turmas/:id` | Consulta uma turma |
| POST | `/api/turmas` | Cadastra uma turma |
| PUT | `/api/turmas/:id` | Substitui os dados de uma turma |
| PATCH | `/api/turmas/:id` | Atualiza parcialmente uma turma |
| DELETE | `/api/turmas/:id` | Exclui uma turma sem alunos vinculados |

Filtros opcionais combináveis para a listagem: `nome` (busca parcial, sem diferenciar maiúsculas de minúsculas), `ano` (correspondência exata) e `turno` (correspondência sem diferenciar maiúsculas de minúsculas). Exemplo: `/api/turmas?ano=2026&turno=matutino`.

Exemplo de cadastro:

```json
{
  "nome": "7º Ano A",
  "ano": 2026,
  "turno": "matutino"
}
```

Os turnos aceitos são `matutino`, `vespertino` e `noturno`. Uma turma com alunos vinculados não pode ser excluída.

## Organização, dados iniciais e validação

- `routes/`: registra as rotas HTTP de cada recurso.
- `controllers/`: valida entradas e monta as respostas da API.
- `models/`: mantém os dados em memória e implementa as operações de cada recurso.
- `helpers/`: contém a validação e aplicação reutilizável dos filtros de listagem.
- `tests/api.test.js`: testa a página inicial, os dados e filtros, os fluxos de CRUD e as regras de relacionamento.

Ao iniciar, a API inclui duas turmas e dois alunos já associados a essas turmas. As alterações são temporárias e voltam aos dados iniciais ao reiniciar o processo. Filtros desconhecidos ou com valores inválidos retornam `400 Bad Request`; recursos inexistentes retornam `404`, e a exclusão de turma com alunos associados retorna `409 Conflict`. Para executar os testes, use `npm test`.

# Gestão escolar

API REST de gestão escolar organizada em MVC com Express. Os dados ficam em memória, incluindo registros iniciais para testes, e são reiniciados quando o servidor é encerrado.

## Executar

```bash
npm install
npm start
```

O `npm install` instala as dependências listadas em `package.json` e `package-lock.json`.
O servidor inicia em `http://localhost:3000`. Para escolher outra porta, defina a variável de ambiente `PORT`.

Ao abrir `http://localhost:3000`, você pode cadastrar alunos e turmas. As rotas estão disponíveis em `/alunos` e `/turmas`; os caminhos equivalentes com prefixo `/api` continuam ativos para compatibilidade.
Cada cadastro bem-sucedido aparece como uma linha no terminal onde `npm start` está rodando, com o tipo de recurso, o ID e os dados cadastrados.

## Recursos

As operações bem-sucedidas retornam `200 OK`, exceto cadastros, que retornam `201 Created`. Dados inválidos retornam `400 Bad Request` e recursos inexistentes retornam `404 Not Found`. Exclusões bem-sucedidas retornam `200 OK` com uma mensagem JSON. Uma turma com alunos vinculados não pode ser excluída e retorna `400`.

### Alunos

Base: `/alunos` (também disponível em `/api/alunos`)

| Método | Caminho | Ação |
|---|---|---|
| GET | `/alunos` | Lista alunos |
| GET | `/alunos/:id` | Busca aluno |
| POST | `/alunos` | Cadastra aluno |
| PUT | `/alunos/:id` | Atualiza aluno |
| DELETE | `/alunos/:id` | Exclui aluno |

Também há suporte a `PATCH /alunos/:id` para atualizações parciais. Filtros opcionais combináveis para a listagem: `nome` e `email` (busca parcial, sem diferenciar maiúsculas de minúsculas) e `turmaId` (correspondência exata). Exemplo: `/alunos?nome=ana&turmaId=1`.

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

Base: `/turmas` (também disponível em `/api/turmas`)

| Método | Caminho | Ação |
|---|---|---|
| GET | `/turmas` | Lista turmas |
| GET | `/turmas/:id` | Busca turma |
| POST | `/turmas` | Cadastra turma |
| PUT | `/turmas/:id` | Atualiza turma |
| DELETE | `/turmas/:id` | Exclui turma sem alunos vinculados |

`GET /turmas/:id/alunos` lista os alunos vinculados à turma. Retorna `404` se a turma não existir. Também há suporte a `PATCH /turmas/:id` para atualizações parciais. Filtros opcionais combináveis para a listagem: `nome` (busca parcial, sem diferenciar maiúsculas de minúsculas), `ano` (correspondência exata) e `turno` (correspondência sem diferenciar maiúsculas de minúsculas). Exemplo: `/turmas?ano=2026&turno=matutino`.

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

Ao iniciar, a API inclui duas turmas e dois alunos já associados a essas turmas. As alterações são temporárias e voltam aos dados iniciais ao reiniciar o processo. Filtros desconhecidos ou com valores inválidos retornam `400 Bad Request`; recursos inexistentes retornam `404`. Para executar os testes, use `npm test`.

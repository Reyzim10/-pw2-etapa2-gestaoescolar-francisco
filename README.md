# Gestão escolar

API REST de gestão escolar organizada em MVC com Express. Os dados ficam em memória e são reiniciados quando o servidor é encerrado.

## Executar

```bash
npm start
```

O servidor inicia em `http://localhost:3000`. Para escolher outra porta, defina a variável de ambiente `PORT`.

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

Exemplo de cadastro:

```json
{
  "nome": "7º Ano A",
  "ano": 2026,
  "turno": "matutino"
}
```

Os turnos aceitos são `matutino`, `vespertino` e `noturno`. Uma turma com alunos vinculados não pode ser excluída.

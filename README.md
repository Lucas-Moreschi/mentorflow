# MentorFlow

Plataforma de mentoria inteligente que conecta estudantes e mentores usando IA semântica.

## Stack

- **Next.js 15** (App Router) + **TypeScript**
- **PostgreSQL** com extensão **pgvector** (embeddings de IA)
- **Prisma ORM**
- **NextAuth.js v5** (autenticação com credentials + JWT)
- **Socket.io** (chat em tempo real via servidor customizado)
- **Google Gemini** (`gemini-embedding-001` para embeddings + `gemini-2.0-flash` para matching)
- **TailwindCSS** + **Shadcn/UI**
- **Zustand** (estado global)
- **Docker** (PostgreSQL com pgvector)

## Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- Chave de API do Google Gemini (gratuita em [aistudio.google.com](https://aistudio.google.com/app/apikey))

## Como rodar

### 1. Clone e instale dependências

```bash
git clone <repo>
cd MentorFlow
npm install
```

### 2. Configure variáveis de ambiente

```bash
cp .env.example .env
```

Edite o `.env` com suas configurações:

```env
# Banco de dados (Docker na porta 5433)
DATABASE_URL="postgresql://mentorflow:mentorflow_secret@localhost:5433/mentorflow"

# NextAuth (gere com: openssl rand -base64 32)
AUTH_SECRET="seu-secret-aqui"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini (necessário para matching por IA)
GEMINI_API_KEY="sua-chave-aqui"
```

> **Next.js runtime:** copie o mesmo `.env` para `.env.local` para que as variáveis fiquem disponíveis no servidor Next.js.

### 3. Suba o banco de dados

```bash
docker compose up -d
```

> **Nota:** O Docker usa a porta **5433** para evitar conflito com PostgreSQL local.

### 4. Execute as migrations

```bash
npm run db:migrate
```

### 5. Popule com dados de exemplo

```bash
npm run db:seed
```

> O seed gera embeddings via API do Gemini. Certifique-se de que `GEMINI_API_KEY` está configurada.

**Contas de teste** (senha: `password123`):

| Tipo | Email |
|------|-------|
| Estudante | `joao.dev@mentorflow.dev` |
| Estudante | `mariana.py@mentorflow.dev` |
| Estudante | `pedro.front@mentorflow.dev` |
| Mentor | `ana.silva@mentorflow.dev` |
| Mentor | `carlos.mendes@mentorflow.dev` |
| Mentor | `patricia.rocha@mentorflow.dev` |
| Mentor | `roberto.lima@mentorflow.dev` |
| Mentor | `fernanda.costa@mentorflow.dev` |

### 6. Inicie o servidor

```bash
npm run dev
```

Acesse em: [http://localhost:3000](http://localhost:3000)

> O servidor customizado (`server.js`) integra Socket.io ao Next.js na mesma porta.

---

## Scripts disponíveis

```bash
npm run dev        # Inicia em modo desenvolvimento
npm run build      # Build para produção
npm start          # Inicia em modo produção (após build)
npm run db:migrate # Executa migrations do Prisma
npm run db:seed    # Popula o banco com dados de exemplo
npm run db:studio  # Abre o Prisma Studio (GUI do banco)
```

---

## Arquitetura

### Matching por IA

O sistema de matching funciona em 3 etapas:

1. **Embedding de perfil**: Ao salvar o perfil, um texto descritivo é construído (objetivos, habilidades, interesses) e enviado à API do Google Gemini (`gemini-embedding-001`) para gerar um vetor de **3072 dimensões**, salvo no PostgreSQL via `pgvector`.

2. **Busca por similaridade**: A query usa o operador `<=>` (distância cosseno) do pgvector para encontrar os mentores mais próximos semanticamente do perfil do estudante.

3. **Explicação por LLM**: Para os top matches, o `gemini-2.0-flash` gera uma explicação personalizada em português explicando por que o mentor é um bom match.

### Chat em Tempo Real

O `server.js` cria um servidor HTTP customizado que:
- Passa todas as requisições HTTP ao handler do Next.js
- Anexa o Socket.io ao mesmo servidor
- Persiste mensagens diretamente no PostgreSQL

### Estrutura de pastas

```
src/
├── app/              # Next.js App Router
│   ├── (auth)/       # Login, Registro
│   ├── app/          # Área autenticada (dashboard, chat, perfil...)
│   └── api/          # API Routes
├── components/       # Componentes React
│   ├── ui/           # Shadcn/UI
│   ├── chat/         # Chat em tempo real
│   ├── mentors/      # Browse de mentores
│   └── ...
├── lib/              # Utilitários (auth, prisma, gemini, matching)
├── hooks/            # React hooks (useSocket, useChat, useTyping)
├── stores/           # Zustand stores
├── schemas/          # Validação Zod
└── types/            # TypeScript types
```

---

## Produção

Para produção, atualize as variáveis de ambiente:

```env
DATABASE_URL="postgresql://user:pass@seu-servidor/mentorflow"
AUTH_SECRET="secret-de-producao-seguro"
NEXTAUTH_URL="https://seu-dominio.com"
GEMINI_API_KEY="sua-chave-aqui"
NODE_ENV="production"
```

E execute:

```bash
npm run build
npm start
```

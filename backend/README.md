## 📋 Pré-requisitos

- Node.js 24.7.0+
- Docker & Docker Compose
- PostgreSQL 17.5+ (ou via Docker)
- Redis 8.2.0+ (ou via Docker)

## 📁 Estrutura do Projeto

```
backend/
├── prisma/               # Configuração do Prisma
│   ├── schema.prisma     # Schema do banco de dados
│   ├── migrations/       # Migrações do banco
│   └── seed.ts           # Script para popular o banco
├── src/
│   ├── auth/             # Módulo de autenticação
│   ├── User/             # Módulo de usuários
│   ├── Classroom/        # Módulo de turmas
│   ├── LanguageMarathon/ # Módulo de maratonas
│   ├── Question/         # Módulo de questões
│   ├── Submission/       # Módulo de submissões
│   ├── AiFeedback/       # Módulo de feedback IA
│   ├── Mailer/           # Módulo de email
│   ├── Stats/            # Módulo de estatísticas
│   ├── repositories/     # Repositórios de dados
│   └── utils/            # Utilitários
├── test/                 # Testes e2e
├── docker-compose.yml    # Configuração Docker
└── README.md
```

## ⚙️ Instalação

1. Navegue até a pasta do backend:

```bash
cd backend
```

2. Instale as dependências:

```bash
npm install
```

## 🔧 Configuração

1. Crie um arquivo `.env` na raiz da pasta backend:

```bash
cp .env.example .env
```

2. Configure as variáveis de ambiente necessárias ou pode usar as do repositório:

````env
APP_NAME="Maratona de idiomas"

NODE_ENV="development"

FRONTEND_URL="http://localhost:8080"

# Database
DATABASE_URL="postgresql://user:password@localhost:5432/mydatabase?schema=public"

#Gemini - Sandbox key
GEMINI_API_KEY=""

#Auth module - Secret examples
JWT_SECRET=""
JWT_REFRESH_SECRET=""

# Email modulue (Configure com os dados seu fornecedor de emails, para sandbox, recomendo o Mailtrap)
MAIL_HOST="sandbox.smtp.mailtrap.io"
MAIL_PORT="2525"
MAIL_USER=""
MAIL_PASSWORD=""
DEFAULT_EMAIL_FROM="contato@maratonadeidiomas.com.br"
````
## 🐳 Executando o Docker (Redis, Postgres)

1. Execute todos os serviços:

```bash
docker-compose up -d
```

2. Execute as migrações do banco:

```bash
npx prisma migrate dev
```

3. (Opcional) Popule o banco com dados iniciais:

```bash
npx prisma db seed
```

4. (Opcional) Verificar o banco com dados:

```bash
npx prisma studio
```

## 🏃‍♂️ Executando Localmente

### 1. Inicie os serviços de infraestrutura:

```bash
# Apenas PostgreSQL e Redis
docker-compose up -d
```

### 2. Configure o banco de dados:

```bash
# Gerar cliente Prisma
npx prisma generate

# Executar migrações
npx prisma migrate dev

# (Opcional) Seed do banco
npx prisma db seed
```

### 3. Inicie a aplicação:

#### Modo Desenvolvimento (Mais rápido para ver o projeto)

```bash
npm run start:dev
```

#### Modo Produção

```bash
npm run build
npm run start:prod
```

#### Modo Debug

```bash
npm run start:debug
```

## 🎯 Funcionalidades da API

### Autenticação

- Registro e login de usuários
- Verificação de conta via email
- Reset de senha
- Autenticação JWT
- Middleware de autorização por role

### Gestão de Usuários

- CRUD de usuários (estudantes/professores)
- Perfis personalizados
- Sistema de roles e permissões

### Maratonas

- CRUD de maratonas
- Sistema de inscrições
- Controle de tempo e cronômetro
- Geração automática de questões via IA

### Avaliação e Feedback

- Correção automática via IA (Gemini)
- Sistema de rubricas detalhado
- Feedback personalizado
- Pontuação e ranking

### Relatórios

- Estatísticas de performance
- Analytics de maratonas

## 🌐 Endpoints Principais

### Autenticação

- `POST /login` - Login
- `POST /user` - Registro
- `POST /user/confirm-account` - Confirmar conta
- `POST /user/reset-password` - Reset senha
- `POST /refresh-user-token` - Refresh token

### Usuários

- `GET /user/me` - Perfil atual
- `PATCH /user` - Atualizar perfil
- `DELETE /user` - Deletar conta

### Maratonas

- `GET /classroom/:id/marathons` - Listar maratonas
- `POST /classroom/:id/marathons` - Criar maratona
- `GET /classroom/:classId/marathons/:marathonId` - Detalhes
- `PATCH /classroom/:classId/marathons/:marathonId` - Atualizar
- `DELETE /classroom/:classId/marathons/:marathonId` - Deletar

### Questões

- `GET /marathon/:id/questions` - Listar questões
- `POST /marathon/:id/questions` - Criar questão
- `PATCH /questions/:id` - Atualizar questão
- `DELETE /questions/:id` - Deletar questão

## 🐛 Troubleshooting

### Erro de Conexão com Banco
```bash
# Verificar se o PostgreSQL está rodando
docker-compose ps postgres

# Verificar logs
docker-compose logs postgres
```

### Problemas com Migrações

```bash
# Reset completo do banco
npx prisma migrate reset

# Regenerar cliente
npx prisma generate
```

### Erro de Dependências

```bash
rm -rf node_modules
npm install
```

### Problemas com Docker

```bash
# Limpar containers e volume de dados
docker-compose down -v

# Rebuild
docker-compose up --build -d
```

## 🔐 Segurança

- Validação de entrada com class-validator
- Sanitização de dados
- Rate limiting
- Helmet para headers de segurança
- CORS configurado
- Autenticação JWT
- Criptografia de senhas com bcrypt

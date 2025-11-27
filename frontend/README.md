# Frontend - Maratonas de Idiomas

Interface web desenvolvida em React com TypeScript para o sistema de maratonas de idiomas.

## 🚀 Tecnologias

- **React** 18.3.1 - Biblioteca para construção da interface
- **TypeScript** 5.8.3 - Tipagem estática para JavaScript
- **Vite** - Build tool e dev server
- **TailwindCSS** - Framework CSS utilitário
- **Shadcn/ui** - Componentes de UI
- **React Hook Form** - Gerenciamento de formulários
- **TanStack Query** - Gerenciamento de estado servidor
- **React Router** - Roteamento da aplicação
- **Lucide React** - Ícones

## 📋 Pré-requisitos

- Node.js 24.7.0+
- npm ou yarn ou bun

## ⚙️ Instalação

1. Navegue até a pasta do frontend:

```bash
cd frontend
```

2. Instale as dependências:

```bash
# Com npm
npm install

# Com yarn
yarn install

# Com bun
bun install
```

## 🔧 Configuração

1. Crie um arquivo `.env.local` na raiz da pasta frontend:

```bash
cp .env.example .env.local
```

2. Configure as variáveis de ambiente necessárias:

```env
VITE_API_URL=http://localhost:8080
VITE_APP_NAME="EduMarathon"
```

## 🏃‍♂️ Executando o Projeto

### Modo Desenvolvimento

```bash
# Com npm
npm run dev

# Com yarn
yarn dev

# Com bun
bun dev
```

A aplicação estará disponível em `http://localhost:8080`

### Build para Produção

```bash
# Com npm
npm run build

# Com yarn
yarn build

# Com bun
bun run build
```

### Preview da Build

```bash
# Com npm
npm run preview

# Com yarn
yarn preview

# Com bun
bun run preview
```

## 📁 Estrutura do Projeto

```
frontend/
├── public/              # Arquivos estáticos
├── src/
│   ├── components/      # Componentes reutilizáveis
│   │   └── ui/         # Componentes do shadcn/ui
│   ├── contexts/       # Context providers (Auth, etc.)
│   ├── hooks/          # Custom hooks
│   ├── lib/           # Configurações e utilitários
│   ├── pages/         # Páginas da aplicação
│   ├── schemas/       # Schemas de validação (Zod)
│   ├── services/      # Services para API
│   └── utils/         # Funções utilitárias
├── package.json
└── README.md
```

## 🎯 Funcionalidades

### Para Estudantes

- Dashboard
- Inscrição em maratonas
- Execução de maratonas
- Visualização de submissões e feedback
- Ranking e pontuação

### Para Professores

- Gerenciamento de turmas
- Criação e edição de maratonas
- Gerenciamento de questões
- Visualização de submissões e feedback
- Relatórios detalhados
- Ranking e pontuação

## 🔗 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run preview` - Preview da build de produção
- `npm run lint` - Executa o ESLint
- `npm run type-check` - Verifica tipos TypeScript

## 🌐 Rotas Principais

- `/` - Redirecionamento para dashboard
- `/login` - Página de login
- `/register` - Página de registro
- `/dashboard` - Dashboard principal
- `/marathons` - Lista de maratonas (professor)
- `/my-enrollments` - Maratonas do estudante
- `/profile` - Perfil do usuário

## 🎨 Temas e Estilização

O projeto utiliza TailwindCSS com sistema de design tokens customizável. Os componentes são baseados no shadcn/ui com tema personalizado.

## 🐛 Troubleshooting

### Problema com CORS

Certifique-se de que o backend esteja rodando e configure o env corretamente.

### Erro de Módulos

```bash
rm -rf node_modules
npm install
```

### Problemas de Cache

```bash
rm -rf .vite
npm run dev
```

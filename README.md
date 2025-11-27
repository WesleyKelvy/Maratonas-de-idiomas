# Maratonas-de-idiomas

## 👨‍💻 Autor

Este projeto faz parte do meu Trabalho de Conclusão de Curso (TCC) do curso de Sistemas de Informação.

## 📋 Sobre o Projeto

Para tanto, o objetivo geral deste projeto é criar um WebApp que promova aos professores uma ferramenta viável para implementar atividades escolares baseadas em gamificação alinhadas aos princípios da Educação 4.0. O modelo de implementação de metodologias ativas usado no projeto foi o de competição saudável entre alunos através de maratonas de idiomas.

### 🎯 Objetivos Específicos

- Identificar as reais necessidades dos professores através de pesquisas bibliográficas.
- Implementar métodos integrados à inteligência artificial para personalizar questões dentro das atividades que serão entregues aos alunos.
- Automatizar correções de forma mais eficiente através de rubricas.
- Gerar rankings que estimulem a competitividade e a busca do conhecimento efetivo por parte dos alunos.

## 🏗️ Arquitetura do Sistema

O sistema é composto por:

- **Frontend**: Interface web desenvolvida em React com TypeScript
- **Backend**: API REST desenvolvida em NestJS
- **Banco de Dados**: PostgreSQL para persistência dos dados
- **Cache/Queue**: Redis para processamento assíncrono
- **IA**: Integração com Gemini para correção automática e geração de questões

## 📁 Estrutura do Projeto

```
├── frontend/          # Aplicação React
├── backend/           # API NestJS
└── README.md          # Documentação do projeto
```

## 🔧 Como Executar o Projeto

### Pré-requisitos

- Node.js 24.7.0+
- Docker 28.3.3+
- Git 2.51.0+

### Instalação

1. Clone o repositório:
```bash
git clone https://github.com/WesleyKelvy/Maratonas-de-idiomas.git
cd Maratonas-de-idiomas
```

2. Acesse o README das pastas:
- Frontend
- Backend

## 📄 Licença

Este projeto é desenvolvido para fins acadêmicos.
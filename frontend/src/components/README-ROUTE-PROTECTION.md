# Sistema de Proteção de Rotas por Função

Este documento explica como funciona o sistema de proteção de rotas baseado no tipo de usuário implementado na aplicação.

## Componentes Criados

### 1. RoleBasedRoute

Componente principal que verifica se o usuário tem permissão para acessar uma rota baseado em seus roles.

```tsx
<RoleBasedRoute allowedRoles={["teacher", "admin"]}>
  <ComponenteProtegido />
</RoleBasedRoute>
```

### 2. Componentes Utilitários

Para facilitar o uso, foram criados componentes específicos:

- **TeacherRoute**: Permite acesso apenas a professores e admins
- **StudentRoute**: Permite acesso apenas a alunos
- **CommonRoute**: Permite acesso a professores, alunos e admins

```tsx
<TeacherRoute>
  <ComponenteSoProfessor />
</TeacherRoute>

<StudentRoute>
  <ComponenteSoAluno />
</StudentRoute>
```

## Tipos de Usuário

Os usuários podem ter os seguintes roles:

- `student`: Aluno
- `teacher`: Professor
- `admin`: Administrador (tem acesso a todas as rotas)

## Distribuição das Rotas

### Rotas de Acesso Comum (Professores e Alunos)

- `/dashboard` - Dashboard principal
- `/marathons/:id` - Detalhes de uma maratona específica
- `/submissions/:submissionId` - Detalhes de uma submissão
- `/ranking` - Ranking geral
- `/profile` - Perfil do usuário

### Rotas Exclusivas para Professores

- `/marathons` - Lista todas as maratonas
- `/classes` - Gerenciamento de turmas
- `/classes/:classId` - Detalhes de uma turma
- `/classes/:classId/marathons` - Maratonas de uma turma
- `/classes/:classId/create-marathon` - Criar nova maratona
- `/question-management/:marathonId` - Gerenciar questões
- `/marathon-submissions` - Submissões de maratonas
- `/teacher-submissions` - Submissões dos professores
- `/marathons/:marathonId/dashboard` - Dashboard de uma maratona
- `/marathons/:marathonId/report` - Relatório de uma maratona

### Rotas Exclusivas para Alunos

- `/marathons/:id/execute` - Executar uma maratona
- `/marathon-enrollment` - Inscrever-se em maratonas
- `/my-enrollments` - Minhas inscrições
- `/my-submissions` - Minhas submissões

## Comportamento

### Quando o usuário não tem permissão:

- O usuário é redirecionado para `/dashboard`
- Uma tela de loading é mostrada durante a verificação

### Durante o carregamento:

- Uma tela de loading com spinner é exibida
- O componente aguarda a verificação de autenticação

## Como Usar

1. **Para rotas que devem ser acessíveis apenas por professores:**

```tsx
<Route
  path="/rota-professor"
  element={
    <ProtectedRoute>
      <TeacherRoute>
        <Layout>
          <ComponenteProfessor />
        </Layout>
      </TeacherRoute>
    </ProtectedRoute>
  }
/>
```

2. **Para rotas que devem ser acessíveis apenas por alunos:**

```tsx
<Route
  path="/rota-aluno"
  element={
    <ProtectedRoute>
      <StudentRoute>
        <Layout>
          <ComponenteAluno />
        </Layout>
      </StudentRoute>
    </ProtectedRoute>
  }
/>
```

3. **Para rotas com roles específicos:**

```tsx
<Route
  path="/rota-customizada"
  element={
    <ProtectedRoute>
      <RoleBasedRoute allowedRoles={["teacher", "admin"]}>
        <Layout>
          <ComponenteCustomizado />
        </Layout>
      </RoleBasedRoute>
    </ProtectedRoute>
  }
/>
```

## Segurança

- A proteção é baseada no contexto de autenticação
- O role do usuário é obtido do `AuthContext`
- Usuários não autorizados são redirecionados automaticamente
- A verificação acontece no lado cliente (deve ser complementada com verificações no backend)

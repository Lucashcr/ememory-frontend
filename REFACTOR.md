# EMemory Frontend - Refactoring Checklist

## Arquitetura e Organização

### Contexts
- [x] Separar lógica de negócio dos contexts
  - Os contexts `AuthContext`, `ReviewsContext` e `SubjectsContext` contêm muita lógica de negócio. Mover essa lógica para hooks customizados ou services.

### Services
- [ ] Melhorar organização dos services
  - Criar namespaces ou subpastas para agrupar serviços relacionados (ex: `/services/auth`, `/services/reviews`, `/services/dates`)
- [ ] Padronizar retorno das funções de API
  - Criar um tipo padrão de resposta para todas as chamadas de API em `api.ts`

### Components
- [ ] Componentizar elementos reutilizáveis
  - Extrair botões comuns para um componente reutilizável
  - Criar componentes para inputs padronizados
- [ ] Melhorar organização dos modals
  - Mover lógica de estado dos modals para hooks customizados
  - Padronizar interface dos modals

### Hooks
- [ ] Expandir uso de hooks customizados
  - Criar hooks para lógicas compartilhadas entre componentes
  - Mover lógica de e- [ ] Expandir uso de hooks customizados
  - Criar hooks para lógicas compartilhadas entre componentes
  - Mover lógica de estado e efeitos complexos stado e efeitos complexos dos componentes para hooks

### Types
- [ ] Criar pasta de types
  - Centralizar definições de tipos em `/types`
  - Separar interfaces e types por domínio

### Testes
- [ ] Implementar estrutura de testes
  - Adicionar testes unitários para services
  - Adicionar testes para hooks customizados
  - Adicionar testes para componentes principais

### Estado Global
- [ ] Avaliar uso de uma solução de gerenciamento de estado
  - Considerar implementação de Zustand ou similar para casos mais complexos
  - Reduzir dependência de prop drilling

### Performance
- [ ] Otimizar renderização de componentes
  - Implementar memo para componentes que recebem props estáticas
  - Revisar e otimizar useEffects desnecessários

### Segurança
- [ ] Melhorar manipulação de dados sensíveis
  - Implementar criptografia para dados sensíveis no storage
  - Remover dados sensíveis de logs

### Código
- [ ] Padronizar tratamento de erros
  - Criar sistema centralizado de tratamento de erros
  - Implementar logging consistente
- [ ] Melhorar tipagem
  - Remover uso de `any`
  - Adicionar tipos explícitos para props de componentes

# Como Rodar os Testes

## Instalar Dependências
```bash
npm install
```

## Testes Unitários e de Integração

### Rodar todos os testes
```bash
npm test
```

### Rodar em modo watch
```bash
npm run test:watch
```

### Gerar relatório de cobertura
```bash
npm run test:coverage
```

### Ver relatório HTML (após gerar cobertura)
```bash
# Windows
start coverage/lcov-report/index.html

# Mac/Linux
open coverage/lcov-report/index.html
```

## Comandos Úteis

### Limpar cache dos testes
```bash
npm test -- --clearCache
```

### Modo debug (verbose)
```bash
npm test -- --verbose
```

### Rodar apenas um arquivo de teste
```bash
npm test -- src/hooks/__tests__/useCart.test.ts
```

### Rodar testes de um componente específico
```bash
npm test -- app/login/__tests__/FormularioLogin.integration.test.tsx
```

## Estrutura de Testes

```
49/
├── app/
│   ├── login/__tests__/
│   │   └── FormularioLogin.integration.test.tsx  # 14 testes de integração
│   ├── cart/__tests__/
│   │   └── ItemCarrinho.test.ts                  # 29 testes unitários
│   └── farmacia/dashboard/__tests__/
│       └── ItemEstoque.test.ts                   # 20 testes unitários
├── src/
│   ├── utils/__tests__/
│   │   ├── validacao.test.ts                     # 20 testes
│   │   └── formatacao.test.ts                    # 23 testes
│   ├── hooks/__tests__/
│   │   └── useCart.test.ts                       # 9 testes
│   └── servicos/__tests__/
│       └── auth.test.ts                          # 31 testes
```

## Tipos de Testes

### 1. Testes Unitários
Testam funções e lógica isoladamente:
- Utilitários (validação, formatação)
- Hooks customizados
- Serviços e classes de domínio

### 2. Testes de Integração
Testam componentes com interações do usuário:
- Formulários completos
- Fluxos de navegação
- Interações com state

**Exemplo de teste de integração:**
```typescript
it('deve simular fluxo completo de login', async () => {
  const { getByTestId } = render(<FormularioLogin {...mockProps} />);

  // Digita email
  const emailInput = getByTestId('input-email');
  fireEvent.changeText(emailInput, 'usuario@teste.com');

  // Digita senha
  const senhaInput = getByTestId('input-senha');
  fireEvent.changeText(senhaInput, 'senha123');

  // Clica em entrar
  const botaoEntrar = getByTestId('botao-entrar');
  fireEvent.press(botaoEntrar);

  // Verifica comportamento
  expect(mockProps.aoEnviar).toHaveBeenCalled();
});
```

## Cobertura de Testes

Atualmente com **159 testes** e **82.15% de cobertura**:

| Arquivo | Statements | Branches | Functions | Lines |
|---------|-----------|----------|-----------|-------|
| **Total** | 82.15% | 78.45% | 85.20% | 81.90% |

### Por Módulo:
- ✅ Validação: 100%
- ✅ Formatação: 100%
- ✅ Auth Service: 95%
- ✅ Hooks: 90%
- ✅ Componentes: 85%

## Ferramentas Utilizadas

- **Jest** - Framework de testes
- **React Native Testing Library** - Renderização e interação com componentes
- **@testing-library/jest-native** - Matchers customizados para React Native

## Dicas

1. **Sempre rode os testes antes de fazer commit**
   ```bash
   npm test
   ```

2. **Use `test:watch` durante desenvolvimento**
   ```bash
   npm run test:watch
   ```

3. **Verifique a cobertura regularmente**
   ```bash
   npm run test:coverage
   ```

4. **Mantenha cobertura acima de 80%**

## Troubleshooting

### Erro: "Cannot find module"
```bash
npm install
npm test -- --clearCache
```

### Testes lentos
```bash
# Rode apenas os testes que você está desenvolvendo
npm test -- --testNamePattern="nome do teste"
```

### Erro de memória (heap)
```bash
# Aumente o limite de memória do Node
export NODE_OPTIONS="--max_old_space_size=4096"
npm test
```

## CI/CD

Os testes rodam automaticamente no GitHub Actions em cada push/PR.

**Pipeline:**
1. Install dependencies
2. Run linter
3. Run tests
4. Generate coverage report
5. Upload coverage to Codecov

---

**Precisa de ajuda?** Consulte a documentação do [Jest](https://jestjs.io/) e [React Native Testing Library](https://callstack.github.io/react-native-testing-library/).

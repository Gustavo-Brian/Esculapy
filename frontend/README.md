# 🏥 Esculapi - App de Farmácia

Um aplicativo de farmácia desenvolvido com **React Native** e **Expo**, oferecendo uma experiência completa de compras de medicamentos e produtos farmacêuticos.

## 📱 Funcionalidades

### Para Clientes
- 🏠 **Home**: Catálogo de produtos, ofertas e farmácias próximas
- 🔍 **Busca**: Sistema de busca integrado com filtros
- 🛒 **Carrinho**: Gerenciamento de produtos e checkout
- ⚖️ **Comparar**: Comparação de preços entre farmácias
- ❤️ **Favoritos**: Produtos e farmácias favoritas
- 👤 **Conta**: Gerenciamento de perfil e endereços
- 📞 **Suporte**: Chat e central de atendimento
- ❓ **Ajuda**: FAQ interativo com dropdown

### Para Farmácias
- 🔑 **Login**: Autenticação com JWT
- 📝 **Registro**: Cadastro completo com CNPJ e CRF-J
- 💊 **Dashboard**: Gerenciamento de estoque e vendas
- 📊 **Estatísticas**: Gráficos de produtos esgotados e alertas
- ➕ **Adicionar Produtos**: Sistema em 2 etapas (buscar ou cadastrar)
- ✏️ **Editar/Excluir**: CRUD completo de produtos

### Recursos Técnicos
- 🔐 **Autenticação**: Login com Spring Security + JWT
- 🛡️ **Proteção de Rotas**: ProtectedRoute e ProtectedFarmaciaRoute
- 🌐 **API Integration**: Axios com interceptors automáticos
- 💾 **Storage**: AsyncStorage para tokens e dados do usuário
- 🎨 **Sistema de Design**: temaMedico unificado
- 📱 **Responsivo**: SafeAreaView para notch/dynamic island

## 🛠️ Tecnologias Utilizadas

### Frontend
- **React Native** 0.81.4
- **Expo SDK** 54
- **Expo Router** 6.0.7 (navegação file-based)
- **TypeScript** 5.9.2
- **Axios** 1.13.2 (requisições HTTP)
- **AsyncStorage** 2.2.0 (armazenamento local)
- **Expo Vector Icons** (Ionicons)
- **React Native Reanimated** 4.1.0

### Backend
- **Spring Boot** (Java)
- **Spring Security** + JWT
- **PostgreSQL** (banco de dados)

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 18 ou superior) - [Download aqui](https://nodejs.org/)
- **npm** ou **yarn** (gerenciador de pacotes)
- **Expo CLI** (opcional, mas recomendado)

## 🚀 Como rodar o projeto

### 1. Clone o repositório
```bash
git clone <url-do-repositorio> ###nao subi o front no git ainda
cd prototype/esculapi
```

### 2. Instale as dependências
```bash
npm install
```
*ou*
```bash
yarn install
```

### 3. Inicie o servidor de desenvolvimento
```bash
npm start
```
*ou*
```bash
npx expo start
```

### 4. Escolha onde executar o app

Após executar `npm start`, você verá opções no terminal:

#### 🌐 **Para Web (mais fácil)**
- Digite `w` no terminal
- Ou abra `http://localhost:8081` no navegador

#### 📱 **Para Mobile (Android/iOS)**
1. Instale o app **Expo Go** no seu celular:
   - [Android - Play Store](https://play.google.com/store/apps/details?id=host.exp.exponent)
   - [iOS - App Store](https://apps.apple.com/app/expo-go/id982107779)

2. Escaneie o QR Code que aparece no terminal com o app Expo Go

#### 🤖 **Para Android Studio (Emulador)**
- Digite `a` no terminal (requer Android Studio instalado)

#### 🍎 **Para iOS Simulator (Emulador)**
- Digite `i` no terminal (requer Xcode instalado - apenas no Mac)

## 📁 Estrutura do Projeto

```
esculapi/
├── app/                           # 📱 Páginas do aplicativo (Expo Router)
│   ├── (tabs)/                   # Navegação em tabs
│   ├── home/                     # 🏠 Tela principal
│   │   ├── tipos/                # Classes de domínio
│   │   ├── servicos/             # Lógica de negócio
│   │   ├── hooks/                # Hooks React
│   │   ├── componentes/          # Componentes visuais
│   │   └── index.tsx             # Orquestração
│   ├── login/                    # 🔑 Autenticação
│   ├── signup/                   # ✍️ Cadastro
│   ├── cart/                     # 🛒 Carrinho
│   ├── product/                  # 📦 Detalhes do produto
│   ├── farmacia/                 # 💊 Dashboard da farmácia
│   └── ...                       # Outras 13 páginas
│
├── src/                          # 🔧 Código compartilhado
│   ├── componentes/              # Componentes reutilizáveis
│   ├── estilos/                  # Sistema de design
│   │   ├── temaMedico.ts         # Tema principal (cores, fontes)
│   │   ├── pages/                # Estilos por página
│   │   └── components/           # Estilos de componentes
│   ├── hooks/                    # useAuth, useRole
│   ├── servicos/                 # API, autenticação, storage
│   ├── tipos/                    # Tipos TypeScript
│   └── constantes/               # Constantes globais
│
├── docs/                         # 📚 Documentação completa
│   ├── arquitetura/              # Guias de arquitetura OOP
│   ├── backend/                  # Orientações de backend
│   ├── implementacao/            # Documentos de implementação
│   ├── melhorias/                # Melhorias aplicadas
│   └── refatoracao/              # Refatorações realizadas
│
├── assets/                       # Imagens, fontes, ícones
├── app.json                      # Configurações do Expo
├── package.json                  # Dependências do projeto
└── tsconfig.json                 # Configurações TypeScript
```

### 🏗️ Arquitetura OOP em 4 Camadas

Cada página segue o padrão:
```
VIEW (index.tsx)
  → HOOK (useDados*.ts)
    → SERVIÇO (Servico*.ts)
      → DOMÍNIO (Classes em tipos/)
```

**Status:** 18/19 páginas com OOP completo (95%)

## 🎯 Fluxos Desenvolvidos

### 🛒 Fluxo do Cliente (Compra de Medicamentos)

1. **Tela Inicial (Home)**
   - Visualização de produtos em destaque
   - Barra de busca com filtros (Medicamentos/Correlatos)
   - Carrossel de pesquisas rápidas (Dipirona, Vitaminas, etc.)
   - Melhores ofertas destacadas
   - Lista de farmácias parceiras

2. **Busca e Filtros**
   - Busca por nome, laboratório, princípio ativo
   - Filtros por categoria (Todos, Medicamentos, Correlatos)
   - Resultados em tempo real
   - Contador de produtos encontrados

3. **Detalhes do Produto**
   - Informações completas (nome, laboratório, descrição)
   - Comparação de preços entre farmácias
   - Adicionar ao carrinho
   - Ver ofertas disponíveis

4. **Carrinho de Compras**
   - Visualizar produtos adicionados
   - Ajustar quantidades
   - Remover produtos
   - Ver total da compra
   - Finalizar pedido

5. **Perfil e Conta**
   - Gerenciar dados pessoais
   - Endereços de entrega
   - Histórico de pedidos
   - Favoritos

### 💊 Fluxo da Farmácia (Gestão de Produtos)

1. **Autenticação**
   - Login com CNPJ e senha
   - Validação de JWT
   - Proteção de rotas com `ProtectedFarmaciaRoute`

2. **Cadastro de Farmácia**
   - Dados básicos (CNPJ, Razão Social, Nome Fantasia)
   - CRF-J (Conselho Regional de Farmácia)
   - Endereço completo
   - Informações de contato

3. **Dashboard**
   - Visão geral do estoque
   - Estatísticas de vendas
   - Produtos esgotados (alertas)
   - Gráficos de desempenho

4. **Gerenciamento de Produtos**
   - **Adicionar Produto** (2 etapas):
     - Etapa 1: Buscar produto no catálogo geral
     - Etapa 2: Definir preço, quantidade e estoque
   - **Editar Produto**: Atualizar preço, estoque, status
   - **Excluir Produto**: Remover do catálogo da farmácia
   - **Visualizar Estoque**: Lista completa com filtros

5. **Catálogo Público**
   - Produtos da farmácia visíveis para clientes
   - Integração com sistema de ofertas
   - Comparação de preços automática

### 🔐 Fluxo de Autenticação

1. **Cadastro de Usuário (Cliente)**
   - Formulário com validação
   - Criação de conta
   - Redirecionamento automático para perfil

2. **Login**
   - Autenticação via Spring Security + JWT
   - Token armazenado em AsyncStorage
   - Redirecionamento baseado no papel (cliente/farmácia)

3. **Proteção de Rotas**
   - `ProtectedRoute`: Rotas que requerem autenticação
   - `ProtectedFarmaciaRoute`: Rotas exclusivas para farmácias
   - Verificação de token em todas as requisições

### 📱 Fluxo de Navegação

```
┌─────────────────────────────────────────────┐
│           APP INICIAL (/)                    │
└─────────────────────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
   ┌────▼────┐           ┌─────▼─────┐
   │  LOGIN  │           │  SIGNUP   │
   │ (Role?) │           │           │
   └────┬────┘           └─────┬─────┘
        │                      │
   ┌────┴────┐                │
   │         │                │
┌──▼──┐  ┌──▼──────┐    ┌────▼────┐
│HOME │  │FARMACIA │    │ PERFIL  │
│(Tabs)│  │Dashboard│    │         │
└──┬──┘  └────┬────┘    └────┬────┘
   │          │               │
   │    ┌─────┴─────┐        │
   │    │ Produtos  │        │
   │    │ Estoque   │        │
   │    │ Adicionar │        │
   │    └───────────┘        │
   │                         │
┌──▼──────────┐     ┌───────▼────────┐
│  PRODUCT    │     │  SERVIÇOS      │
│  (Detalhes) │     │ - Ajuda        │
└──┬──────────┘     │ - Suporte      │
   │                │ - Editar Conta │
┌──▼──────┐         └────────────────┘
│  CART   │
│         │
└──┬──────┘
   │
┌──▼──────────┐
│  CHECKOUT   │
└─────────────┘
```

### 🔄 Fluxo de Dados (API Integration)

1. **Configuração da API**
   - Base URL: `http://localhost:8080/api`
   - Interceptors automáticos para JWT
   - Tratamento de erros centralizado

2. **Endpoints Principais**
   - **Público**: `/publico/*` (produtos, farmácias, ofertas)
   - **Cliente**: `/cliente/*` (carrinho, pedidos, perfil)
   - **Farmácia**: `/farmacia/*` (produtos, estoque, dashboard)
   - **Auth**: `/auth/*` (login, registro, refresh token)

3. **Fluxo de Requisição**
   ```
   Componente → Hook → Serviço → API → Backend
        ↓         ↓        ↓       ↓       ↓
     View     useDados  Service  Axios  Spring Boot
   ```

## 🔧 Scripts Disponíveis

```bash
npm start          # Inicia o servidor Expo
npm run android    # Executa no Android
npm run ios        # Executa no iOS
npm run web        # Executa na web
```

## ❗ Solução de Problemas

### Erro: "Cannot read properties of undefined (reading 'level')"

Este é um erro comum relacionado ao `react-native-reanimated`. **O projeto já está configurado para resolver isso automaticamente**, mas se ainda aparecer:

```bash
# Limpar todo o cache e reiniciar
npx expo start --clear
```

**Se o erro persistir:**

```bash
# Windows (PowerShell ou CMD)
rmdir /s /q node_modules
npm install
npx expo start --clear
```

```bash
# Linux/Mac
rm -rf node_modules
npm install
npx expo start --clear
```

### Ícones aparecem como quadrados
- **Solução**: Use o app Expo Go no celular ou aguarde o carregamento completo na web

### Erro de dependências
```bash
npx expo install --fix
```

### Limpar cache
```bash
npx expo start --clear
```

### Problemas com Metro Bundler
```bash
npx expo start --reset-cache
```

### Erro: Network Error / Sem resposta do servidor (CELULAR)

Este erro aparece quando o celular não consegue se conectar ao backend. **Solução:**

#### **1. Descubra o IP da sua máquina**

Execute no CMD/PowerShell:
```bash
ipconfig
```

Procure por **"Endereço IPv4"** na seção **"Adaptador de Rede sem Fio Wi-Fi"**:
```
Adaptador de Rede sem Fio Wi-Fi:
   Endereço IPv4. . . . . . . . : 192.168.0.105  👈 COPIE ESTE IP
```

#### **2. Configure o IP no projeto**

Abra o arquivo: `src/servicos/api/config.ts` (linha 29)

Substitua o IP:
```typescript
const LOCAL_NETWORK_IP = '192.168.0.105'; // ⚠️ Cole o IP que você copiou
```

#### **3. Certifique-se que o backend está rodando**

O backend Spring Boot **DEVE** estar rodando:
```bash
# Teste no navegador do PC:
http://localhost:8080/api/catalogo
```

Se não abrir, inicie o backend!

#### **4. Mesma rede Wi-Fi**

- ✅ Celular e PC na **mesma rede Wi-Fi**
- ✅ **Sem VPN** ativa
- ❌ Não use dados móveis (4G/5G)

#### **5. Libere a porta 8080 no Firewall (Windows)**

Execute como **Administrador** no PowerShell:
```powershell
netsh advfirewall firewall add rule name="Spring Boot 8080" dir=in action=allow protocol=TCP localport=8080
```

#### **6. Reinicie o Expo**

```bash
# Parar servidor (Ctrl+C)
npx expo start --clear
```

#### **7. Teste no celular**

Escaneie o QR Code novamente. No console, você deve ver:
```
🌐 API configurada para: http://192.168.0.105:8080/api
📱 Plataforma: android
```

**Se funcionar:** Os produtos e farmácias devem aparecer na home!

### App não abre no celular
1. Certifique-se de que o celular e o computador estão na **mesma rede WiFi**
2. Desative VPNs ou firewalls temporariamente
3. Tente escanear o QR Code novamente

## 🎨 Personalização

### Cores do app
Edite o arquivo `constants/Colors.ts` para personalizar o tema.

### Adicionar nova tela
1. Crie um arquivo `.tsx` na pasta `app/`
2. Use `router.push('/nome-da-tela')` para navegar

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

**Desenvolvido com ❤️ usando React Native + Expo**
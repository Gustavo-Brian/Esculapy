# Esculapy

Este documento é um guia de inicialização passo a passo para colocar o projeto **Esculapy** em funcionamento. É crucial seguir a ordem de inicialização: o **backend** deve ser iniciado antes do **frontend**.

---

## 1. Configuração e Pré-requisitos

Esta seção lista os requisitos de sistema necessários para executar a aplicação.

Para garantir a execução correta da aplicação, certifique-se de que os seguintes requisitos estão instalados em seu ambiente:

* **Maven:** Essencial para gerenciar as dependências e o processo de build do projeto Java.
* **Java (JDK):** Utilize a versão mais atualizada que for compatível com o Spring Boot para estabilidade e recursos.
* **MySQL:** Necessário para o banco de dados da aplicação.
* **Node.js:** Requisito para a inicialização e execução do frontend.
* **Expo Go (no celular):** Aplicativo necessário para visualizar o frontend (mobile) durante o desenvolvimento.

---

## 2. Inicialização do Backend

O servidor backend é o primeiro componente que deve ser executado, sendo um **Passo Obrigatório** para que o frontend funcione.

1.  **Acessar a Pasta Correta:**
    Abra seu terminal e navegue até o diretório `backend`. É fundamental que o terminal esteja posicionado no mesmo nível do arquivo `pom.xml`.

2.  **Executar o Comando:**
    Utilize o Maven para iniciar o servidor Spring Boot com o seguinte comando:

    ```bash
    mvn spring-boot:run
    ```

3.  **Processo de Configuração:**
    Durante a inicialização, o sistema pode solicitar informações de configuração no terminal (como a porta do servidor, que por padrão é `8080`).
    * Para aceitar os valores sugeridos (padrões), simplesmente pressione **Enter** em cada solicitação.
    * Para customizar, insira o novo valor desejado e pressione **Enter**.

4.  **Confirmação:**
    Aguarde até que os logs do Spring Boot indiquem a inicialização bem-sucedida do servidor na porta configurada.

> **⚠️ Importante:** O backend está configurado para **limpar todos os dados das tabelas** a cada inicialização (comportamento de ambiente de produção/teste). Por isso, a População do Banco de Dados (Seção 3) é necessária após cada vez que o backend for ligado, caso você queira rodar testes.

---

## 3. População do Banco de Dados

Esta etapa **não é estritamente necessária** para o ambiente de execução da aplicação, mas é altamente recomendada para facilitar testes e popular o banco de dados com informações iniciais.

1.  **Localize o Arquivo:**
    Encontre o arquivo de script SQL que contém todos os comandos `INSERT` necessários (LIMPAR_E_INSERIR_DADOS.sql).

2.  **Copiar e Executar:**
    Copie o conteúdo integral do arquivo de script e cole-o diretamente no seu cliente MySQL ou console para que os dados sejam inseridos no banco.

---

## 4. Inicialização do Frontend

Com o backend ativo e o banco de dados populado, você pode prosseguir para a inicialização da interface de usuário.

1.  **Instalar Dependências:**
    Abra um **novo terminal** e navegue até a pasta do frontend. Instale todas as dependências necessárias:

    ```bash
    npm install
    ```
    *(Certifique-se de que o pacote `expo-constants` foi instalado corretamente, pois ele é essencial para a detecção do IP).*

2.  **Iniciar o Servidor Expo:**
    Execute o comando abaixo para iniciar o servidor de desenvolvimento do Expo:

    ```bash
    npx expo start
    ```

3.  **Visualizar no Celular:**
    O comando acima abrirá uma tela no seu terminal exibindo um QR Code. Use o aplicativo **Expo Go** instalado no seu celular para escanear o QR Code. O aplicativo será carregado no seu dispositivo e se conectará automaticamente ao backend.

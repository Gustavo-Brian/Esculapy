<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>API Esculapy - Documentação de Endpoints</h1>
    <p><strong>URL Base:</strong> <code>http://localhost:8080</code></p>
    <!-- 1. Autenticação (Público) -->
    <section>
        <h2>1. Autenticação (Público)</h2>
        <p>Endpoints para registro e login de usuários.</p>
        <ul>
            <li>
                <strong>POST</strong> <code>/api/auth/login</code><br>
                <em>Descrição:</em> Autentica um usuário (qualquer role) e retorna um token JWT.<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "email": "cliente@example.com",
  "senha": "123456"
}</pre>
            </li>
            <li>
                <strong>POST</strong> <code>/api/auth/register/cliente</code><br>
                <em>Descrição:</em> Registra um novo usuário com o perfil de CLIENTE.<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "nome": "Cliente Teste",
  "email": "cliente@example.com",
  "senha": "123456",
  "cpf": "12345678901",
  "numeroCelular": "61999998888",
  "dataNascimento": "1990-01-01"
}</pre>
            </li>
            <li>
                <strong>POST</strong> <code>/api/auth/register/farmacia</code><br>
                <em>Descrição:</em> Registra um novo usuário LOJISTA_ADMIN e sua farmácia (com status PENDENTE_APROVACAO).<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "email": "lojista@example.com",
  "senha": "123456",
  "cnpj": "12345678000199",
  "razaoSocial": "Farmacia Teste LTDA",
  "nomeFantasia": "Farmacia Teste",
  "crfJ": "DF12345",
  "emailContato": "contato@farmacia.com",
  "numeroCelularContato": "61988887777"
}</pre>
            </li>
        </ul>
    </section>
    <hr>
    <!-- 2. Endpoints Públicos (Navegação) -->
    <section>
        <h2>2. Endpoints Públicos (Navegação)</h2>
        <p>Endpoints GET que não exigem autenticação.</p>
        <h3>Farmácias</h3>
        <ul>
            <li><strong>GET</strong> <code>/api/farmacias</code>: Lista todas as farmácias ATIVAS.</li>
            <li><strong>GET</strong> <code>/api/farmacias/{id}</code>: Busca uma farmácia ATIVA específica pelo ID.</li>
        </ul>
        <h3>Catálogo de Produtos</h3>
        <ul>
            <li><strong>GET</strong> <code>/api/catalogo</code>: Lista todos os produtos ATIVOS do catálogo central.</li>
            <li><strong>GET</strong> <code>/api/catalogo/{id}</code>: Busca um produto específico do catálogo pelo ID.</li>
        </ul>
        <h3>Estoque (Ofertas)</h3>
        <ul>
            <li><strong>GET</strong> <code>/api/estoque/buscar-por-nome?nome=...</code>: Busca ofertas de estoque pelo nome do produto.</li>
            <li><strong>GET</strong> <code>/api/estoque/buscar-por-catalogo/{catalogoId}</code>: Busca todas as ofertas (estoques) de um produto específico do catálogo.</li>
            <li><strong>GET</strong> <code>/api/estoque/farmacia/{farmaciaId}</code>: Lista todos os itens de estoque ATIVOS de uma farmácia específica.</li>
            <li><strong>GET</strong> <code>/api/estoque/{estoqueId}</code>: Busca um item de estoque específico pelo seu ID.</li>
        </ul>
    </section>
    <hr>
    <!-- 3. Cliente (ROLE_CLIENTE) -->
    <section>
        <h2>3. Cliente (Autenticação: ROLE_CLIENTE)</h2>
        <p>Endpoints para clientes logados.</p>
        <h3>User</h3>
        <ul>
            <li><strong>GET</strong> <code>/api/user/me</code>: Retorna os dados do usuário logado (incluindo seu perfil de cliente).</li>
        </ul>
        <h3>Endereços (/api/enderecos)</h3>
        <ul>
            <li>
                <strong>POST</strong> <code>/api/enderecos</code>: Adiciona um novo endereço para o cliente.<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "cep": "72000000",
  "logradouro": "Rua das Flores",
  "numero": "123",
  "complemento": "Apto 404",
  "bairro": "Centro",
  "cidade": "Brasilia",
  "estado": "DF",
  "tipo": "CASA"
}</pre>
            </li>
            <li><strong>GET</strong> <code>/api/enderecos/meus-enderecos</code>: Lista todos os endereços do cliente logado.</li>
            <li><strong>PUT</strong> <code>/api/enderecos/{id}</code>: Atualiza um endereço existente. <em>(Igual ao POST)</em></li>
            <li><strong>DELETE</strong> <code>/api/enderecos/{id}</code>: Remove um endereço do cliente.</li>
        </ul>
        <h3>Pedidos (/api/pedidos)</h3>
        <ul>
            <li>
                <strong>POST</strong> <code>/api/pedidos</code>: Cria um novo pedido (fecha o carrinho).<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "itens": [
    {"estoqueLojistaId": 1, "quantidade": 2}
  ],
  "enderecoId": 1
}</pre>
            </li>
            <li><strong>GET</strong> <code>/api/pedidos/meus-pedidos</code>: Lista o histórico de pedidos do cliente.</li>
            <li><strong>POST</strong> <code>/api/pedidos/{pedidoId}/receita</code>: Anexa o arquivo de receita a um pedido. <em>Body: multipart/form-data (Campo: arquivo)</em></li>
            <li><strong>POST</strong> <code>/api/pedidos/{pedidoId}/pagar</code>: Inicia o fluxo de pagamento e retorna uma URL.</li>
        </ul>
    </section>
    <hr>
    <!-- 4. Farmacêutico (ROLE_FARMACEUTICO) -->
    <section>
        <h2>4. Farmacêutico (Autenticação: ROLE_FARMACEUTICO)</h2>
        <p>Endpoints para farmacêuticos logados.</p>
        <h3>/api/farmaceutico/pedidos/...</h3>
        <ul>
            <li><strong>GET</strong> <code>/api/farmaceutico/pedidos/pendentes</code>: Lista os pedidos da sua farmácia que aguardam validação de receita.</li>
            <li><strong>POST</strong> <code>/api/farmaceutico/pedidos/{pedidoId}/receita/aprovar</code>: Aprova a receita de um pedido.</li>
            <li>
                <strong>POST</strong> <code>/api/farmaceutico/pedidos/{pedidoId}/receita/rejeitar</code>: Rejeita a receita e estorna o estoque.<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "justificativa": "A assinatura do médico está ilegível."
}</pre>
            </li>
        </ul>
    </section>
    <hr>
    <!-- 5. Lojista Admin (ROLE_LOJISTA_ADMIN) -->
    <section>
        <h2>5. Lojista Admin (Autenticação: ROLE_LOJISTA_ADMIN)</h2>
        <p>Endpoints para o dono da farmácia (/api/farmacia-admin).</p>
        <h3>Gerenciar Farmácia</h3>
        <ul>
            <li>
                <strong>PUT</strong> <code>/api/farmacia-admin/minha-farmacia/info</code>: Atualiza os dados de contato da farmácia.<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "nomeFantasia": "Drogaria Nova",
  "emailContato": "contato@drograrianova.com",
  "numeroCelularContato": "61912345678"
}</pre>
            </li>
            <li>
                <strong>PUT</strong> <code>/api/farmacia-admin/minha-farmacia/endereco</code>: Atualiza o endereço comercial da farmácia.<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "cep": "71000000",
  "logradouro": "Avenida Comercial",
  "numero": "Lote 10",
  "complemento": "Loja 02",
  "bairro": "Centro",
  "cidade": "Taguatinga",
  "estado": "DF",
  "tipo": "COMERCIAL"
}</pre>
            </li>
            <li>
                <strong>PUT</strong> <code>/api/farmacia-admin/minha-farmacia/conta-bancaria</code>: Atualiza a conta bancária da farmácia.<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "codigoBanco": "001",
  "agencia": "1234",
  "numeroConta": "56789",
  "digitoVerificador": "0",
  "tipoConta": "CORRENTE",
  "documentoTitular": "12345678000199",
  "nomeTitular": "Farmacia Teste LTDA"
}</pre>
            </li>
        </ul>
        <h3>Gerenciar Farmacêuticos</h3>
        <ul>
            <li>
                <strong>POST</strong> <code>/api/farmacia-admin/farmaceuticos</code>: Adiciona (contrata) um novo farmacêutico para a farmácia.<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "nome": "Farmaceutico Jose",
  "email": "jose@farmacia.com",
  "senha": "123456",
  "cpf": "12345678902",
  "crfP": "DF9876",
  "numeroCelular": "61977776666"
}</pre>
            </li>
            <li><strong>GET</strong> <code>/api/farmacia-admin/farmaceuticos</code>: Lista todos os farmacêuticos da farmácia logada.</li>
            <li>
                <strong>PUT</strong> <code>/api/farmacia-admin/farmaceuticos/{farmaceuticoId}</code>: Atualiza os dados de um farmacêutico.<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "nome": "Jose Silva",
  "numeroCelular": "61977775555"
}</pre>
            </li>
            <li><strong>POST</strong> <code>/api/farmacia-admin/farmaceuticos/{farmaceuticoId}/desativar</code>: Desativa o login de um farmacêutico.</li>
        </ul>
        <h3>Gerenciar Estoque</h3>
        <ul>
            <li>
                <strong>POST</strong> <code>/api/farmacia-admin/estoque</code>: Adiciona um novo produto ao estoque da farmácia.<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "produtoId": 1,
  "preco": 10.50,
  "quantidade": 100
}</pre>
            </li>
            <li><strong>GET</strong> <code>/api/farmacia-admin/estoque</code>: Lista todos os itens de estoque (incluindo inativos) da farmácia logada.</li>
            <li>
                <strong>PUT</strong> <code>/api/farmacia-admin/estoque/{estoqueId}</code>: Atualiza preço ou quantidade de um item de estoque.<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "produtoId": 1,
  "preco": 11.00,
  "quantidade": 90
}</pre>
            </li>
            <li><strong>DELETE</strong> <code>/api/farmacia-admin/estoque/{estoqueId}</code>: Remove um item do estoque.</li>
        </ul>
        <h3>Gerenciar Pedidos</h3>
        <ul>
            <li><strong>GET</strong> <code>/api/farmacia-admin/pedidos</code>: Lista todos os pedidos recebidos pela farmácia.</li>
            <li>
                <strong>PUT</strong> <code>/api/farmacia-admin/pedidos/{pedidoId}/status</code>: Atualiza o status de um pedido (ex: "EM_SEPARACAO", "ENVIADO").<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "status": "EM_SEPARACAO"
}</pre>
            </li>
        </ul>
    </section>
    <hr>
    <!-- 6. Admin da Plataforma (ROLE_ADMIN) -->
    <section>
        <h2>6. Admin da Plataforma (Autenticação: ROLE_ADMIN)</h2>
        <p>Endpoints de gerenciamento mestre (/api/admin).</p>
        <h3>Gerenciar Farmácias</h3>
        <ul>
            <li><strong>GET</strong> <code>/api/admin/farmacias?status=...</code>: Lista farmácias por status (PENDENTE_APROVACAO, ATIVO, SUSPENSO).</li>
            <li><strong>POST</strong> <code>/api/admin/farmacias/{id}/aprovar</code>: Aprova uma farmácia (muda de PENDENTE para ATIVO).</li>
            <li><strong>POST</strong> <code>/api/admin/farmacias/{id}/suspender</code>: Suspende uma farmácia (muda de ATIVO para SUSPENSO).</li>
            <li><strong>POST</strong> <code>/api/admin/farmacias/{id}/reativar</code>: Reativa uma farmácia (muda de SUSPENSO para ATIVO).</li>
        </ul>
        <h3>Gerenciar Usuários</h3>
        <ul>
            <li><strong>GET</strong> <code>/api/admin/usuarios/buscar?email=...</code>: Busca um usuário (qualquer role) por e-mail.</li>
            <li><strong>POST</strong> <code>/api/admin/usuarios/{id}/desativar</code>: Desativa o login de qualquer usuário.</li>
            <li><strong>POST</strong> <code>/api/admin/usuarios/{id}/reativar</code>: Reativa o login de qualquer usuário.</li>
        </ul>
        <h3>Gerenciar Catálogo de Produtos</h3>
        <ul>
            <li>
                <strong>POST</strong> <code>/api/admin/catalogo</code>: Adiciona um novo produto ao catálogo central.<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "ean": "789000000001",
  "nome": "Dipirona Sódica 500mg",
  "principioAtivo": "Dipirona",
  "laboratorio": "Neo Química",
  "descricao": "Caixa com 10 comprimidos",
  "codigoRegistroMS": "1.0000.0001",
  "bulaUrl": "http://bula.com/1",
  "tipoProduto": "MEDICAMENTO",
  "tipoReceita": "NAO_EXIGIDO"
}</pre>
            </li>
            <li><strong>PUT</strong> <code>/api/admin/catalogo/{id}</code>: Atualiza um produto do catálogo. <em>(Igual ao POST)</em></li>
            <li><strong>POST</strong> <code>/api/admin/catalogo/{id}/desativar</code>: Desativa um produto do catálogo (afeta buscas públicas).</li>
            <li><strong>POST</strong> <code>/api/admin/catalogo/{id}/reativar</code>: Reativa um produto do catálogo.</li>
            <li><strong>DELETE</strong> <code>/api/admin/catalogo/{id}</code>: Deleta um produto (só se não estiver em uso por nenhum estoque).</li>
        </ul>
    </section>
    <hr>
    <!-- 7. Webhooks (Serviços Externos) -->
    <section>
        <h2>7. Webhooks (Serviços Externos)</h2>
        <p>Endpoints públicos chamados por serviços de terceiros.</p>
        <h3>/api/webhooks/pagamento</h3>
        <ul>
            <li>
                <strong>POST</strong> <code>/api/webhooks/pagamento</code>: Endpoint que o gateway de pagamento chama para confirmar um pagamento.<br><br>
                <strong>Body (Exemplo):</strong>
                <pre>{
  "pedidoId": 1,
  "statusPagamento": "PAGO",
  "secretKey": "SUA_CHAVE_SECRETA_DO_WEBHOOK_AQUI"
}</pre>
            </li>
        </ul>
    </section>
</body>
</html>

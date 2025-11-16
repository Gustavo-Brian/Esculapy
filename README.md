<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Documentação da API Esculapy</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 960px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f9f9fb;
        }
        h1, h2, h3 {
            color: #1a1a1a;
            border-bottom: 1px solid #eaecef;
            padding-bottom: 8px;
        }
        h1 {
            font-size: 2.2em;
            margin-bottom: 0.5em;
        }
        h2 {
            font-size: 1.8em;
            margin-top: 1.5em;
        }
        h3 {
            font-size: 1.4em;
            margin-top: 1.2em;
            color: #24292e;
        }
        p, li {
            margin-bottom: 0.8em;
        }
        code {
            background-color: #f6f8fa;
            padding: 2px 6px;
            border-radius: 4px;
            font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, monospace;
            font-size: 90%;
        }
        pre {
            background-color: #f6f8fa;
            padding: 16px;
            border-radius: 6px;
            overflow-x: auto;
            margin: 1em 0;
            border: 1px solid #e1e4e8;
        }
        pre code {
            background: none;
            padding: 0;
            font-size: 100%;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5em 0;
            font-size: 0.95em;
        }
        th, td {
            border: 1px solid #dfe2e5;
            padding: 10px 12px;
            text-align: left;
        }
        th {
            background-color: #f6f8fa;
            font-weight: 600;
        }
        tr:nth-child(even) {
            background-color: #f9f9fb;
        }
        .badge {
            display: inline-block;
            padding: 3px 8px;
            font-size: 0.8em;
            font-weight: 600;
            border-radius: 4px;
            margin-right: 6px;
        }
        .badge-public { background-color: #e6f7ff; color: #0066cc; }
        .badge-cliente { background-color: #fff2e8; color: #d4380d; }
        .badge-farmaceutico { background-color: #f9f0ff; color: #531dab; }
        .badge-lojista { background-color: #e6fff3; color: #006644; }
        .badge-admin { background-color: #fffbe6; color: #8c6d1f; }
        .method {
            font-weight: bold;
            font-family: monospace;
        }
        .method-get { color: #28a745; }
        .method-post { color: #d73a49; }
        .method-put { color: #f9a825; }
        .method-delete { color: #d73a49; }
        .url-base {
            background-color: #1f2328;
            color: #c9d1d9;
            padding: 12px 16px;
            border-radius: 6px;
            font-family: monospace;
            font-size: 1.1em;
            margin: 1.5em 0;
        }
        .note {
            background-color: #fffbe6;
            border-left: 4px solid #ffe58f;
            padding: 12px 16px;
            margin: 1.5em 0;
            border-radius: 0 6px 6px 0;
        }
        .endpoint-header {
            display: flex;
            align-items: center;
            gap: 12px;
            margin-top: 1.8em;
            flex-wrap: wrap;
        }
        .section-intro {
            background-color: #f1f8ff;
            padding: 14px;
            border-radius: 6px;
            border-left: 4px solid #1890ff;
            margin-bottom: 1.5em;
        }
    </style>
</head>
<body>

<h1>Documentação da API Esculapy</h1>

<p><strong>Guia de referência rápida para os endpoints da API Esculapy</strong>, refletindo a arquitetura com separação entre <em>Catálogo de Produtos</em> e <em>Estoque de Lojistas</em>.</p>

<div class="url-base">URL Base: http://localhost:8080</div>

<hr>

<h2>Autenticação</h2>

<p>A maioria dos endpoints da API requer autenticação via <strong>Token JWT</strong>.</p>

<h3>1. Como obter um Token</h3>

<p>Para obter um token, envie uma requisição <code>POST</code> para o endpoint de login com o e-mail e a senha de um usuário cadastrado (Admin, Cliente ou Lojista).</p>

<pre><code>POST /api/auth/login</code></pre>

<p><strong>Exemplo de Corpo (Request):</strong></p>
<pre><code>{
  "email": "seu-email@exemplo.com",
  "senha": "sua-senha-123"
}</code></pre>

<p><strong>Exemplo de Resposta (Response):</strong></p>
<pre><code>{
  "token": "eyJh... (token longo) ...89sQ",
  "userId": 1,
  "email": "seu-email@exemplo.com"
}</code></pre>

<h3>2. Como usar o Token</h3>

<p>Você deve copiar o token da resposta e enviá-lo em todas as requisições autenticadas no cabeçalho <code>Authorization</code>.</p>

<p><strong>Exemplo de Header:</strong></p>
<pre><code>Authorization: Bearer eyJh... (token longo) ...89sQ</code></pre>

<hr>

<h2>Perfis de Acesso</h2>

<p>A API possui <strong>5 perfis de acesso (Roles)</strong>:</p>

<ul>
    <li><span class="badge badge-public">Público</span> Não requer token.</li>
    <li><span class="badge badge-cliente">CLIENTE</span> Requer login de um cliente.</li>
    <li><span class="badge badge-farmaceutico">FARMACEUTICO</span> Requer login de um funcionário farmacêutico.</li>
    <li><span class="badge badge-lojista">LOJISTA_ADMIN</span> Requer login do dono da farmácia.</li>
    <li><span class="badge badge-admin">ADMIN</span> Requer login do administrador master da plataforma.</li>
</ul>

<hr>

<h2>Endpoints da API</h2>

<!-- ===== 1. Auth ===== -->
<div class="endpoint-header">
    <h3>1. Auth (Autenticação)</h3>
    <span class="badge badge-public">Público</span>
</div>

<div class="section-intro">Endpoints públicos para criar contas e fazer login.</div>

<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/auth/login</code></td>
            <td>Realiza o login e retorna um token JWT.</td>
        </tr>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/auth/register/cliente</code></td>
            <td>Registra um novo usuário com perfil CLIENTE.</td>
        </tr>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/auth/register/farmacia</code></td>
            <td>Registra uma nova farmácia e seu dono (LOJISTA_ADMIN).</td>
        </tr>
    </tbody>
</table>

<!-- ===== 2. Catálogo ===== -->
<div class="endpoint-header">
    <h3>2. Catálogo (Público)</h3>
    <span class="badge badge-public">Público</span>
</div>

<div class="section-intro">Endpoints públicos para consultar o catálogo central de produtos.</div>

<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><span class="method method-get">GET</span></td>
            <td><code>/api/catalogo</code> <span style="color:#888; font-size:0.9em;">(NOVO)</span></td>
            <td>Lista todos os produtos que existem no catálogo central.</td>
        </tr>
        <tr>
            <td><span class="method method-get">GET</span></td>
            <td><code>/api/catalogo/{id}</code></td>
            <td>Retorna os dados de um produto específico do catálogo (bula, laboratório, etc.).</td>
        </tr>
    </tbody>
</table>

<!-- ===== 3. Estoque ===== -->
<div class="endpoint-header">
    <h3>3. Estoque (Público)</h3>
    <span class="badge badge-public">Público</span>
</div>

<div class="section-intro">Endpoints públicos para pesquisar estoques (itens à venda) nas farmácias.</div>

<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><span class="method method-get">GET</span></td>
            <td><code>/api/estoque/buscar-por-nome?nome=...</code></td>
            <td>Busca estoques em todas as lojas pelo nome do produto.</td>
        </tr>
        <tr>
            <td><span class="method method-get">GET</span></td>
            <td><code>/api/estoque/buscar-por-catalogo/{catalogoId}</code></td>
            <td>Lista todos os estoques (de várias farmácias) para um item do catálogo.</td>
        </tr>
        <tr>
            <td><span class="method method-get">GET</span></td>
            <td><code>/api/estoque/farmacia/{farmaciaId}</code> <span style="color:#888; font-size:0.9em;">(NOVO)</span></td>
            <td>Lista todo o estoque disponível de uma farmácia específica.</td>
        </tr>
        <tr>
            <td><span class="method method-get">GET</span></td>
            <td><code>/api/estoque/{estoqueId}</code> <span style="color:#888; font-size:0.9em;">(NOVO)</span></td>
            <td>Retorna um item de estoque específico (preço, quantidade) pelo seu ID.</td>
        </tr>
    </tbody>
</table>

<!-- ===== 4. User ===== -->
<div class="endpoint-header">
    <h3>4. User (Usuário)</h3>
    <span class="badge" style="background:#e6f7ff; color:#0066cc;">Qualquer Usuário Autenticado</span>
</div>

<div class="section-intro">Endpoint para o usuário logado buscar suas próprias informações.</div>

<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><span class="method method-get">GET</span></td>
            <td><code>/api/user/me</code></td>
            <td>Retorna os dados do usuário logado (e-mail, roles e perfil).</td>
        </tr>
    </tbody>
</table>

<!-- ===== 5. Pedidos (Cliente) ===== -->
<div class="endpoint-header">
    <h3>5. Pedidos (Cliente)</h3>
    <span class="badge badge-cliente">CLIENTE</span>
</div>

<div class="section-intro">Fluxo de compra para clientes.</div>

<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/pedidos</code></td>
            <td>Cria um novo pedido (fecha o carrinho).</td>
        </tr>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/pedidos/{pedidoId}/receita</code></td>
            <td>Anexa um arquivo (receita) a um pedido que exige validação.</td>
        </tr>
        <tr>
            <td><span class="method method-get">GET</span></td>
            <td><code>/api/pedidos/meus-pedidos</code></td>
            <td>Lista o histórico de pedidos do cliente logado.</td>
        </tr>
    </tbody>
</table>

<!-- ===== 6. Farmacêutico ===== -->
<div class="endpoint-header">
    <h3>6. Farmacêutico</h3>
    <span class="badge badge-farmaceutico">FARMACEUTICO</span>
</div>

<div class="section-intro">Validação de receitas pendentes.</div>

<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><span class="method method-get">GET</span></td>
            <td><code>/api/farmaceutico/pedidos/pendentes</code></td>
            <td>Lista pedidos da sua farmácia que aguardam validação de receita.</td>
        </tr>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/farmaceutico/pedidos/{pedidoId}/receita/aprovar</code></td>
            <td>Aprova a receita de um pedido.</td>
        </tr>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/farmaceutico/pedidos/{pedidoId}/receita/rejeitar</code></td>
            <td>Rejeita a receita (exige justificativa no corpo) e estorna o estoque.</td>
        </tr>
    </tbody>
</table>

<!-- ===== 7. Farmácia Admin ===== -->
<div class="endpoint-header">
    <h3>7. Farmácia Admin (Lojista)</h3>
    <span class="badge badge-lojista">LOJISTA_ADMIN</span>
</div>

<div class="section-intro">Gerenciamento da farmácia pelo dono.</div>

<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/farmacia-admin/farmaceuticos</code></td>
            <td>Cadastra um novo funcionário farmacêutico para sua loja.</td>
        </tr>
        <tr>
            <td><span class="method method-get">GET</span></td>
            <td><code>/api/farmacia-admin/meu-estoque</code></td>
            <td>Lista todos os itens de estoque da sua farmácia.</td>
        </tr>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/farmacia-admin/meu-estoque</code></td>
            <td>Adiciona um item do catálogo ao seu estoque (define preço/quantidade).</td>
        </tr>
        <tr>
            <td><span class="method method-put">PUT</span></td>
            <td><code>/api/farmacia-admin/meu-estoque/{estoqueId}</code></td>
            <td>Atualiza o preço/quantidade de um item no seu estoque.</td>
        </tr>
        <tr>
            <td><span class="method method-delete">DELETE</span></td>
            <td><code>/api/farmacia-admin/meu-estoque/{estoqueId}</code></td>
            <td>Remove um item do seu estoque.</td>
        </tr>
        <tr>
            <td><span class="method method-get">GET</span></td>
            <td><code>/api/farmacia-admin/pedidos</code></td>
            <td>Lista todos os pedidos feitos para a sua farmácia.</td>
        </tr>
        <tr>
            <td><span class="method method-put">PUT</span></td>
            <td><code>/api/farmacia-admin/pedidos/{pedidoId}/status</code></td>
            <td>Atualiza o status de um pedido (ex: "EM_SEPARACAO", "ENVIADO").</td>
        </tr>
    </tbody>
</table>

<!-- ===== 8. Admin Master ===== -->
<div class="endpoint-header">
    <h3>8. Admin Master</h3>
    <span class="badge badge-admin">ADMIN</span>
</div>

<div class="section-intro">Gerenciamento da plataforma.</div>

<table>
    <thead>
        <tr>
            <th>Método</th>
            <th>Endpoint</th>
            <th>Descrição</th>
        </tr>
    </thead>
    <tbody>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/admin/catalogo</code></td>
            <td>Adiciona um novo produto ao catálogo central.</td>
        </tr>
        <tr>
            <td><span class="method method-put">PUT</span></td>
            <td><code>/api/admin/catalogo/{id}</code></td>
            <td>Atualiza um produto no catálogo central.</td>
        </tr>
        <tr>
            <td><span class="method method-delete">DELETE</span></td>
            <td><code>/api/admin/catalogo/{id}</code></td>
            <td>Deleta (Hard Delete) um produto do catálogo (só se não houver estoque).</td>
        </tr>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/admin/catalogo/{id}/desativar</code></td>
            <td>Desativa (Soft Delete) um produto do catálogo.</td>
        </tr>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/admin/catalogo/{id}/reativar</code></td>
            <td>Reativa um produto do catálogo.</td>
        </tr>
        <tr>
            <td><span class="method method-get">GET</span></td>
            <td><code>/api/admin/farmacias?status=...</code></td>
            <td>Lista farmácias por status (PENDENTE_APROVACAO, ATIVO, SUSPENSO).</td>
        </tr>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/admin/farmacias/{id}/ativar</code></td>
            <td>Ativa o cadastro de uma nova farmácia.</td>
        </tr>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/admin/farmacias/{id}/desativar</code></td>
            <td>Suspende o cadastro de uma farmácia.</td>
        </tr>
        <tr>
            <td><span class="method method-get">GET</span></td>
            <td><code>/api/admin/usuarios/buscar?email=...</code></td>
            <td>Busca um usuário por e-mail.</td>
        </tr>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/admin/usuarios/{id}/desativar</code></td>
            <td>Desativa (bane) a conta de um usuário.</td>
        </tr>
        <tr>
            <td><span class="method method-post">POST</span></td>
            <td><code>/api/admin/usuarios/{id}/reativar</code></td>
            <td>Reativa a conta de um usuário.</td>
        </tr>
    </tbody>
</table>

<div class="note">
    <p><strong>Nota:</strong> Este HTML pode ser colado diretamente no README do GitHub. O GitHub renderiza HTML em READMEs (exceto alguns elementos como <code>&lt;style&gt;</code> e <code>&lt;script&gt;</code>), mas este documento usa apenas estilos inline e classes CSS seguras.</p>
</div>

</body>
</html>

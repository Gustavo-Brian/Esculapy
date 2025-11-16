<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>

<h1>Documentação da API Esculapy</h1>

<p><strong>Guia de referência rápida para os endpoints da API Esculapy</strong></em>.</p>

<div>URL Base: http://localhost:8080</div>

<hr>

<h2>Autenticação</h2>

<p>A maioria dos endpoints da API requer autenticação via <strong>Token JWT</strong>.</p>

<h3>1. Como obter um Token</h3>

<p>Para obter um token, envie uma requisição <code>POST</code> para o endpoint de login com o e-mail e a senha de um usuário cadastrado (Admin, Cliente, Farmácia e Farmacêutico) ou envie uma requisição <code>POST</code> para o endpoint de registrar cliente, registrar farmácia e registrar farmacêutico</p>

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

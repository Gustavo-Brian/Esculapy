<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body>
    <h1>Documentação da API</h1>
    <!-- AuthController -->
    <section>
        <h2>🔐 AuthController</h2>
        <p><strong>Base:</strong> <code>/api/auth</code></p>
        <ul>
            <li>
                <strong>POST</strong> <code>/api/auth/login</code><br>
                <em>Descrição:</em> Autentica um usuário (cliente, farmácia, admin) e retorna um token de acesso.<br>
                <em>Permissão:</em> Público
            </li>
            <li>
                <strong>POST</strong> <code>/api/auth/register/cliente</code><br>
                <em>Descrição:</em> Registra um novo usuário do tipo CLIENTE.<br>
                <em>Permissão:</em> Público
            </li>
            <li>
                <strong>POST</strong> <code>/api/auth/register/farmacia</code><br>
                <em>Descrição:</em> Registra uma nova farmácia (inicialmente com status PENDENTE_APROVACAO).<br>
                <em>Permissão:</em> Público
            </li>
        </ul>
    </section>
    <hr>
    <!-- UserController -->
    <section>
        <h2>👤 UserController</h2>
        <p><strong>Base:</strong> <code>/api/user</code></p>
        <ul>
            <li>
                <strong>GET</strong> <code>/api/user/me</code><br>
                <em>Descrição:</em> Retorna as informações detalhadas (perfil, roles) do usuário atualmente logado.<br>
                <em>Permissão:</em> Qualquer usuário autenticado
            </li>
        </ul>
    </section>
    <hr>
    <!-- CatalogoController -->
    <section>
        <h2>📚 CatalogoController</h2>
        <p><strong>Base:</strong> <code>/api/catalogo</code></p>
        <ul>
            <li>
                <strong>GET</strong> <code>/api/catalogo</code><br>
                <em>Descrição:</em> Retorna uma lista de todos os produtos ativos do catálogo central da plataforma.<br>
                <em>Permissão:</em> Público
            </li>
            <li>
                <strong>GET</strong> <code>/api/catalogo/{id}</code><br>
                <em>Descrição:</em> Retorna um produto específico do catálogo central pelo seu ID.<br>
                <em>Permissão:</em> Público
            </li>
        </ul>
    </section>
    <hr>
    <!-- EstoqueController -->
    <section>
        <h2>🏪 EstoqueController</h2>
        <p><strong>Base:</strong> <code>/api/estoque</code></p>
        <ul>
            <li>
                <strong>GET</strong> <code>/api/estoque/buscar-por-nome</code><br>
                <em>Descrição:</em> Busca itens de estoque disponíveis em todas as farmácias com base no nome do produto.<br>
                <em>Permissão:</em> Público
            </li>
            <li>
                <strong>GET</strong> <code>/api/estoque/buscar-por-catalogo/{catalogoId}</code><br>
                <em>Descrição:</em> Busca todas as ofertas (itens de estoque) para um ID de produto específico do catálogo central.<br>
                <em>Permissão:</em> Público
            </li>
            <li>
                <strong>GET</strong> <code>/api/estoque/farmacia/{farmaciaId}</code><br>
                <em>Descrição:</em> Retorna todos os itens de estoque de uma farmácia específica.<br>
                <em>Permissão:</em> Público
            </li>
            <li>
                <strong>GET</strong> <code>/api/estoque/{estoqueId}</code><br>
                <em>Descrição:</em> Retorna um item de estoque específico pelo seu ID.<br>
                <em>Permissão:</em> Público
            </li>
        </ul>
    </section>
    <hr>
    <!-- PedidoController -->
    <section>
        <h2>🛒 PedidoController</h2>
        <p><strong>Base:</strong> <code>/api/pedidos</code></p>
        <ul>
            <li>
                <strong>POST</strong> <code>/api/pedidos</code><br>
                <em>Descrição:</em> Cria um novo pedido (fecha o carrinho de compras) para o cliente logado.<br>
                <em>Permissão:</em> CLIENTE
            </li>
            <li>
                <strong>POST</strong> <code>/api/pedidos/{pedidoId}/receita</code><br>
                <em>Descrição:</em> Anexa um arquivo (foto/PDF) de receita a um pedido existente.<br>
                <em>Permissão:</em> CLIENTE
            </li>
            <li>
                <strong>GET</strong> <code>/api/pedidos/meus-pedidos</code><br>
                <em>Descrição:</em> Retorna o histórico de pedidos do cliente logado.<br>
                <em>Permissão:</em> CLIENTE
            </li>
        </ul>
    </section>
    <hr>
    <!-- FarmaceuticoController -->
    <section>
        <h2>🧑‍⚕️ FarmaceuticoController</h2>
        <p><strong>Base:</strong> <code>/api/farmaceutico</code></p>
        <ul>
            <li>
                <strong>GET</strong> <code>/api/farmaceutico/pedidos/pendentes</code><br>
                <em>Descrição:</em> Retorna uma lista de pedidos que aguardam validação de receita, específicos da farmácia onde o farmacêutico logado trabalha.<br>
                <em>Permissão:</em> FARMACEUTICO
            </li>
            <li>
                <strong>POST</strong> <code>/api/farmaceutico/pedidos/{pedidoId}/receita/aprovar</code><br>
                <em>Descrição:</em> Aprova a receita de um pedido.<br>
                <em>Permissão:</em> FARMACEUTICO
            </li>
            <li>
                <strong>POST</strong> <code>/api/farmaceutico/pedidos/{pedidoId}/receita/rejeitar</code><br>
                <em>Descrição:</em> Rejeita a receita de um pedido, exigindo uma justificativa.<br>
                <em>Permissão:</em> FARMACEUTICO
            </li>
        </ul>
    </section>
    <hr>
    <!-- FarmaciaAdminController -->
    <section>
        <h2>👨‍💼 FarmaciaAdminController</h2>
        <p><strong>Base:</strong> <code>/api/farmacia-admin</code></p>
        <ul>
            <li>
                <strong>POST</strong> <code>/api/farmacia-admin/farmaceuticos</code><br>
                <em>Descrição:</em> Adiciona/registra um novo funcionário (farmacêutico) para a farmácia do admin logado.<br>
                <em>Permissão:</em> LOJISTA_ADMIN
            </li>
            <li>
                <strong>POST</strong> <code>/api/farmacia-admin/estoque</code><br>
                <em>Descrição:</em> Adiciona um novo item ao estoque da farmácia logada.<br>
                <em>Permissão:</em> LOJISTA_ADMIN
            </li>
            <li>
                <strong>PUT</strong> <code>/api/farmacia-admin/estoque/{estoqueId}</code><br>
                <em>Descrição:</em> Atualiza um item de estoque existente (preço, quantidade, etc.).<br>
                <em>Permissão:</em> LOJISTA_ADMIN
            </li>
            <li>
                <strong>DELETE</strong> <code>/api/farmacia-admin/estoque/{estoqueId}</code><br>
                <em>Descrição:</em> Remove um item do estoque da farmácia logada.<br>
                <em>Permissão:</em> LOJISTA_ADMIN
            </li>
            <li>
                <strong>GET</strong> <code>/api/farmacia-admin/estoque</code><br>
                <em>Descrição:</em> Lista todos os itens de estoque da farmácia logada.<br>
                <em>Permissão:</em> LOJISTA_ADMIN
            </li>
            <li>
                <strong>GET</strong> <code>/api/farmacia-admin/pedidos</code><br>
                <em>Descrição:</em> Lista todos os pedidos recebidos pela farmácia logada.<br>
                <em>Permissão:</em> LOJISTA_ADMIN
            </li>
            <li>
                <strong>PUT</strong> <code>/api/farmacia-admin/pedidos/{pedidoId}/status</code><br>
                <em>Descrição:</em> Atualiza o status de um pedido (ex: "EM_PREPARACAO", "SAIU_PARA_ENTREGA").<br>
                <em>Permissão:</em> LOJISTA_ADMIN
            </li>
        </ul>
    </section>
    <hr>
    <!-- ProdutoController (Admin do Catálogo) -->
    <section>
        <h2>⚙️ ProdutoController (Admin do Catálogo)</h2>
        <p><strong>Base:</strong> <code>/api/admin/catalogo</code></p>
        <ul>
            <li>
                <strong>POST</strong> <code>/api/admin/catalogo</code><br>
                <em>Descrição:</em> Cria um novo produto no catálogo central da plataforma.<br>
                <em>Permissão:</em> ADMIN
            </li>
            <li>
                <strong>PUT</strong> <code>/api/admin/catalogo/{id}</code><br>
                <em>Descrição:</em> Atualiza os dados de um produto no catálogo central.<br>
                <em>Permissão:</em> ADMIN
            </li>
            <li>
                <strong>POST</strong> <code>/api/admin/catalogo/{id}/desativar</code><br>
                <em>Descrição:</em> Desativa um produto do catálogo central (impede que apareça em buscas públicas).<br>
                <em>Permissão:</em> ADMIN
            </li>
            <li>
                <strong>POST</strong> <code>/api/admin/catalogo/{id}/reativar</code><br>
                <em>Descrição:</em> Reativa um produto do catálogo central.<br>
                <em>Permissão:</em> ADMIN
            </li>
            <li>
                <strong>DELETE</strong> <code>/api/admin/catalogo/{id}</code><br>
                <em>Descrição:</em> Deleta permanentemente um produto do catálogo central.<br>
                <em>Permissão:</em> ADMIN
            </li>
        </ul>
    </section>
    <hr>
    <!-- AdminController (Admin da Plataforma) -->
    <section>
        <h2>👑 AdminController (Admin da Plataforma)</h2>
        <p><strong>Base:</strong> <code>/api/admin</code></p>
        <ul>
            <li>
                <strong>GET</strong> <code>/api/admin/farmacias</code><br>
                <em>Descrição:</em> Lista farmácias filtrando por status (PENDENTE_APROVACAO, ATIVO, SUSPENSO).<br>
                <em>Permissão:</em> ADMIN
            </li>
            <li>
                <strong>POST</strong> <code>/api/admin/farmacias/{id}/ativar</code><br>
                <em>Descrição:</em> Ativa o cadastro de uma farmácia (muda o status para ATIVO).<br>
                <em>Permissão:</em> ADMIN
            </li>
            <li>
                <strong>POST</strong> <code>/api/admin/farmacias/{id}/desativar</code><br>
                <em>Descrição:</em> Suspende o cadastro de uma farmácia (muda o status para SUSPENSO).<br>
                <em>Permissão:</em> ADMIN
            </li>
            <li>
                <strong>GET</strong> <code>/api/admin/usuarios/buscar</code><br>
                <em>Descrição:</em> Busca um usuário (de qualquer tipo) pelo seu e-mail.<br>
                <em>Permissão:</em> ADMIN
            </li>
            <li>
                <strong>POST</strong> <code>/api/admin/usuarios/{id}/desativar</code><br>
                <em>Descrição:</em> Desativa (bane) a conta de um usuário.<br>
                <em>Permissão:</em> ADMIN
            </li>
            <li>
                <strong>POST</strong> <code>/api/admin/usuarios/{id}/reativar</code><br>
                <em>Descrição:</em> Reativa a conta de um usuário.<br>
                <em>Permissão:</em> ADMIN
            </li>
        </ul>
    </section>

</body>
</html>

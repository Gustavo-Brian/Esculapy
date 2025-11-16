Documentação da API Esculapy

Guia de referência rápida para os endpoints da API Esculapy, refletindo a arquitetura com separação entre Catálogo de Produtos e Estoque de Lojistas.

URL Base: http://localhost:8080

Autenticação

A maioria dos endpoints da API requer autenticação via Token JWT.

1. Como obter um Token

Para obter um token, envie uma requisição POST para o endpoint de login com o e-mail e a senha de um usuário cadastrado (Admin, Cliente ou Lojista).

POST /api/auth/login

Exemplo de Corpo (Request):

{
    "email": "seu-email@exemplo.com",
    "senha": "sua-senha-123"
}


Exemplo de Resposta (Response):

{
    "token": "eyJh... (token longo) ...89sQ",
    "userId": 1,
    "email": "seu-email@exemplo.com"
}


2. Como usar o Token

Você deve copiar o token da resposta e enviá-lo em todas as requisições autenticadas no cabeçalho (Header) Authorization.

Exemplo de Header:
Authorization: Bearer eyJh... (token longo) ...89sQ

Perfis de Acesso

A API possui 4 perfis de acesso (Roles):

Público: Não requer token.

CLIENTE: Requer login de um cliente.

FARMACEUTICO: Requer login de um funcionário farmacêutico.

LOJISTA_ADMIN: Requer login do dono da farmácia.

ADMIN: Requer login do administrador master da plataforma.

Endpoints da API

1. Auth (Autenticação)

Endpoints públicos para criar contas e fazer login.

Permissão: Público

Método

Endpoint

Descrição

POST

/api/auth/login

Realiza o login e retorna um token JWT.

POST

/api/auth/register/cliente

Registra um novo usuário com perfil CLIENTE.

POST

/api/auth/register/farmacia

Registra uma nova farmácia e seu dono (LOJISTA_ADMIN).

2. Catálogo (Público)

Endpoints públicos para consultar o catálogo central de produtos.

Permissão: Público

Método

Endpoint

Descrição

GET

/api/catalogo

(NOVO) Lista todos os produtos que existem no catálogo central.

GET

/api/catalogo/{id}

Retorna os dados de um produto específico do catálogo (bula, laboratório, etc.).

3. Estoque (Público)

Endpoints públicos para pesquisar estoques (itens à venda) nas farmácias.

Permissão: Público

Método

Endpoint

Descrição

GET

/api/estoque/buscar-por-nome?nome=...

Busca estoques em todas as lojas pelo nome do produto.

GET

/api/estoque/buscar-por-catalogo/{catalogoId}

Lista todos os estoques (de várias farmácias) para um item do catálogo.

GET

/api/estoque/farmacia/{farmaciaId}

(NOVO) Lista todo o estoque disponível de uma farmácia específica.

GET

/api/estoque/{estoqueId}

(NOVO) Retorna um item de estoque específico (preço, quantidade) pelo seu ID.

4. User (Usuário)

Endpoint para o usuário logado buscar suas próprias informações.

Permissão: Qualquer Usuário Autenticado

Método

Endpoint

Descrição

GET

/api/user/me

Retorna os dados do usuário logado (e-mail, roles e perfil).

5. Pedidos (Cliente)

Fluxo de compra para clientes.

Permissão: CLIENTE

Método

Endpoint

Descrição

POST

/api/pedidos

Cria um novo pedido (fecha o carrinho).

POST

/api/pedidos/{pedidoId}/receita

Anexa um arquivo (receita) a um pedido que exige validação.

GET

/api/pedidos/meus-pedidos

Lista o histórico de pedidos do cliente logado.

6. Farmacêutico

Validação de receitas pendentes.

Permissão: FARMACEUTICO

Método

Endpoint

Descrição

GET

/api/farmaceutico/pedidos/pendentes

Lista pedidos da sua farmácia que aguardam validação de receita.

POST

/api/farmaceutico/pedidos/{pedidoId}/receita/aprovar

Aprova a receita de um pedido.

POST

/api/farmaceutico/pedidos/{pedidoId}/receita/rejeitar

Rejeita a receita (exige justificativa no corpo) e estorna o estoque.

7. Farmácia Admin (Lojista)

Gerenciamento da farmácia pelo dono.

Permissão: LOJISTA_ADMIN

Método

Endpoint

Descrição

POST

/api/farmacia-admin/farmaceuticos

Cadastra um novo funcionário farmacêutico para sua loja.

GET

/api/farmacia-admin/meu-estoque

Lista todos os itens de estoque da sua farmácia.

POST

/api/farmacia-admin/meu-estoque

Adiciona um item do catálogo ao seu estoque (define preço/quantidade).

PUT

/api/farmacia-admin/meu-estoque/{estoqueId}

Atualiza o preço/quantidade de um item no seu estoque.

DELETE

/api/farmacia-admin/meu-estoque/{estoqueId}

Remove um item do seu estoque.

GET

/api/farmacia-admin/pedidos

Lista todos os pedidos feitos para a sua farmácia.

PUT

/api/farmacia-admin/pedidos/{pedidoId}/status

Atualiza o status de um pedido (ex: "EM_SEPARACAO", "ENVIADO").

8. Admin Master

Gerenciamento da plataforma.

Permissão: ADMIN

Método

Endpoint

Descrição

POST

/api/admin/catalogo

Adiciona um novo produto ao catálogo central.

PUT

/api/admin/catalogo/{id}

Atualiza um produto no catálogo central.

DELETE

/api/admin/catalogo/{id}

Deleta (Hard Delete) um produto do catálogo (só se não houver estoque).

POST

/api/admin/catalogo/{id}/desativar

Desativa (Soft Delete) um produto do catálogo.

POST

/api/admin/catalogo/{id}/reativar

Reativa um produto do catálogo.

GET

/api/admin/farmacias?status=...

Lista farmácias por status (PENDENTE_APROVACAO, ATIVO, SUSPENSO).

POST

/api/admin/farmacias/{id}/ativar

Ativa o cadastro de uma nova farmácia.

POST

/api/admin/farmacias/{id}/desativar

Suspende o cadastro de uma farmácia.

GET

/api/admin/usuarios/buscar?email=...

Busca um usuário por e-mail.

POST

/api/admin/usuarios/{id}/desativar

Desativa (bane) a conta de um usuário.

POST

/api/admin/usuarios/{id}/reativar

Reativa a conta de um usuário.

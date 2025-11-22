-- ============================================
-- LIMPAR E INSERIR Dados de Teste - Esculapi
-- ============================================
-- Este script LIMPA todos os dados e insere novos
-- ATENÇÃO: Todos os dados serão APAGADOS!
-- ============================================

USE farmacia_db;

-- ============================================
-- DESABILITAR VERIFICAÇÕES TEMPORARIAMENTE
-- ============================================
SET FOREIGN_KEY_CHECKS = 0;
SET SQL_SAFE_UPDATES = 0;

-- ============================================
-- LIMPAR TODAS AS TABELAS (DELETE + RESET AUTO_INCREMENT)
-- ============================================

-- Deletar dados (ordem reversa das dependências)
DELETE FROM receitas;
DELETE FROM itens_pedido;
DELETE FROM pedidos;
DELETE FROM estoque_lojista;
DELETE FROM farmaceuticos;
DELETE FROM farmacias;
DELETE FROM contas_bancarias;
DELETE FROM enderecos;
DELETE FROM clientes;
DELETE FROM usuario_roles;
DELETE FROM usuarios;
DELETE FROM roles;
DELETE FROM produtos_catalogo;

-- Resetar AUTO_INCREMENT
ALTER TABLE receitas AUTO_INCREMENT = 1;
ALTER TABLE itens_pedido AUTO_INCREMENT = 1;
ALTER TABLE pedidos AUTO_INCREMENT = 1;
ALTER TABLE estoque_lojista AUTO_INCREMENT = 1;
ALTER TABLE farmaceuticos AUTO_INCREMENT = 1;
ALTER TABLE farmacias AUTO_INCREMENT = 1;
ALTER TABLE contas_bancarias AUTO_INCREMENT = 1;
ALTER TABLE enderecos AUTO_INCREMENT = 1;
ALTER TABLE clientes AUTO_INCREMENT = 1;
ALTER TABLE usuarios AUTO_INCREMENT = 1;
ALTER TABLE roles AUTO_INCREMENT = 1;
ALTER TABLE produtos_catalogo AUTO_INCREMENT = 1;

-- ============================================
-- REABILITAR VERIFICAÇÕES
-- ============================================
SET FOREIGN_KEY_CHECKS = 1;
SET SQL_SAFE_UPDATES = 1;

-- ============================================
-- 1. ROLES (Perfis de Acesso)
-- ============================================

INSERT INTO roles (nome) VALUES
('ROLE_ADMIN'),
('ROLE_CLIENTE'),
('ROLE_LOJISTA_ADMIN'),
('ROLE_FARMACEUTICO');

-- ============================================
-- 2. USUARIOS (Contas de Acesso)
-- ============================================

INSERT INTO usuarios (email, senha, enabled, data_criacao) VALUES
('admin@esculapi.com', '$2a$10$s1f.mlOcwTD.emp/kHExmuQY01FfmBkRj0GgiHIquo6ZmpEySVpza', 1, NOW()),
('joao@cliente.com', '$2a$10$s1f.mlOcwTD.emp/kHExmuQY01FfmBkRj0GgiHIquo6ZmpEySVpza', 1, NOW()),
('maria@cliente.com', '$2a$10$s1f.mlOcwTD.emp/kHExmuQY01FfmBkRj0GgiHIquo6ZmpEySVpza', 1, NOW()),
('admin@farmaciacentral.com', '$2a$10$s1f.mlOcwTD.emp/kHExmuQY01FfmBkRj0GgiHIquo6ZmpEySVpza', 1, NOW()),
('carlos@farmaciacentral.com', '$2a$10$s1f.mlOcwTD.emp/kHExmuQY01FfmBkRj0GgiHIquo6ZmpEySVpza', 1, NOW()),
('admin@drogariasaude.com', '$2a$10$s1f.mlOcwTD.emp/kHExmuQY01FfmBkRj0GgiHIquo6ZmpEySVpza', 1, NOW()),
('ana@drogariasaude.com', '$2a$10$s1f.mlOcwTD.emp/kHExmuQY01FfmBkRj0GgiHIquo6ZmpEySVpza', 1, NOW()),
('admin@farmaciaaguardando.com', '$2a$10$s1f.mlOcwTD.emp/kHExmuQY01FfmBkRj0GgiHIquo6ZmpEySVpza', 1, NOW());

-- ============================================
-- 3. USUARIO_ROLES (Relacionamento ManyToMany)
-- ============================================

INSERT INTO usuario_roles (usuario_id, role_id) VALUES
(1, 1), -- admin@esculapi.com - ROLE_ADMIN
(2, 2), -- joao@cliente.com - ROLE_CLIENTE
(3, 2), -- maria@cliente.com - ROLE_CLIENTE
(4, 3), -- admin@farmaciacentral.com - ROLE_LOJISTA_ADMIN
(5, 3), -- carlos@farmaciacentral.com - ROLE_LOJISTA_ADMIN (também)
(5, 4), -- carlos@farmaciacentral.com - ROLE_FARMACEUTICO
(6, 3), -- admin@drogariasaude.com - ROLE_LOJISTA_ADMIN
(7, 3), -- ana@drogariasaude.com - ROLE_LOJISTA_ADMIN (também)
(7, 4), -- ana@drogariasaude.com - ROLE_FARMACEUTICO
(8, 3); -- admin@farmaciaaguardando.com - ROLE_LOJISTA_ADMIN

-- ============================================
-- 4. CLIENTES
-- ============================================

INSERT INTO clientes (nome, cpf, numero_celular, data_nascimento, data_cadastro, usuario_id) VALUES
('João Silva', '12345678901', '11987654321', '1990-05-15', NOW(), 2),
('Maria Santos', '98765432109', '11912345678', '1985-08-20', NOW(), 3);

-- ============================================
-- 5. ENDERECOS (Clientes)
-- ============================================

INSERT INTO enderecos (cep, logradouro, numero, complemento, bairro, cidade, estado, tipo, cliente_id) VALUES
('01310-100', 'Avenida Paulista', '1000', 'Apto 101', 'Bela Vista', 'São Paulo', 'SP', 'ENTREGA', 1),
('04538-133', 'Avenida Brigadeiro Faria Lima', '3000', 'Cobertura', 'Itaim Bibi', 'São Paulo', 'SP', 'ENTREGA', 2);

-- ============================================
-- 6. ENDERECOS COMERCIAIS (Farmácias)
-- ============================================

INSERT INTO enderecos (cep, logradouro, numero, complemento, bairro, cidade, estado, tipo, cliente_id) VALUES
('01311-000', 'Rua Augusta', '500', 'Loja 1', 'Consolação', 'São Paulo', 'SP', 'COMERCIAL', NULL),
('04551-000', 'Avenida Rebouças', '1200', NULL, 'Pinheiros', 'São Paulo', 'SP', 'COMERCIAL', NULL),
('01452-000', 'Rua da Consolação', '800', NULL, 'Consolação', 'São Paulo', 'SP', 'COMERCIAL', NULL);

-- ============================================
-- 7. CONTAS BANCARIAS (Farmácias)
-- ============================================

INSERT INTO contas_bancarias (codigo_banco, agencia, numero_conta, digito_verificador, tipo_conta, documento_titular, nome_titular) VALUES
('001', '1234', '12345678', '9', 'CORRENTE', '12345678000190', 'Farmácia Central LTDA'),
('237', '5678', '87654321', '0', 'CORRENTE', '98765432000111', 'Drogaria Saúde LTDA'),
('341', '9012', '11223344', '5', 'CORRENTE', '11223344000155', 'Farmácia Aguardando LTDA');

-- ============================================
-- 8. FARMACIAS
-- ============================================

INSERT INTO farmacias (cnpj, razao_social, nome_fantasia, crfj, email_contato, numero_celular_contato, data_cadastro, status, usuario_admin_id, endereco_comercial_id, conta_bancaria_id) VALUES
('12345678000190', 'Farmácia Central LTDA', 'Farmácia Central', 'CRF-J/SP 12345', 'contato@farmaciacentral.com', '1133334444', NOW(), 'ATIVO', 5, 3, 1),  -- Carlos (ID 5) é o admin
('98765432000111', 'Drogaria Saúde LTDA', 'Drogaria Saúde', 'CRF-J/SP 67890', 'contato@drogariasaude.com', '1144445555', NOW(), 'ATIVO', 7, 4, 2),  -- Ana (ID 7) é a admin
('11223344000155', 'Farmácia Aguardando LTDA', 'Farmácia Aguardando', 'CRF-J/SP 11111', 'contato@farmaciaaguardando.com', '1155556666', NOW(), 'PENDENTE_APROVACAO', 8, 5, 3);

-- ============================================
-- 9. FARMACEUTICOS
-- ============================================

INSERT INTO farmaceuticos (nome, cpf, crfp, numero_celular, data_cadastro, usuario_id, farmacia_id) VALUES
('Carlos Farmacêutico', '11122233344', 'CRF-P/SP 11111', '11955556666', NOW(), 5, 1),
('Ana Farmacêutica', '55566677788', 'CRF-P/SP 22222', '11966667777', NOW(), 7, 2);

-- ============================================
-- 10. PRODUTOS CATALOGO
-- ============================================

INSERT INTO produtos_catalogo (ean, nome, principio_ativo, laboratorio, descricao, codigo_registroms, bula_url, tipo_produto, tipo_receita, ativo) VALUES
('7891234567890', 'Dipirona 500mg', 'Dipirona Sódica', 'EMS', 'Analgésico e antitérmico', 'MS-1.0001.0001', 'https://bulario.com/dipirona', 'MEDICAMENTO', 'NAO_EXIGIDO', 1),
('7891234567891', 'Paracetamol 750mg', 'Paracetamol', 'Medley', 'Analgésico e antitérmico', 'MS-1.0001.0002', 'https://bulario.com/paracetamol', 'MEDICAMENTO', 'NAO_EXIGIDO', 1),
('7891234567892', 'Ibuprofeno 600mg', 'Ibuprofeno', 'Aché', 'Anti-inflamatório e analgésico', 'MS-1.0001.0003', 'https://bulario.com/ibuprofeno', 'MEDICAMENTO', 'NAO_EXIGIDO', 1),
('7891234567893', 'Vitamina C 1g', 'Ácido Ascórbico', 'Bayer', 'Suplemento vitamínico', 'MS-1.0001.0004', 'https://bulario.com/vitamina-c', 'SUPLEMENTO', 'NAO_EXIGIDO', 1),
('7891234567894', 'Omeprazol 20mg', 'Omeprazol', 'Neo Química', 'Inibidor da bomba de prótons', 'MS-1.0001.0005', 'https://bulario.com/omeprazol', 'MEDICAMENTO', 'NAO_EXIGIDO', 1),
('7891234567895', 'Amoxicilina 500mg', 'Amoxicilina', 'Eurofarma', 'Antibiótico betalactâmico', 'MS-1.0001.0006', 'https://bulario.com/amoxicilina', 'MEDICAMENTO', 'BRANCA_SIMPLES', 1),
('7891234567896', 'Azitromicina 500mg', 'Azitromicina', 'Sandoz', 'Antibiótico macrolídeo', 'MS-1.0001.0007', 'https://bulario.com/azitromicina', 'MEDICAMENTO', 'BRANCA_SIMPLES', 1),
('7891234567897', 'Losartana 50mg', 'Losartana Potássica', 'Teuto', 'Anti-hipertensivo', 'MS-1.0001.0008', 'https://bulario.com/losartana', 'MEDICAMENTO', 'BRANCA_SIMPLES', 1),
('7891234567898', 'Rivotril 2mg', 'Clonazepam', 'Roche', 'Ansiolítico', 'MS-1.0001.0009', 'https://bulario.com/rivotril', 'MEDICAMENTO', 'BRANCA_CONTROLE_ESPECIAL', 1),
('7891234567899', 'Ritalina 10mg', 'Metilfenidato', 'Novartis', 'Estimulante do SNC', 'MS-1.0001.0010', 'https://bulario.com/ritalina', 'MEDICAMENTO', 'AMARELA_A', 1);

-- ============================================
-- 11. ESTOQUE_LOJISTA
-- ============================================

INSERT INTO estoque_lojista (farmacia_id, produto_id, preco, quantidade, ativo) VALUES
(1, 1, 8.50, 100, 1),   (1, 2, 12.00, 80, 1),   (1, 3, 15.00, 60, 1),
(1, 4, 25.00, 50, 1),   (1, 5, 18.00, 70, 1),   (1, 6, 22.00, 40, 1),
(1, 7, 35.00, 30, 1),   (1, 8, 16.00, 90, 1),   (1, 9, 45.00, 20, 1),
(1, 10, 55.00, 15, 1),
(2, 1, 7.90, 120, 1),   (2, 2, 11.50, 90, 1),   (2, 3, 14.50, 70, 1),
(2, 4, 23.00, 60, 1),   (2, 5, 17.00, 80, 1),   (2, 6, 21.00, 50, 1),
(2, 7, 33.00, 40, 1),   (2, 8, 15.50, 100, 1),  (2, 9, 43.00, 25, 1),
(2, 10, 52.00, 18, 1);

-- ============================================
-- 12. PEDIDOS
-- ============================================
-- Status válidos: AGUARDANDO_RECEITA, AGUARDANDO_PAGAMENTO, AGUARDANDO_CONFIRMACAO,
-- CONFIRMADO, EM_PREPARACAO, PRONTO_PARA_ENTREGA, EM_TRANSPORTE, ENTREGUE, CANCELADO, RECUSADO

INSERT INTO pedidos (cliente_id, status, valor_total, data_pedido) VALUES
(1, 'ENTREGUE', 33.50, DATE_SUB(NOW(), INTERVAL 10 DAY)),
(1, 'EM_PREPARACAO', 57.00, DATE_SUB(NOW(), INTERVAL 2 DAY)),
(1, 'AGUARDANDO_RECEITA', 67.00, DATE_SUB(NOW(), INTERVAL 1 DAY)),
(2, 'ENTREGUE', 46.50, DATE_SUB(NOW(), INTERVAL 15 DAY)),
(2, 'EM_TRANSPORTE', 39.00, DATE_SUB(NOW(), INTERVAL 5 DAY)),
(2, 'AGUARDANDO_PAGAMENTO', 23.00, NOW()),

-- Novos Pedidos Adicionais para cobrir os 10 Status para o Cliente 1 (Total: 10 pedidos)
(1, 'AGUARDANDO_PAGAMENTO', 15.00, DATE_SUB(NOW(), INTERVAL 15 HOUR)), -- NOVO (C1)
(1, 'EM_TRANSPORTE', 22.00, DATE_SUB(NOW(), INTERVAL 14 HOUR)),       -- NOVO (C1)
(1, 'AGUARDANDO_CONFIRMACAO', 10.50, DATE_SUB(NOW(), INTERVAL 13 HOUR)), -- NOVO (C1)
(1, 'CANCELADO', 99.00, DATE_SUB(NOW(), INTERVAL 12 HOUR)),          -- NOVO (C1)
(1, 'CONFIRMADO', 45.00, DATE_SUB(NOW(), INTERVAL 11 HOUR)),          -- NOVO (C1)
(1, 'PRONTO_PARA_ENTREGA', 38.00, DATE_SUB(NOW(), INTERVAL 10 HOUR)), -- NOVO (C1)
(1, 'RECUSADO', 75.50, DATE_SUB(NOW(), INTERVAL 9 HOUR)),             -- NOVO (C1)

-- Novos Pedidos Adicionais para cobrir os 10 Status para o Cliente 2 (Total: 10 pedidos)
(2, 'EM_PREPARACAO', 30.00, DATE_SUB(NOW(), INTERVAL 8 HOUR)),        -- NOVO (C2)
(2, 'AGUARDANDO_RECEITA', 42.00, DATE_SUB(NOW(), INTERVAL 7 HOUR)),   -- NOVO (C2)
(2, 'AGUARDANDO_CONFIRMACAO', 18.00, DATE_SUB(NOW(), INTERVAL 6 HOUR)), -- NOVO (C2)
(2, 'CANCELADO', 55.50, DATE_SUB(NOW(), INTERVAL 5 HOUR)),           -- NOVO (C2)
(2, 'CONFIRMADO', 60.00, DATE_SUB(NOW(), INTERVAL 4 HOUR)),           -- NOVO (C2)
(2, 'PRONTO_PARA_ENTREGA', 27.00, DATE_SUB(NOW(), INTERVAL 3 HOUR)),  -- NOVO (C2)
(2, 'RECUSADO', 19.50, DATE_SUB(NOW(), INTERVAL 2 HOUR))              -- NOVO (C2)
;

-- ============================================
-- 13. ITENS_PEDIDO
-- ============================================

INSERT INTO itens_pedido (pedido_id, estoque_lojista_id, quantidade, preco_unitario) VALUES
(1, 1, 2, 8.50),   (1, 4, 1, 16.50),
(2, 2, 3, 12.00),  (2, 6, 1, 21.00),
(3, 6, 2, 22.00),  (3, 4, 1, 23.00),
(4, 11, 3, 7.90),  (4, 14, 1, 22.80),
(5, 13, 2, 14.50), (5, 12, 1, 10.00),
(6, 14, 1, 23.00);

-- ============================================
-- 14. RECEITAS
-- ============================================

INSERT INTO receitas (pedido_id, arquivo_url, status, data_upload, farmaceutico_id, data_validacao, justificativa_rejeicao) VALUES
(3, 'https://via.placeholder.com/800x1000/4CAF50/FFFFFF?text=RECEITA+MEDICA', 'PENDENTE_VALIDACAO', DATE_SUB(NOW(), INTERVAL 1 DAY), NULL, NULL, NULL);

-- ============================================
-- VERIFICAÇÕES
-- ============================================

SELECT '========================================' AS '';
SELECT '✅ DADOS INSERIDOS COM SUCESSO!' AS '';
SELECT '========================================' AS '';

SELECT 'USUARIOS' AS Tabela, COUNT(*) AS Total FROM usuarios
UNION ALL SELECT 'ROLES', COUNT(*) FROM roles
UNION ALL SELECT 'CLIENTES', COUNT(*) FROM clientes
UNION ALL SELECT 'FARMACIAS', COUNT(*) FROM farmacias
UNION ALL SELECT 'FARMACEUTICOS', COUNT(*) FROM farmaceuticos
UNION ALL SELECT 'ENDERECOS', COUNT(*) FROM enderecos
UNION ALL SELECT 'CONTAS_BANCARIAS', COUNT(*) FROM contas_bancarias
UNION ALL SELECT 'PRODUTOS_CATALOGO', COUNT(*) FROM produtos_catalogo
UNION ALL SELECT 'ESTOQUE_LOJISTA', COUNT(*) FROM estoque_lojista
UNION ALL SELECT 'PEDIDOS', COUNT(*) FROM pedidos
UNION ALL SELECT 'ITENS_PEDIDO', COUNT(*) FROM itens_pedido
UNION ALL SELECT 'RECEITAS', COUNT(*) FROM receitas;

SELECT '' AS '';
SELECT '========================================' AS '';
SELECT '🔐 CREDENCIAIS DE TESTE' AS '';
SELECT '========================================' AS '';
SELECT 'Senha para TODOS: senha123' AS '';
SELECT '' AS '';
SELECT 'admin@esculapi.com - ADMIN' AS '';
SELECT 'joao@cliente.com - CLIENTE' AS '';
SELECT 'maria@cliente.com - CLIENTE' AS '';
SELECT 'admin@farmaciacentral.com - LOJISTA_ADMIN' AS '';
SELECT 'carlos@farmaciacentral.com - FARMACEUTICO' AS '';
SELECT 'admin@drogariasaude.com - LOJISTA_ADMIN' AS '';
SELECT 'ana@drogariasaude.com - FARMACEUTICO' AS '';

-- ============================================
-- ATIVAÇÃO E VERIFICAÇÃO DE DADOS
-- ============================================

SELECT '' AS '';
SELECT '========================================' AS '';
SELECT '🔧 ATIVANDO TODOS OS DADOS' AS '';
SELECT '========================================' AS '';

-- Desabilitar safe update mode temporariamente
SET SQL_SAFE_UPDATES = 0;

-- Garantir que todos os produtos estão ATIVOS
UPDATE produtos_catalogo
SET ativo = 1
WHERE ativo = 0;

-- Garantir que todo o estoque está ATIVO
UPDATE estoque_lojista
SET ativo = 1
WHERE ativo = 0;

-- Garantir que as farmácias estão ATIVAS (exceto aguardando aprovação)
UPDATE farmacias
SET status = 'ATIVO'
WHERE status != 'PENDENTE_APROVACAO';

-- Reabilitar safe update mode
SET SQL_SAFE_UPDATES = 1;

-- ============================================
-- ADICIONAR MAIS ESTOQUE SE NECESSÁRIO
-- ============================================

-- Adicionar produtos variados à Farmácia Central (se ainda não existem)
INSERT INTO estoque_lojista (farmacia_id, produto_id, preco, quantidade, ativo)
SELECT 1, id, ROUND(5 + (RAND() * 50), 2), FLOOR(10 + (RAND() * 100)), 1
FROM produtos_catalogo
WHERE ativo = 1
AND id NOT IN (SELECT produto_id FROM estoque_lojista WHERE farmacia_id = 1)
LIMIT 10;

-- Adicionar produtos variados à Drogaria Saúde (se ainda não existem)
INSERT INTO estoque_lojista (farmacia_id, produto_id, preco, quantidade, ativo)
SELECT 2, id, ROUND(4 + (RAND() * 55), 2), FLOOR(15 + (RAND() * 90)), 1
FROM produtos_catalogo
WHERE ativo = 1
AND id NOT IN (SELECT produto_id FROM estoque_lojista WHERE farmacia_id = 2)
LIMIT 10;

-- ============================================
-- VERIFICAÇÃO FINAL DETALHADA
-- ============================================

SELECT '' AS '';
SELECT '=====farmacias===================================' AS '';
SELECT '📊 ESTATÍSTICAS FINAIS' AS '';
SELECT '========================================' AS '';

SELECT
    'PRODUTOS ATIVOS NO CATÁLOGO' AS Descricao,
    COUNT(*) AS Total
FROM produtos_catalogo
WHERE ativo = 1

UNION ALL

SELECT
    'ITENS ATIVOS NO ESTOQUE',
    COUNT(*)
FROM estoque_lojista
WHERE ativo = 1

UNION ALL

SELECT
    'FARMÁCIAS ATIVAS',
    COUNT(*)
FROM farmacias
WHERE status = 'ATIVO';

-- ============================================
-- AMOSTRA DE PRODUTOS DISPONÍVEIS NA HOME
-- ============================================

SELECT '' AS '';
SELECT '========================================' AS '';
SELECT '📦 PRODUTOS DISPONÍVEIS NA HOME' AS '';
SELECT '========================================' AS '';

SELECT
    pc.id AS 'ID Produto',
    pc.nome AS 'Nome',
    pc.ativo AS 'Ativo',
    COUNT(el.id) AS 'Ofertas',
    MIN(el.preco) AS 'Menor Preço',
    MAX(el.preco) AS 'Maior Preço'
FROM produtos_catalogo pc
LEFT JOIN estoque_lojista el ON el.produto_id = pc.id AND el.ativo = 1
WHERE pc.ativo = 1
GROUP BY pc.id, pc.nome, pc.ativo
ORDER BY COUNT(el.id) DESC
LIMIT 10;

-- ============================================
-- ENDPOINTS DA API PÚBLICA
-- ============================================

SELECT '' AS '';
SELECT '========================================' AS '';
SELECT '🌐 ENDPOINTS DA API PÚBLICA' AS '';
SELECT '========================================' AS '';
SELECT 'GET /api/catalogo - Lista produtos ativos' AS '';
SELECT 'GET /api/farmacias - Lista farmácias ativas' AS '';
SELECT 'GET /api/estoque/buscar-por-catalogo/{id} - Ofertas por produto' AS '';
SELECT '' AS '';
SELECT '🔍 Teste manualmente no navegador:' AS '';
SELECT 'http://localhost:8080/api/catalogo' AS '';
SELECT 'http://localhost:8080/api/farmacias' AS '';
SELECT 'http://localhost:8080/api/estoque/buscar-por-catalogo/1' AS '';

-- ============================================
-- FIM DO SCRIPT
-- ============================================

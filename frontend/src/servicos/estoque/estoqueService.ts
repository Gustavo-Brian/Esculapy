/**
 * Service de Estoque - Esculapi
 * Gerenciamento de estoque da farmácia
 */

import { apiGet, apiPost, apiPut, apiDelete } from '../api/config';
import {
  ESTOQUE_ENDPOINTS,
  CATALOGO_ENDPOINTS,
  FARMACIA_ADMIN_ENDPOINTS,
  buildUrlWithParams,
  USER_ENDPOINTS
} from '../api/endpoints';
import {
  EstoqueResponse,
  EstoqueRequest,
  EstoqueLojista,
  ProdutoCatalogo,
  EstoqueStats,
  MeResponse,
} from '../types/api.types';

/**
 * Busca produtos por nome (retorna todas as ofertas de todas as farmácias)
 * GET /api/estoque/buscar-por-nome?nome=
 */
export const buscarProdutos = async (nome: string): Promise<EstoqueResponse[]> => {
  const url = buildUrlWithParams(ESTOQUE_ENDPOINTS.BUSCAR_POR_NOME, { nome });
  return await apiGet<EstoqueResponse[]>(url);
};

/**
 * Busca produtos do estoque da própria farmácia
 *
 * TENTATIVA 1: Usa GET /farmacia-admin/estoque (retorna EstoqueItem[] com campo 'ativo')
 * FALLBACK: Usa GET /produtos/buscar e filtra por farmaciaId
 */
export const buscarEstoqueProprio = async (nome: string = ''): Promise<EstoqueResponse[]> => {
  console.log('[EstoqueService] Buscando estoque próprio...');

  try {
    // Busca farmaciaId do usuário logado
    console.log('[EstoqueService] Buscando dados do usuário...');
    const meData = await apiGet<MeResponse>(USER_ENDPOINTS.ME);
    const farmaciaId = meData.farmaciaAdmin?.id || meData.farmaceutico?.farmaciaId;

    if (!farmaciaId) {
      throw new Error('Usuário não possui farmácia vinculada');
    }

    console.log('[EstoqueService] Farmácia ID:', farmaciaId);

    // TENTATIVA 1: Usa endpoint admin que retorna dados completos incluindo campo 'ativo'
    try {
      console.log('[EstoqueService] TENTANDO GET /farmacia-admin/estoque...');
      const response = await apiGet<any>(FARMACIA_ADMIN_ENDPOINTS.LIST_ESTOQUE);

      console.log('[EstoqueService] ✅ Estoque obtido via endpoint admin!');
      console.log('[EstoqueService] Response completo:', response);

      const farmaciaRazaoSocial = meData.farmaciaAdmin?.razaoSocial || '';

      // Suporta tanto Page (com content) quanto objeto com items ou array direto
      let items: any[] = [];
      if (Array.isArray(response)) {
        items = response;
      } else if (response.content && Array.isArray(response.content)) {
        items = response.content;
      } else if (response.items && Array.isArray(response.items)) {
        items = response.items;
      } else {
        throw new Error('Formato de resposta não reconhecido');
      }

      console.log('[EstoqueService] Total de produtos:', items.length);
      console.log('[EstoqueService] 🔍 Primeiro item do backend:', items[0]);

      // Converte EstoqueLojista[] do backend para EstoqueResponse[]
      // O backend NÃO retorna produtoNome, então precisamos buscar do catálogo
      console.log('[EstoqueService] 📦 Buscando informações dos produtos do catálogo...');

      const estoque: EstoqueResponse[] = await Promise.all(
        items.map(async (item, index) => {
          let produtoNome = 'Produto sem nome';
          let produtoDescricao: string | null = null;

          // Verifica se tem produto associado
          if (item.produto && item.produto.nome) {
            // O backend já retornou o produto completo!
            produtoNome = item.produto.nome;
            produtoDescricao = item.produto.descricao || null;
            console.log(`[EstoqueService] ✅ [${index + 1}/${items.length}] Produto já veio completo: ${produtoNome}`);
          }
          // Busca o nome do produto do catálogo usando produtoId
          else if (item.produtoId) {
            try {
              console.log(`[EstoqueService] 🔍 [${index + 1}/${items.length}] Buscando produto ${item.produtoId} no catálogo...`);
              const produtoCatalogo = await buscarProdutoPorId(item.produtoId);
              produtoNome = produtoCatalogo.nome;
              produtoDescricao = produtoCatalogo.descricao || null;
              console.log(`[EstoqueService] ✅ Nome encontrado: ${produtoNome}`);
            } catch (error: any) {
              console.error(`[EstoqueService] ❌ Erro ao buscar produto ${item.produtoId}:`, error.message);
              if (error.response?.status === 404) {
                console.warn(`[EstoqueService] ⚠️ Produto ${item.produtoId} não encontrado no catálogo`);
              }
            }
          } else {
            console.warn(`[EstoqueService] ⚠️ Item de estoque sem produtoId:`, item);
          }

          return {
            estoqueId: item.id,
            produtoId: item.produtoId,
            produtoNome,
            produtoDescricao,
            preco: item.preco,
            quantidade: item.quantidade,
            ativo: item.ativo !== undefined ? item.ativo : true,
            farmaciaId: farmaciaId,
            farmaciaRazaoSocial: farmaciaRazaoSocial,
            farmaciaEndereco: null,
            farmaciaDistancia: null,
          };
        })
      );

      console.log('[EstoqueService] ✅ Todos os produtos processados!');

      console.log('[EstoqueService] Produtos:', estoque.map(p => `${p.produtoNome} (Qtd: ${p.quantidade}, Ativo: ${p.ativo}, ProdutoID: ${p.produtoId}, EstoqueID: ${p.estoqueId})`));

      // Filtra por nome se fornecido
      if (nome && nome.trim() !== '') {
        const nomeLower = nome.toLowerCase();
        return estoque.filter((produto) =>
          produto.produtoNome.toLowerCase().includes(nomeLower) ||
          (produto.produtoDescricao && produto.produtoDescricao.toLowerCase().includes(nomeLower))
        );
      }

      return estoque;
    } catch (adminError: any) {
      console.warn('[EstoqueService] ⚠️ Endpoint admin falhou, usando fallback:', adminError.message);

      // FALLBACK: Usa endpoint público e filtra por farmaciaId
      console.log('[EstoqueService] FALLBACK: Usando GET /estoque/buscar-por-nome...');
      const response = await buscarProdutos('');

      // A API pode retornar um objeto paginado ou um array direto
      const allProdutos = Array.isArray(response) ? response : (response as any).content || [];

      console.log('[EstoqueService] Total de produtos no marketplace:', allProdutos.length);

      // Filtra apenas os produtos da própria farmácia
      const estoqueProprio = allProdutos.filter((produto: any) => produto.farmaciaId === farmaciaId);

      console.log('[EstoqueService] ✅ Estoque próprio carregado via fallback!');
      console.log('[EstoqueService] Total de produtos no estoque próprio:', estoqueProprio.length);
      console.log('[EstoqueService] Produtos:', estoqueProprio.map((p: any) => `${p.produtoNome} (Qtd: ${p.quantidade}, EstoqueID: ${p.estoqueId})`));

      const estoque = estoqueProprio;

      // Filtra por nome se fornecido
      if (nome && nome.trim() !== '') {
        const nomeLower = nome.toLowerCase();
        return estoque.filter((produto: any) =>
          produto.produtoNome.toLowerCase().includes(nomeLower) ||
          (produto.produtoDescricao && produto.produtoDescricao.toLowerCase().includes(nomeLower))
        );
      }

      return estoque;
    }
  } catch (error: any) {
    console.error('[EstoqueService] ❌ Erro ao buscar estoque próprio:', error);
    throw error;
  }
};

/**
 * Adiciona um produto ao estoque da farmácia
 * POST /api/farmacia-admin/estoque
 */
export const adicionarProdutoEstoque = async (
  request: EstoqueRequest
): Promise<EstoqueLojista> => {
  return await apiPost<EstoqueLojista>(FARMACIA_ADMIN_ENDPOINTS.ADD_ESTOQUE, request);
};

/**
 * Atualiza preço e/ou quantidade de um item do estoque
 * PUT /api/farmacia-admin/estoque/{estoqueId}
 *
 * NOTA: O backend REQUER todos os 3 campos (produtoId, preco, quantidade)
 * mesmo que produtoId não possa ser alterado
 */
export const atualizarEstoque = async (
  estoqueId: number,
  request: EstoqueRequest
): Promise<EstoqueLojista> => {
  console.log('[EstoqueService] Atualizando estoque:', {
    estoqueId,
    request
  });
  const url = FARMACIA_ADMIN_ENDPOINTS.UPDATE_ESTOQUE(estoqueId);
  const result = await apiPut<EstoqueLojista>(url, request);
  console.log('[EstoqueService] Estoque atualizado com sucesso:', result);
  return result;
};

/**
 * Remove um item do estoque
 * DELETE /api/farmacia-admin/estoque/{estoqueId}
 */
export const removerItemEstoque = async (estoqueId: number): Promise<void> => {
  console.log('[EstoqueService] Removendo item do estoque:', estoqueId);
  const url = FARMACIA_ADMIN_ENDPOINTS.DELETE_ESTOQUE(estoqueId);
  console.log('[EstoqueService] URL de remoção:', url);
  try {
    const result = await apiDelete<void>(url);
    console.log('[EstoqueService] Item removido com sucesso');
    return result;
  } catch (error: any) {
    console.error('[EstoqueService] Erro ao remover item:', error);

    if (error.response?.status === 403) {
      throw new Error('Você não tem permissão para remover este item do estoque');
    }

    // Detecta erro de constraint de chave estrangeira (produto já usado em pedidos)
    const errorMessage = error.response?.data?.message || error.message || '';
    if (errorMessage.includes('foreign key constraint') ||
        errorMessage.includes('itens_pedido') ||
        errorMessage.includes('FOREIGN_KEY')) {
      throw new Error('Não é possível remover este produto pois ele já foi utilizado em pedidos. Você pode apenas alterar a quantidade para 0.');
    }

    throw error;
  }
};

/**
 * Busca detalhes de um produto específico do catálogo
 * GET /api/catalogo/{id}
 */
export const buscarProdutoPorId = async (produtoId: number): Promise<ProdutoCatalogo> => {
  const url = CATALOGO_ENDPOINTS.DETALHES(produtoId);
  return await apiGet<ProdutoCatalogo>(url);
};

/**
 * Busca todas as ofertas de um produto específico (de todas as farmácias)
 * GET /api/estoque/buscar-por-catalogo/{id}
 */
export const buscarOfertasProduto = async (produtoId: number): Promise<EstoqueResponse[]> => {
  const url = ESTOQUE_ENDPOINTS.BUSCAR_POR_CATALOGO(produtoId);
  return await apiGet<EstoqueResponse[]>(url);
};

/**
 * Calcula estatísticas do estoque da farmácia
 */
export const calcularEstatisticasEstoque = async (): Promise<EstoqueStats> => {
  const estoque = await buscarEstoqueProprio('');

  const totalProdutos = estoque.length;
  const totalItens = estoque.reduce((sum, item) => sum + item.quantidade, 0);
  const valorTotal = estoque.reduce((sum, item) => sum + item.preco * item.quantidade, 0);
  const produtosBaixoEstoque = estoque.filter((item) => item.quantidade > 0 && item.quantidade < 10).length;
  const produtosEsgotados = estoque.filter((item) => item.quantidade === 0).length;

  return {
    totalProdutos,
    totalItens,
    valorTotal,
    produtosBaixoEstoque,
    produtosEsgotados,
  };
};

/**
 * Busca produtos com estoque baixo (quantidade < 10 e > 0)
 */
export const buscarProdutosBaixoEstoque = async (): Promise<EstoqueResponse[]> => {
  const estoque = await buscarEstoqueProprio('');
  return estoque.filter((item) => item.quantidade > 0 && item.quantidade < 10);
};

/**
 * Busca produtos esgotados (quantidade = 0)
 */
export const buscarProdutosEsgotados = async (): Promise<EstoqueResponse[]> => {
  const estoque = await buscarEstoqueProprio('');
  return estoque.filter((item) => item.quantidade === 0);
};

/**
 * Busca produtos mais valiosos (maior valor em estoque = preço * quantidade)
 */
export const buscarProdutosMaisValiosos = async (limite: number = 10): Promise<EstoqueResponse[]> => {
  const estoque = await buscarEstoqueProprio('');

  // Ordena por valor total (preço * quantidade) decrescente
  return estoque
    .sort((a, b) => (b.preco * b.quantidade) - (a.preco * a.quantidade))
    .slice(0, limite);
};

/**
 * Busca produtos do catálogo central (productos_catalogo)
 * Como não há endpoint para listar todos os produtos, tentamos buscar por IDs
 *
 * @param startId - ID inicial para buscar (padrão: 1)
 * @param endId - ID final para buscar (padrão: 100)
 * @returns Array de produtos do catálogo que existem
 */
export const buscarProdutosCatalogo = async (
  startId: number = 1,
  endId: number = 100
): Promise<ProdutoCatalogo[]> => {
  const promises: Promise<ProdutoCatalogo | null>[] = [];

  // Cria promises para buscar múltiplos IDs em paralelo
  for (let id = startId; id <= endId; id++) {
    const promise = buscarProdutoPorId(id)
      .then((produto) => produto)
      .catch((error) => {
        // Se o produto não existir (404), retorna null
        if (error.response?.status === 404) {
          return null;
        }
        console.warn(`Erro ao buscar produto ${id}:`, error.message);
        return null;
      });
    promises.push(promise);
  }

  // Aguarda todas as promises
  const results = await Promise.all(promises);

  // Filtra apenas os produtos que existem (não são null)
  return results.filter((p): p is ProdutoCatalogo => p !== null);
};

/**
 * Busca produtos do catálogo filtrando por nome
 *
 * @param nome - Texto para filtrar produtos por nome
 * @returns Array de produtos que contêm o nome buscado
 */
export const buscarProdutosCatalogoPorNome = async (nome: string): Promise<ProdutoCatalogo[]> => {
  // Busca todos os produtos do catálogo
  const todosProdutos = await buscarProdutosCatalogo();

  // Se não tem filtro, retorna todos
  if (!nome || nome.trim() === '') {
    return todosProdutos;
  }

  // Filtra por nome (case insensitive)
  const nomeLower = nome.toLowerCase();
  return todosProdutos.filter((produto) =>
    produto.nome.toLowerCase().includes(nomeLower) ||
    (produto.principioAtivo && produto.principioAtivo.toLowerCase().includes(nomeLower)) ||
    (produto.laboratorio && produto.laboratorio.toLowerCase().includes(nomeLower))
  );
};

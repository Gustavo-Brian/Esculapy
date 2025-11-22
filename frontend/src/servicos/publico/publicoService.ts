/**
 * Serviço Público - Esculapi
 * Endpoints públicos que não requerem autenticação
 */

import { apiGet } from '../api/config';
import { buildUrlWithParams } from '../api/endpoints';
import type { CatalogoResponse, EstoqueResponse } from '../types/api.types';

/**
 * Interface de Farmácia Pública
 */
export interface FarmaciaPublica {
  id: number;
  nomeFantasia: string;
  cnpj: string;
  crfJ: string;
  emailContato: string;
  numeroCelularContato: string;
  status: string;
  ativo: boolean;
  endereco?: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    estado: string;
    cep: string;
  };
}

/**
 * ========================================
 * FARMÁCIAS
 * ========================================
 */

/**
 * Lista todas as farmácias ATIVAS
 * GET /api/farmacias
 */
export const listarFarmaciasPublicas = async (): Promise<FarmaciaPublica[]> => {
  try {
    console.log('[PublicoService] Listando farmácias ativas');

    const response: any = await apiGet<any>('/farmacias');

    // O backend pode retornar Page (com content) ou List direto
    const farmacias = response.content || response;

    console.log('[PublicoService] Farmácias encontradas:', Array.isArray(farmacias) ? farmacias.length : 0);
    return Array.isArray(farmacias) ? farmacias : [];
  } catch (error: any) {
    console.error('[PublicoService] Erro ao listar farmácias:', error);

    if (error.response?.status === 404) {
      console.warn('[PublicoService] Endpoint não encontrado, retornando vazio');
      return [];
    }

    throw new Error(error.message || 'Erro ao listar farmácias');
  }
};

/**
 * Busca uma farmácia ATIVA específica pelo ID
 * GET /api/farmacias/{id}
 */
export const buscarFarmaciaPublica = async (id: number): Promise<FarmaciaPublica> => {
  try {
    console.log('[PublicoService] Buscando farmácia:', id);

    const response = await apiGet<FarmaciaPublica>(`/farmacias/${id}`);

    console.log('[PublicoService] Farmácia encontrada:', response.nomeFantasia);
    return response;
  } catch (error: any) {
    console.error('[PublicoService] Erro ao buscar farmácia:', error);
    throw new Error(error.message || 'Erro ao buscar farmácia');
  }
};

/**
 * ========================================
 * CATÁLOGO DE PRODUTOS
 * ========================================
 */

/**
 * Lista todos os produtos ATIVOS do catálogo central
 * GET /api/catalogo
 */
export const listarCatalogo = async (): Promise<CatalogoResponse[]> => {
  try {
    console.log('[PublicoService] Listando catálogo de produtos');

    const response: any = await apiGet<any>('/catalogo');

    // O backend pode retornar Page (com content) ou List direto
    const produtos = response.content || response;

    console.log('[PublicoService] Produtos no catálogo:', Array.isArray(produtos) ? produtos.length : 0);
    return Array.isArray(produtos) ? produtos : [];
  } catch (error: any) {
    console.error('[PublicoService] Erro ao listar catálogo:', error);

    if (error.response?.status === 404) {
      console.warn('[PublicoService] Endpoint não encontrado, retornando vazio');
      return [];
    }

    throw new Error(error.message || 'Erro ao listar catálogo');
  }
};

/**
 * Busca um produto específico do catálogo pelo ID
 * GET /api/catalogo/{id}
 */
export const buscarProdutoCatalogo = async (id: number): Promise<CatalogoResponse> => {
  try {
    console.log('[PublicoService] Buscando produto do catálogo:', id);

    const response = await apiGet<CatalogoResponse>(`/catalogo/${id}`);

    console.log('[PublicoService] Produto encontrado:', response.nome);
    return response;
  } catch (error: any) {
    console.error('[PublicoService] Erro ao buscar produto do catálogo:', error);
    throw new Error(error.message || 'Erro ao buscar produto');
  }
};

/**
 * ========================================
 * ESTOQUE (OFERTAS)
 * ========================================
 */

/**
 * Interface para parâmetros de busca de estoque por nome
 */
export interface BuscarEstoquePorNomeParams {
  nome: string;
  page?: number;
  size?: number;
}

/**
 * Busca ofertas de estoque pelo nome do produto
 * GET /api/estoque/buscar-por-nome?nome=...
 */
export const buscarEstoquePorNome = async (
  params: BuscarEstoquePorNomeParams
): Promise<EstoqueResponse[]> => {
  try {
    console.log('[PublicoService] Buscando estoque por nome:', params.nome);

    const url = buildUrlWithParams('/estoque/buscar-por-nome', params);
    const response = await apiGet<EstoqueResponse[]>(url);

    console.log('[PublicoService] Ofertas encontradas:', response.length);
    return response;
  } catch (error: any) {
    console.error('[PublicoService] Erro ao buscar estoque por nome:', error);

    if (error.response?.status === 404) {
      console.warn('[PublicoService] Nenhuma oferta encontrada');
      return [];
    }

    throw new Error(error.message || 'Erro ao buscar ofertas');
  }
};

/**
 * Busca todas as ofertas (estoques) de um produto específico do catálogo
 * GET /api/estoque/buscar-por-catalogo/{catalogoId}
 */
export const buscarEstoquePorCatalogo = async (catalogoId: number): Promise<EstoqueResponse[]> => {
  try {
    console.log('[PublicoService] Buscando ofertas do produto:', catalogoId);

    const response: any = await apiGet<any>(`/estoque/buscar-por-catalogo/${catalogoId}`);

    // O backend pode retornar Page (com content) ou List direto
    const estoques = response.content || response;

    console.log('[PublicoService] Ofertas encontradas:', Array.isArray(estoques) ? estoques.length : 0);
    return Array.isArray(estoques) ? estoques : [];
  } catch (error: any) {
    console.error('[PublicoService] Erro ao buscar ofertas do produto:', error);

    if (error.response?.status === 404) {
      console.warn('[PublicoService] Nenhuma oferta encontrada');
      return [];
    }

    throw new Error(error.message || 'Erro ao buscar ofertas');
  }
};

/**
 * Lista todos os itens de estoque ATIVOS de uma farmácia específica
 * GET /api/estoque/farmacia/{farmaciaId}
 */
export const listarEstoqueFarmacia = async (farmaciaId: number): Promise<EstoqueResponse[]> => {
  try {
    console.log('[PublicoService] Listando estoque da farmácia:', farmaciaId);

    const response: any = await apiGet<any>(`/estoque/farmacia/${farmaciaId}`);

    // O backend pode retornar Page (com content) ou List direto
    const estoque = response.content || response;

    if (!Array.isArray(estoque)) {
      console.warn('[PublicoService] Resposta não é um array:', estoque);
      return [];
    }

    console.log('[PublicoService] Itens no estoque:', estoque.length);

    // DEBUG: Verificar estrutura do primeiro item
    if (estoque.length > 0) {
      console.log('[PublicoService] DEBUG - Primeiro item do estoque:', JSON.stringify(estoque[0], null, 2));
    }

    return estoque;
  } catch (error: any) {
    console.error('[PublicoService] Erro ao listar estoque da farmácia:', error);

    if (error.response?.status === 404) {
      console.warn('[PublicoService] Nenhum item encontrado');
      return [];
    }

    throw new Error(error.message || 'Erro ao listar estoque');
  }
};

/**
 * Busca um item de estoque específico pelo seu ID
 * GET /api/estoque/{estoqueId}
 */
export const buscarItemEstoque = async (estoqueId: number): Promise<EstoqueResponse> => {
  try {
    console.log('[PublicoService] Buscando item de estoque:', estoqueId);

    const response = await apiGet<EstoqueResponse>(`/estoque/${estoqueId}`);

    console.log('[PublicoService] Item encontrado:', response.produtoNome);
    return response;
  } catch (error: any) {
    console.error('[PublicoService] Erro ao buscar item de estoque:', error);
    throw new Error(error.message || 'Erro ao buscar item');
  }
};

/**
 * ========================================
 * FUNÇÕES AUXILIARES
 * ========================================
 */

/**
 * Busca produtos do catálogo com ofertas de estoque
 * Combina dados de catálogo + estoque para exibição completa
 */
export const buscarProdutosComOfertas = async (): Promise<
  Array<CatalogoResponse & { ofertas: EstoqueResponse[] }>
> => {
  try {
    console.log('[PublicoService] Buscando produtos com ofertas');

    const produtos = await listarCatalogo();

    // Para cada produto, busca suas ofertas
    const produtosComOfertas = await Promise.all(
      produtos.map(async (produto) => {
        const ofertas = await buscarEstoquePorCatalogo(produto.id);

        console.log(`[PublicoService] Produto ${produto.id} (${produto.nome}) - Ofertas:`, ofertas.length);

        return {
          ...produto,
          ofertas: ofertas, // Todas as ofertas disponíveis (backend já filtra por ativo)
        };
      })
    );

    // Filtra produtos que têm pelo menos uma oferta
    const produtosDisponiveis = produtosComOfertas.filter((p) => p.ofertas.length > 0);

    console.log('[PublicoService] Produtos disponíveis:', produtosDisponiveis.length);
    return produtosDisponiveis;
  } catch (error: any) {
    console.error('[PublicoService] Erro ao buscar produtos com ofertas:', error);
    return [];
  }
};

/**
 * Busca melhores ofertas (menor preço) para cada produto
 */
export const buscarMelhoresOfertas = async (): Promise<
  Array<{
    produto: CatalogoResponse;
    melhorOferta: EstoqueResponse;
    economiza: number;
    farmacia: string;
  }>
> => {
  try {
    console.log('[PublicoService] Buscando melhores ofertas');

    const produtosComOfertas = await buscarProdutosComOfertas();

    const melhoresOfertas = produtosComOfertas.map((produto) => {
      // Ordena ofertas por preço (menor primeiro)
      const ofertasOrdenadas = [...produto.ofertas].sort((a, b) => a.preco - b.preco);

      const melhorOferta = ofertasOrdenadas[0];
      const piorOferta = ofertasOrdenadas[ofertasOrdenadas.length - 1];

      const economiza = piorOferta.preco - melhorOferta.preco;

      return {
        produto,
        melhorOferta,
        economiza,
        farmacia: melhorOferta.farmaciaRazaoSocial,
      };
    });

    // Ordena por economia (maior economia primeiro)
    melhoresOfertas.sort((a, b) => b.economiza - a.economiza);

    console.log('[PublicoService] Melhores ofertas encontradas:', melhoresOfertas.length);
    return melhoresOfertas;
  } catch (error: any) {
    console.error('[PublicoService] Erro ao buscar melhores ofertas:', error);
    return [];
  }
};

export default {
  // Farmácias
  listarFarmaciasPublicas,
  buscarFarmaciaPublica,
  // Catálogo
  listarCatalogo,
  buscarProdutoCatalogo,
  // Estoque
  buscarEstoquePorNome,
  buscarEstoquePorCatalogo,
  listarEstoqueFarmacia,
  buscarItemEstoque,
  // Auxiliares
  buscarProdutosComOfertas,
  buscarMelhoresOfertas,
};

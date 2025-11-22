/**
 * Serviço de Endereços - Esculapi
 * Funções para clientes gerenciarem seus endereços
 */

import api from '../api/config';
import { ENDERECOS_ENDPOINTS } from '../api/endpoints';
import type {
  Endereco,
  EnderecoRequest,
  EnderecosResponse,
} from '../types/api.types';

/**
 * Listar endereços do cliente autenticado
 * Requer: ROLE_CLIENTE
 *
 * @returns Lista de endereços
 */
export const listarEnderecos = async (): Promise<EnderecosResponse> => {
  try {
    console.log('[EnderecoService] Buscando endereços...');

    const response = await api.get<any>(ENDERECOS_ENDPOINTS.LISTAR);

    console.log('[EnderecoService] 🔍 Resposta RAW da API:', response.data);

    // Backend pode retornar ApiResponse<List<Endereco>> ou array direto
    const dados = response.data.data || response.data;

    // Se for array direto
    if (Array.isArray(dados)) {
      console.log('[EnderecoService] ✅ Formato array direto detectado');
      return {
        enderecos: dados,
        total: dados.length,
      };
    }

    // Se tiver enderecos e total
    if (dados.enderecos && Array.isArray(dados.enderecos)) {
      console.log('[EnderecoService] ✅ Formato com enderecos array detectado');
      return {
        enderecos: dados.enderecos,
        total: dados.total || dados.enderecos.length,
      };
    }

    console.warn('[EnderecoService] ⚠️ Formato inesperado, retornando vazio');
    return {
      enderecos: [],
      total: 0,
    };
  } catch (error: any) {
    console.error('[EnderecoService] Erro ao buscar endereços:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao buscar endereços');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Criar novo endereço
 * Requer: ROLE_CLIENTE
 *
 * @param endereco - Dados do endereço
 * @returns Endereço criado
 */
export const criarEndereco = async (endereco: EnderecoRequest): Promise<Endereco> => {
  try {
    console.log('[EnderecoService] Criando endereço:', {
      tipo: endereco.tipo,
      cidade: endereco.cidade,
      estado: endereco.estado,
    });

    const response = await api.post<any>(
      ENDERECOS_ENDPOINTS.CRIAR,
      endereco
    );

    console.log('[EnderecoService] 🔍 Resposta RAW da API:', response.data);

    // Backend retorna dentro de ApiResponse { data: Endereco }
    const enderecoData = response.data.data || response.data;

    console.log('[EnderecoService] Endereço criado com sucesso:', {
      id: enderecoData.id,
      tipo: enderecoData.tipo,
    });

    return enderecoData as Endereco;
  } catch (error: any) {
    console.error('[EnderecoService] Erro ao criar endereço:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao criar endereço');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Atualizar endereço existente
 * Requer: ROLE_CLIENTE
 *
 * @param enderecoId - ID do endereço
 * @param endereco - Dados atualizados
 * @returns Endereço atualizado
 */
export const atualizarEndereco = async (
  enderecoId: number,
  endereco: EnderecoRequest
): Promise<Endereco> => {
  try {
    console.log('[EnderecoService] Atualizando endereço:', enderecoId);

    const response = await api.put<any>(
      ENDERECOS_ENDPOINTS.ATUALIZAR(enderecoId),
      endereco
    );

    // Backend retorna dentro de ApiResponse { data: Endereco }
    const enderecoData = response.data.data || response.data;

    console.log('[EnderecoService] Endereço atualizado com sucesso');
    return enderecoData as Endereco;
  } catch (error: any) {
    console.error('[EnderecoService] Erro ao atualizar endereço:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao atualizar endereço');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Deletar endereço
 * Requer: ROLE_CLIENTE
 *
 * @param enderecoId - ID do endereço
 */
export const deletarEndereco = async (enderecoId: number): Promise<void> => {
  try {
    console.log('[EnderecoService] Deletando endereço:', enderecoId);

    await api.delete(ENDERECOS_ENDPOINTS.DELETAR(enderecoId));

    console.log('[EnderecoService] Endereço deletado com sucesso');
  } catch (error: any) {
    console.error('[EnderecoService] Erro ao deletar endereço:', error);

    if (error.response?.data) {
      throw new Error(error.response.data.message || 'Erro ao deletar endereço');
    }

    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
  }
};

/**
 * Buscar CEP usando API ViaCEP
 *
 * @param cep - CEP para buscar (apenas números)
 * @returns Dados do endereço
 */
export const buscarCep = async (cep: string): Promise<{
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
}> => {
  try {
    // Remove caracteres não numéricos
    const cepLimpo = cep.replace(/\D/g, '');

    if (cepLimpo.length !== 8) {
      throw new Error('CEP deve ter 8 dígitos');
    }

    console.log('[EnderecoService] Buscando CEP:', cepLimpo);

    const response = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
    const data = await response.json();

    if (data.erro) {
      throw new Error('CEP não encontrado');
    }

    console.log('[EnderecoService] CEP encontrado:', data.localidade);

    return {
      cep: data.cep,
      logradouro: data.logradouro || '',
      complemento: data.complemento || '',
      bairro: data.bairro || '',
      cidade: data.localidade || '',
      estado: data.uf || '',
    };
  } catch (error: any) {
    console.error('[EnderecoService] Erro ao buscar CEP:', error);
    throw new Error(error.message || 'Erro ao buscar CEP');
  }
};

export default {
  listarEnderecos,
  criarEndereco,
  atualizarEndereco,
  deletarEndereco,
  buscarCep,
};

/**
 * Hook useDadosComparacao
 * Conecta o ServicoComparacao (OOP) com React
 * Padrão: OOP + Português
 */

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ServicoComparacao } from '../servicos/ServicoComparacao';

// Estados da UI
interface EstadoSnackbar {
  visivel: boolean;
  mensagem: string;
  tipo: 'success' | 'error' | 'info';
}

export const useDadosComparacao = () => {
  // Instância única do serviço (OOP)
  const [servico] = useState(() => new ServicoComparacao());

  // Parâmetros da URL (produto a comparar)
  const params = useLocalSearchParams<{ produtoId?: string }>();
  const produtoId = params.produtoId ? parseInt(params.produtoId) : 1;

  // Estados da UI
  const [snackbar, setSnackbar] = useState<EstadoSnackbar>({
    visivel: false,
    mensagem: '',
    tipo: 'info',
  });

  /**
   * Mostra snackbar
   */
  const mostrarSnackbar = useCallback((mensagem: string, tipo: EstadoSnackbar['tipo'] = 'info') => {
    setSnackbar({ visivel: true, mensagem, tipo });
  }, []);

  /**
   * Carrega comparação ao montar
   */
  useEffect(() => {
    const carregarDados = async () => {
      try {
        console.log('[useDadosComparacao] Carregando comparação para produto:', produtoId);
        await servico.carregarComparacao(produtoId);
        console.log('[useDadosComparacao] Comparação carregada:', servico.totalOfertas, 'ofertas');
      } catch (erro: any) {
        console.error('[useDadosComparacao] Erro ao carregar:', erro);
        mostrarSnackbar('Erro ao carregar comparação de preços', 'error');
      }
    };

    carregarDados();
  }, [produtoId, servico, mostrarSnackbar]);

  /**
   * Estatísticas da comparação
   */
  const estatisticas = useMemo(() => {
    return servico.obterEstatisticas();
  }, [servico.comparacao, servico]);

  /**
   * Recomendação de compra
   */
  const recomendacao = useMemo(() => {
    return servico.obterRecomendacao();
  }, [servico.comparacao, servico]);

  /**
   * Manipuladores de eventos
   */
  const manipuladores = {
    /**
     * Volta para tela anterior
     */
    aoVoltarPress: useCallback(() => {
      router.back();
    }, []),

    /**
     * Seleciona uma oferta (adiciona ao carrinho)
     */
    aoSelecionarOferta: useCallback((ofertaId: number) => {
      const oferta = servico.obterOfertaPorId(ofertaId);

      if (!oferta) {
        mostrarSnackbar('Oferta não encontrada', 'error');
        return;
      }

      // Analisa se vale a pena
      const analise = servico.analisarOferta(ofertaId);

      Alert.alert(
        'Adicionar ao Carrinho',
        `${servico.produtoNome}\n${oferta.farmaciaNome}\n\n${oferta.formatarPreco()}\n\n${analise?.motivo || ''}`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Adicionar',
            onPress: () => {
              console.log('[useDadosComparacao] Adicionando ao carrinho:', {
                produtoId: servico.comparacao.produtoId,
                ofertaId,
                farmacia: oferta.farmaciaNome,
                preco: oferta.preco,
              });

              mostrarSnackbar('Produto adicionado ao carrinho!', 'success');

              // TODO: Integrar com serviço de carrinho
              // servicoCarrinho.adicionarItem({ ... });
            },
          },
        ]
      );
    }, [servico, mostrarSnackbar]),

    /**
     * Navega para página da farmácia
     */
    aoFarmaciaPress: useCallback((farmaciaNome: string) => {
      // Encontra oferta com esse nome de farmácia
      const oferta = servico.comparacao.ofertas.find((o) => o.farmaciaNome === farmaciaNome);

      if (oferta) {
        console.log('[useDadosComparacao] Navegando para farmácia:', oferta.farmaciaId);
        router.push(`/seller/${oferta.farmaciaId}`);
      } else {
        console.log('[useDadosComparacao] Farmácia não encontrada:', farmaciaNome);
      }
    }, [servico]),

    /**
     * Fecha snackbar
     */
    aoFecharSnackbar: useCallback(() => {
      setSnackbar((prev) => ({ ...prev, visivel: false }));
    }, []),

    /**
     * Ordena ofertas
     */
    aoOrdenarOfertas: useCallback((criterio: 'preco' | 'avaliacao' | 'proximidade' | 'economia' | 'melhor') => {
      console.log('[useDadosComparacao] Ordenando por:', criterio);
      return servico.ordenarOfertas(criterio);
    }, [servico]),

    /**
     * Filtra ofertas
     */
    aoFiltrarOfertas: useCallback((criterio: 'entregaGratis' | 'proximas' | 'avaliacaoAlta' | 'verificadas' | 'comEstoque') => {
      console.log('[useDadosComparacao] Filtrando por:', criterio);
      return servico.filtrarOfertas(criterio);
    }, [servico]),
  };

  return {
    // Dados do produto
    produto: {
      nome: servico.produtoNome,
      descricao: servico.produtoDescricao,
      ofertas: servico.comparacao.ofertas,
    },

    // Estatísticas
    estatisticas,

    // Recomendação
    recomendacao,

    // Snackbar
    snackbar: {
      visivel: snackbar.visivel,
      mensagem: snackbar.mensagem,
      tipo: snackbar.tipo,
    },

    // Estados gerais
    carregando: servico.carregando,
    erro: servico.erro,
    temOfertas: servico.temOfertas,
    totalOfertas: servico.totalOfertas,

    // Manipuladores
    manipuladores,

    // Utilitários
    mostrarSnackbar,
  };
};

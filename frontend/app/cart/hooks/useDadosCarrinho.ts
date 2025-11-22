/**
 * Hook useDadosCarrinho
 * Conecta o ServicoCarrinho (OOP) com React
 */

import { useState, useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import { Alert } from 'react-native';
import { ServicoCarrinho } from '../servicos/ServicoCarrinho';
import { useToast } from '@/src/hooks/useToast';
import { criarPedido } from '@/src/servicos/pedidos/pedidoService';
import { listarEnderecos } from '@/src/servicos/enderecos/enderecoService';
import type { CarrinhoRequest, ItemCarrinho as ItemCarrinhoAPI, Endereco } from '@/src/servicos/types/api.types';

export const useDadosCarrinho = () => {
  // Instância única do serviço
  const [servico] = useState(() => new ServicoCarrinho());
  const [atualizando, setAtualizando] = useState(false);
  const [codigoCupom, setCodigoCupom] = useState('');
  const [processandoPedido, setProcessandoPedido] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const [modalEnderecoVisivel, setModalEnderecoVisivel] = useState(false);
  const [modalNovoEnderecoVisivel, setModalNovoEnderecoVisivel] = useState(false);
  const [enderecoSelecionado, setEnderecoSelecionado] = useState<Endereco | null>(null);

  const { showSuccess, showError } = useToast();

  /**
   * Processar pedido com endereço selecionado
   */
  const processarPedido = useCallback(async (endereco: Endereco) => {
    try {
      setProcessandoPedido(true);

      console.log('[useDadosCarrinho] Processando pedido com endereço:', endereco.id);

      // Agrupar itens por farmaciaId
      const itensPorFarmacia = servico.itens.reduce<Record<number, typeof servico.itens>>((acc, item) => {
        if (!acc[item.farmaciaId]) {
          acc[item.farmaciaId] = [];
        }
        acc[item.farmaciaId].push(item);
        return acc;
      }, {});

      const farmacias = Object.keys(itensPorFarmacia);
      console.log(`[useDadosCarrinho] Criando ${farmacias.length} pedido(s) para ${farmacias.length} farmácia(s)`);

      // Criar um pedido para cada farmácia
      const pedidosCriados = [];
      const pedidosComReceita = [];

      for (const farmaciaId of farmacias) {
        const itensDestaFarmacia = itensPorFarmacia[Number(farmaciaId)];

        // Converter itens para formato da API
        const itensAPI: ItemCarrinhoAPI[] = itensDestaFarmacia.map((item) => ({
          estoqueLojistaId: item.estoqueId,
          produtoId: item.produtoId,
          produtoNome: item.nome,
          farmaciaId: item.farmaciaId,
          quantidade: item.quantidade,
          precoUnitario: item.preco,
        }));

        const carrinhoRequest: CarrinhoRequest = {
          itens: itensAPI,
          enderecoId: endereco.id,
          observacoes: servico.cupomAplicado ? `Cupom aplicado: ${servico.cupomAplicado}` : undefined,
        };

        console.log(`[useDadosCarrinho] Criando pedido para farmácia ${farmaciaId}:`, {
          farmacia: itensDestaFarmacia[0].farmacia,
          itens: itensDestaFarmacia.length,
        });

        // Criar pedido
        const pedidoCriado = await criarPedido(carrinhoRequest);
        pedidosCriados.push(pedidoCriado);

        console.log(`[useDadosCarrinho] Pedido criado:`, {
          id: pedidoCriado.id,
          numero: pedidoCriado.numero,
          status: pedidoCriado.status,
          total: pedidoCriado.total,
        });

        // Verificar se precisa de receita
        if (pedidoCriado.status === 'AGUARDANDO_RECEITA') {
          pedidosComReceita.push(pedidoCriado);
        }
      }

      // Limpar carrinho
      await servico.limpar();

      // Mostrar mensagem de sucesso
      if (pedidosComReceita.length > 0) {
        const mensagem = pedidosCriados.length === 1
          ? `Pedido #${pedidosCriados[0].numero} criado com sucesso!\n\nEste pedido contém medicamentos controlados e requer o envio de receita médica.`
          : `${pedidosCriados.length} pedidos criados com sucesso!\n\n${pedidosComReceita.length} pedido(s) contém medicamentos controlados e requer(em) o envio de receita médica.`;

        Alert.alert(
          'Pedidos Criados!',
          mensagem,
          [
            {
              text: 'Ver Pedidos',
              onPress: () => {
                router.push('/pedidos');
              },
            },
            {
              text: 'OK',
              style: 'cancel',
              onPress: () => {
                router.push('/');
              },
            },
          ]
        );
      } else {
        const mensagem = pedidosCriados.length === 1
          ? `Pedido #${pedidosCriados[0].numero} realizado com sucesso!`
          : `${pedidosCriados.length} pedidos realizados com sucesso!`;

        showSuccess(mensagem);

        // Redirecionar para tela de pedidos após 1.5s
        setTimeout(() => {
          router.push('/pedidos');
        }, 1500);
      }
    } catch (error: any) {
      console.error('[useDadosCarrinho] Erro ao processar pedido:', error);
      showError(error.message || 'Erro ao finalizar pedido. Tente novamente.');
    } finally {
      setProcessandoPedido(false);
    }
  }, [servico, showSuccess, showError]);

  /**
   * Carrega carrinho do AsyncStorage ao montar o componente
   */
  useEffect(() => {
    const carregarDados = async () => {
      try {
        await servico.carregarCarrinho();
      } catch (error) {
        console.error('[useDadosCarrinho] Erro ao carregar carrinho:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [servico]);

  /**
   * Manipuladores
   */
  const manipuladores = {
    /**
     * Voltar
     */
    aoVoltar: useCallback(() => {
      router.back();
    }, []),

    /**
     * Ir para favoritos
     */
    aoIrFavoritos: useCallback(() => {
      router.push('/favorites');
    }, []),

    /**
     * Incrementar quantidade
     */
    aoIncrementarQuantidade: useCallback(async (itemId: number) => {
      await servico.incrementarQuantidade(itemId);
      setAtualizando(!atualizando);
    }, [servico, atualizando]),

    /**
     * Decrementar quantidade
     */
    aoDecrementarQuantidade: useCallback(async (itemId: number) => {
      await servico.decrementarQuantidade(itemId);
      setAtualizando(!atualizando);
    }, [servico, atualizando]),

    /**
     * Remover item
     */
    aoRemoverItem: useCallback(async (itemId: number) => {
      await servico.removerItem(itemId);
      setAtualizando(!atualizando);
      showSuccess('Item removido do carrinho');
    }, [servico, atualizando, showSuccess]),

    /**
     * Aplicar cupom
     */
    aoAplicarCupom: useCallback(async () => {
      if (!codigoCupom.trim()) {
        showError('Digite um código de cupom');
        return;
      }

      const sucesso = await servico.aplicarCupom(codigoCupom);

      if (sucesso) {
        showSuccess(`Cupom ${codigoCupom} aplicado!`);
        setCodigoCupom('');
        setAtualizando(!atualizando);
      } else {
        showError('Cupom inválido');
      }
    }, [codigoCupom, servico, atualizando, showSuccess, showError]),

    /**
     * Remover cupom
     */
    aoRemoverCupom: useCallback(async () => {
      await servico.removerCupom();
      setAtualizando(!atualizando);
      showSuccess('Cupom removido');
    }, [servico, atualizando, showSuccess]),

    /**
     * Mudar código do cupom
     */
    aoMudarCodigoCupom: useCallback((codigo: string) => {
      setCodigoCupom(codigo);
    }, []),

    /**
     * Finalizar compra - Conectado com API
     * Cria um pedido separado para cada farmácia
     * Valida se cliente tem endereço cadastrado
     */
    aoFinalizarCompra: useCallback(async () => {
      if (processandoPedido) return;

      try {
        setProcessandoPedido(true);

        console.log('[useDadosCarrinho] Finalizando compra...', {
          itens: servico.itens.length,
          total: servico.formatarTotal(),
        });

        // Verificar se cliente tem endereço cadastrado
        if (!enderecoSelecionado) {
          console.log('[useDadosCarrinho] Cliente sem endereço, abrindo modal...');

          // Verificar se tem endereços cadastrados
          const response = await listarEnderecos();

          if (response.enderecos.length === 0) {
            // Não tem endereços, abrir modal para cadastrar
            setProcessandoPedido(false);
            setModalNovoEnderecoVisivel(true);
            return;
          } else {
            // Tem endereços, abrir modal para selecionar
            setProcessandoPedido(false);
            setModalEnderecoVisivel(true);
            return;
          }
        }

        // Processar pedido com endereço já selecionado
        await processarPedido(enderecoSelecionado);
      } catch (error: any) {
        console.error('[useDadosCarrinho] Erro ao finalizar compra:', error);
        showError(error.message || 'Erro ao finalizar pedido. Tente novamente.');
        setProcessandoPedido(false);
      }
    }, [servico, showError, processandoPedido, enderecoSelecionado, processarPedido]),

    /**
     * Selecionar endereço e processar pedido automaticamente
     */
    aoSelecionarEndereco: useCallback(async (endereco: Endereco) => {
      setEnderecoSelecionado(endereco);
      setModalEnderecoVisivel(false);
      // Processar pedido automaticamente após selecionar
      await processarPedido(endereco);
    }, [processarPedido]),

    /**
     * Salvar novo endereço e processar pedido automaticamente
     */
    aoSalvarNovoEndereco: useCallback(async (endereco: Endereco) => {
      setEnderecoSelecionado(endereco);
      setModalNovoEnderecoVisivel(false);
      // Processar pedido automaticamente após cadastrar
      await processarPedido(endereco);
    }, [processarPedido]),

    /**
     * Fechar modal de seleção de endereço
     */
    aoFecharModalEndereco: useCallback(() => {
      setModalEnderecoVisivel(false);
    }, []),

    /**
     * Fechar modal de novo endereço
     */
    aoFecharModalNovoEndereco: useCallback(() => {
      setModalNovoEnderecoVisivel(false);
    }, []),

    /**
     * Começar a comprar (quando carrinho vazio)
     */
    aoIniciarCompras: useCallback(() => {
      router.push('/');
    }, []),

    /**
     * Abrir modal de novo endereço
     */
    aoAbrirNovoEndereco: useCallback(() => {
      setModalEnderecoVisivel(false);
      setModalNovoEnderecoVisivel(true);
    }, []),
  };

  return {
    // Dados
    itens: servico.itens,
    cupomAplicado: servico.cupomAplicado,
    descontoCupom: servico.descontoCupom,
    codigoCupom,
    estaVazio: servico.estaVazio,
    quantidadeTotal: servico.quantidadeTotal,
    processandoPedido,
    carregando,

    // Endereços
    modalEnderecoVisivel,
    modalNovoEnderecoVisivel,
    enderecoSelecionado,

    // Cálculos
    subtotal: servico.formatarSubtotal(),
    desconto: servico.formatarDesconto(),
    taxaEntrega: servico.formatarTaxaEntrega(),
    total: servico.formatarTotal(),

    // Manipuladores
    manipuladores,

    // Serviço (para adicionar itens de fora)
    servico,
  };
};

/**
 * Hook: useAdicionarEstoque
 * Gerencia lógica de adição de produtos ao estoque (ROLE_LOJISTA_ADMIN)
 * Padrão: OOP + Português
 */

import { useState, useCallback, useEffect } from 'react';
import { router } from 'expo-router';
import { useToast } from '@/src/hooks/useToast';
import { addEstoque } from '@/src/servicos/farmacia/farmaciaAdminService';
import { buscarProdutosCatalogo, buscarEstoqueProprio } from '@/src/servicos/estoque/estoqueService';
import { ProdutoCatalogo } from '@/src/servicos/types/api.types';

interface DadosFormulario {
  produtoId: string;
  preco: string;
  quantidade: string;
}

interface ErrosFormulario {
  produtoId: string;
  preco: string;
  quantidade: string;
}

const FORMULARIO_INICIAL: DadosFormulario = {
  produtoId: '',
  preco: '',
  quantidade: '',
};

const ERROS_INICIAL: ErrosFormulario = {
  produtoId: '',
  preco: '',
  quantidade: '',
};

export function useAdicionarEstoque() {
  const { toastState, showSuccess, showError, showWarning, hideToast } = useToast();
  const [carregando, definirCarregando] = useState(false);
  const [carregandoProdutos, definirCarregandoProdutos] = useState(false);
  const [produtos, definirProdutos] = useState<ProdutoCatalogo[]>([]);
  const [produtosJaNoEstoque, definirProdutosJaNoEstoque] = useState<number[]>([]); // IDs dos produtos já no estoque
  const [produtoSelecionado, definirProdutoSelecionado] = useState<ProdutoCatalogo | null>(null);
  const [modalVisivel, definirModalVisivel] = useState(false);
  const [buscaProduto, definirBuscaProduto] = useState('');
  const [dadosFormulario, definirDadosFormulario] = useState<DadosFormulario>(FORMULARIO_INICIAL);
  const [erros, definirErros] = useState<ErrosFormulario>(ERROS_INICIAL);

  /**
   * Carrega produtos do catálogo e estoque ao montar
   */
  useEffect(() => {
    carregarProdutos();
    carregarProdutosDoEstoque();
  }, []);

  /**
   * Carrega produtos do catálogo
   */
  const carregarProdutos = async () => {
    try {
      definirCarregandoProdutos(true);
      const resultado = await buscarProdutosCatalogo(1, 100);
      console.log('[useAdicionarEstoque] Produtos carregados:', resultado.length);
      definirProdutos(resultado);
    } catch (erro) {
      console.error('[useAdicionarEstoque] Erro ao carregar produtos:', erro);
      showError('Não foi possível carregar os produtos do catálogo');
    } finally {
      definirCarregandoProdutos(false);
    }
  };

  /**
   * Carrega produtos que já estão no estoque da farmácia
   */
  const carregarProdutosDoEstoque = async () => {
    try {
      const estoque = await buscarEstoqueProprio('');
      console.log('[useAdicionarEstoque] Estoque completo:', estoque);
      console.log('[useAdicionarEstoque] Primeiro item do estoque:', estoque[0]);

      const idsNoEstoque = estoque.map((item) => item.produtoId);
      console.log('[useAdicionarEstoque] Produtos já no estoque (IDs):', idsNoEstoque);
      console.log('[useAdicionarEstoque] Total de produtos no estoque:', idsNoEstoque.length);

      definirProdutosJaNoEstoque(idsNoEstoque);
    } catch (erro) {
      console.error('[useAdicionarEstoque] Erro ao carregar estoque:', erro);
      // Não mostra erro para o usuário, apenas loga
    }
  };

  /**
   * Filtra produtos baseado na busca E remove produtos que já estão no estoque
   */
  const produtosFiltrados = produtos.filter(p => {
    // Remove produtos que já estão no estoque
    if (produtosJaNoEstoque.includes(p.id)) {
      return false;
    }

    // Aplica filtro de busca
    const busca = buscaProduto.toLowerCase();
    return (
      p.nome.toLowerCase().includes(busca) ||
      p.id.toString().includes(buscaProduto) ||
      p.ean.includes(buscaProduto) ||
      (p.laboratorio && p.laboratorio.toLowerCase().includes(busca)) ||
      (p.principioAtivo && p.principioAtivo.toLowerCase().includes(busca))
    );
  });

  /**
   * Valida formulário completo
   */
  const validarFormulario = useCallback((): boolean => {
    const novosErros: ErrosFormulario = { ...ERROS_INICIAL };
    let valido = true;

    // Validar Produto Selecionado
    if (!produtoSelecionado) {
      novosErros.produtoId = 'Selecione um produto do catálogo';
      valido = false;
    }

    // Validar Preço
    if (!dadosFormulario.preco.trim()) {
      novosErros.preco = 'Preço é obrigatório';
      valido = false;
    } else if (isNaN(Number(dadosFormulario.preco)) || Number(dadosFormulario.preco) <= 0) {
      novosErros.preco = 'Preço deve ser um número válido maior que zero';
      valido = false;
    }

    // Validar Quantidade
    if (!dadosFormulario.quantidade.trim()) {
      novosErros.quantidade = 'Quantidade é obrigatória';
      valido = false;
    } else if (isNaN(Number(dadosFormulario.quantidade)) || Number(dadosFormulario.quantidade) <= 0) {
      novosErros.quantidade = 'Quantidade deve ser um número válido maior que zero';
      valido = false;
    }

    definirErros(novosErros);
    return valido;
  }, [dadosFormulario, produtoSelecionado]);

  /**
   * Limpa formulário
   */
  const limparFormulario = useCallback(() => {
    definirDadosFormulario(FORMULARIO_INICIAL);
    definirErros(ERROS_INICIAL);
    definirProdutoSelecionado(null);
  }, []);

  /**
   * Handlers agrupados
   */
  const manipuladores = {
    /**
     * Altera campo do formulário
     */
    aoAlterarCampo: useCallback((campo: keyof DadosFormulario, valor: string) => {
      definirDadosFormulario(prev => ({ ...prev, [campo]: valor }));

      // Limpa erro do campo
      if (erros[campo]) {
        definirErros(prev => ({ ...prev, [campo]: '' }));
      }
    }, [erros]),

    /**
     * Seleciona produto do catálogo
     */
    aoSelecionarProduto: useCallback((produto: ProdutoCatalogo) => {
      definirProdutoSelecionado(produto);
      definirDadosFormulario(prev => ({ ...prev, produtoId: produto.id.toString() }));
      definirModalVisivel(false);
      definirErros(prev => ({ ...prev, produtoId: '' }));
    }, []),

    /**
     * Abre modal de seleção
     */
    aoAbrirModal: useCallback(() => {
      definirModalVisivel(true);
    }, []),

    /**
     * Fecha modal de seleção
     */
    aoFecharModal: useCallback(() => {
      definirModalVisivel(false);
    }, []),

    /**
     * Altera busca de produto
     */
    aoAlterarBusca: useCallback((texto: string) => {
      definirBuscaProduto(texto);
    }, []),

    /**
     * Submete formulário
     */
    aoSubmeter: useCallback(async () => {
      console.log('[useAdicionarEstoque] Submetendo formulário');
      console.log('[useAdicionarEstoque] Dados:', dadosFormulario);
      console.log('[useAdicionarEstoque] Produto selecionado:', produtoSelecionado);

      if (!validarFormulario()) {
        console.log('[useAdicionarEstoque] Validação falhou');
        showError('Por favor, corrija os campos marcados em vermelho.');
        return;
      }

      console.log('[useAdicionarEstoque] Validação OK, iniciando requisição...');
      definirCarregando(true);

      try {
        const resposta = await addEstoque({
          produtoId: Number(dadosFormulario.produtoId),
          preco: Number(dadosFormulario.preco),
          quantidade: Number(dadosFormulario.quantidade),
        });

        console.log('[useAdicionarEstoque] Produto adicionado com sucesso:', resposta);

        // Toast de sucesso
        showSuccess(`${produtoSelecionado?.nome || 'Produto'} adicionado ao estoque com sucesso!`);

        // Limpar formulário após sucesso
        setTimeout(() => {
          limparFormulario();
        }, 500);
      } catch (erro: any) {
        console.error('[useAdicionarEstoque] Erro ao adicionar produto:', erro);

        // Identifica o tipo de erro e mostra mensagem apropriada
        const mensagemErro = erro.response?.data?.message || erro.message || '';
        const codigoStatus = erro.response?.status;

        // Produto duplicado (409 - ConflictException ou 403 - ForbiddenException)
        if ((codigoStatus === 409 || codigoStatus === 403) && mensagemErro.includes('já existe no seu estoque')) {
          showWarning(`${produtoSelecionado?.nome || 'Produto'} já está no seu estoque. Use a opção "Editar" no estoque para alterar preço ou quantidade.`);
          return;
        }

        // Produto não encontrado (404 - ResourceNotFoundException)
        if (codigoStatus === 404 || mensagemErro.includes('não encontrado')) {
          showError(`Produto com ID ${dadosFormulario.produtoId} não encontrado no catálogo.`);
          definirProdutoSelecionado(null);
          definirDadosFormulario(prev => ({ ...prev, produtoId: '' }));
          return;
        }

        // Erro de validação (400)
        if (codigoStatus === 400) {
          showError(mensagemErro || 'Dados inválidos. Verifique o preço e quantidade.');
          return;
        }

        // Erro genérico
        showError(mensagemErro || 'Não foi possível adicionar o produto. Tente novamente.');
      } finally {
        definirCarregando(false);
      }
    }, [validarFormulario, dadosFormulario, produtoSelecionado, limparFormulario, showSuccess, showError, showWarning]),

    /**
     * Volta para tela anterior
     */
    aoVoltar: useCallback(() => {
      router.back();
    }, []),
  };

  return {
    // Estados
    carregando,
    carregandoProdutos,
    produtos,
    produtoSelecionado,
    modalVisivel,
    buscaProduto,
    dadosFormulario,
    erros,
    produtosFiltrados,

    // Toast
    toastState,
    hideToast,

    // Handlers
    manipuladores,
  };
}

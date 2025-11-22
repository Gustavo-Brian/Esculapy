/**
 * Hook compartilhado: useAuth
 * Gerencia autenticação do usuário
 * IMPORTANTE: Usa storage unificado (storage.ts)
 */

import { useState, useEffect, useCallback } from 'react';
import { getToken, getUserData, saveToken, saveUserData, clearAuthData } from '@/src/servicos/auth/storage';

interface DadosUsuario {
  id: number;
  email: string;
  nome?: string;
  tipo?: 'cliente' | 'farmacia';
}

export function useAuth() {
  const [usuario, definirUsuario] = useState<DadosUsuario | null>(null);
  const [token, definirToken] = useState<string | null>(null);
  const [carregando, definirCarregando] = useState(true);

  /**
   * Carrega dados do usuário do AsyncStorage
   */
  useEffect(() => {
    carregarDadosUsuario();
  }, []);

  const carregarDadosUsuario = async () => {
    try {
      definirCarregando(true);
      console.log('[useAuth] Carregando dados do storage...');

      const [tokenArmazenado, dadosUsuarioArmazenados] = await Promise.all([
        getToken(),      // Usa storage unificado
        getUserData(),   // Usa storage unificado
      ]);

      if (tokenArmazenado && dadosUsuarioArmazenados) {
        definirToken(tokenArmazenado);
        definirUsuario(dadosUsuarioArmazenados);
        console.log('[useAuth] ✅ Dados carregados:', { email: dadosUsuarioArmazenados.email });
      } else {
        console.log('[useAuth] ⚠️ Nenhum dado encontrado no storage');
      }
    } catch (erro) {
      console.error('[useAuth] ❌ Erro ao carregar dados:', erro);
    } finally {
      definirCarregando(false);
    }
  };

  /**
   * Faz login do usuário
   * IMPORTANTE: Limpa sessão anterior antes de fazer login
   */
  const login = useCallback(async (novoToken: string, dadosUsuario: DadosUsuario) => {
    try {
      console.log('[useAuth] Fazendo login...');

      // CRÍTICO: Limpa dados antigos antes de salvar novos
      await clearAuthData();

      await Promise.all([
        saveToken(novoToken),              // Usa storage unificado
        saveUserData(dadosUsuario),        // Usa storage unificado
      ]);

      definirToken(novoToken);
      definirUsuario(dadosUsuario);

      console.log('[useAuth] ✅ Login concluído');
    } catch (erro) {
      console.error('[useAuth] ❌ Erro ao fazer login:', erro);
      throw erro;
    }
  }, []);

  /**
   * Faz logout do usuário
   * IMPORTANTE: Usa clearAuthData para limpar TUDO
   */
  const logout = useCallback(async () => {
    try {
      console.log('[useAuth] Fazendo logout...');

      await clearAuthData(); // Limpa TUDO (storage unificado)

      definirToken(null);
      definirUsuario(null);

      console.log('[useAuth] ✅ Logout concluído');
    } catch (erro) {
      console.error('[useAuth] ❌ Erro ao fazer logout:', erro);
      throw erro;
    }
  }, []);

  /**
   * Atualiza dados do usuário
   */
  const atualizarUsuario = useCallback(async (novosDados: Partial<DadosUsuario>) => {
    if (!usuario) return;

    const dadosAtualizados = { ...usuario, ...novosDados };

    try {
      await saveUserData(dadosAtualizados); // Usa storage unificado
      definirUsuario(dadosAtualizados);
      console.log('[useAuth] ✅ Usuário atualizado');
    } catch (erro) {
      console.error('[useAuth] ❌ Erro ao atualizar usuário:', erro);
      throw erro;
    }
  }, [usuario]);

  /**
   * Registra uma nova farmácia
   */
  const registerFarmacia = useCallback(async (dadosFarmacia: any) => {
    try {
      definirCarregando(true);

      console.log('[useAuth] Registrando farmácia:', dadosFarmacia);

      // TODO: Quando backend implementar:
      // const resposta = await apiPost('/api/farmacias/registrar', dadosFarmacia);
      // const { token, farmacia } = resposta;
      // await login(token, { id: farmacia.id, email: farmacia.email, tipo: 'farmacia' });

      // Por enquanto, simula sucesso
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log('[useAuth] Farmácia registrada com sucesso!');

      // Simula login automático
      const mockToken = 'mock-token-' + Date.now();
      await login(mockToken, {
        id: Date.now(),
        email: dadosFarmacia.email,
        nome: dadosFarmacia.nomeFantasia,
        tipo: 'farmacia',
      });

      return true;
    } catch (erro: any) {
      console.error('[useAuth] Erro ao registrar farmácia:', erro);
      throw new Error(erro.message || 'Erro ao registrar farmácia');
    } finally {
      definirCarregando(false);
    }
  }, [login]);

  return {
    // Nomenclatura em Português (padrão OOP)
    usuario,
    token,
    carregando,
    estaAutenticado: !!token && !!usuario,
    login,
    logout,
    atualizarUsuario,
    registerFarmacia,

    // Aliases para compatibilidade com código legado (inglês)
    user: usuario ? {
      ...usuario,
      id: usuario.id,
      email: usuario.email,
      name: usuario.nome || '',
      phone: '', // TODO: adicionar phone ao DadosUsuario
    } : null,
    loading: carregando,
    authenticated: !!token && !!usuario,
    updateUser: atualizarUsuario,
  };
}

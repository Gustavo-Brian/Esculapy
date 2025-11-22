/**
 * Hook compartilhado: useRole
 * Gerencia papel/role do usuário (cliente ou farmácia)
 * IMPORTANTE: Usa useAuth como fonte única de verdade
 */

import { useMemo } from 'react';
import { useAuth } from './useAuth';

type TipoRole = 'cliente' | 'farmacia' | null;

export function useRole() {
  // Usa useAuth como fonte única de verdade
  const { usuario, carregando } = useAuth();

  /**
   * Deriva role do usuario.role (vindo do backend)
   * Sempre sincronizado com useAuth
   */
  const role = useMemo<TipoRole>(() => {
    if (!usuario || !usuario.role) return null;

    // Converte ROLE_* do backend para tipo simples
    if (usuario.role === 'ROLE_LOJISTA_ADMIN' || usuario.role === 'ROLE_FARMACEUTICO') {
      return 'farmacia';
    }
    if (usuario.role === 'ROLE_CLIENTE') {
      return 'cliente';
    }
    return null;
  }, [usuario]);

  /**
   * Verifica se é cliente
   */
  const eCliente = useMemo(() => role === 'cliente', [role]);

  /**
   * Verifica se é farmácia (ROLE_LOJISTA_ADMIN ou ROLE_FARMACEUTICO)
   */
  const eFarmacia = useMemo(() => role === 'farmacia', [role]);

  /**
   * Verifica se pode gerenciar farmácia (ROLE_LOJISTA_ADMIN ou ROLE_FARMACEUTICO)
   */
  const canManageFarmacia = () => {
    if (!usuario || !usuario.role) return false;
    return usuario.role === 'ROLE_LOJISTA_ADMIN' || usuario.role === 'ROLE_FARMACEUTICO';
  };

  return {
    role,
    carregando,
    eCliente,
    eFarmacia,
    canManageFarmacia,
  };
}

/**
 * Tipos de Ações Rápidas do Dashboard
 */

import { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type IconName = ComponentProps<typeof Ionicons>['name'];

export interface AcaoRapida {
  id: string;
  titulo: string;
  icone: IconName;
  cor: string;
  onPress: () => void;
  badge?: number;
}

export type TipoAcao =
  | 'adicionar_estoque'
  | 'cadastrar_farmaceutico'
  | 'gerenciar_estoque'
  | 'validar_receitas'
  | 'relatorios'
  | 'configuracoes';

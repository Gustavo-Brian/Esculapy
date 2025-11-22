/**
 * Tipos de Alertas do Dashboard
 */

export type TipoAlerta = 'estoque_baixo' | 'esgotado' | 'recente' | 'vendas' | 'aguardando_pagamento' | 'aguardando_receita' | 'em_preparacao' | 'pronto_para_entrega' | 'em_transporte';

export type NivelAlerta = 'info' | 'warning' | 'error' | 'success';

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  nivel: NivelAlerta;
  titulo: string;
  mensagem: string;
  data: Date;
  produtoId?: number;
  produtoNome?: string;
  quantidade?: number;
}

export interface ConfiguracaoAlertas {
  limiteEstoqueBaixo: number;
  mostrarAlertasRecentes: boolean;
  diasRecentes: number;
}

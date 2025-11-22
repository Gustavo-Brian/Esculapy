/**
 * Tipos de Vendas e Estatísticas
 */

export interface DadoVendaDiaria {
  dia: string;
  valor: number;
  quantidade: number;
}

export interface EstatisticasVendas {
  vendas7Dias: DadoVendaDiaria[];
  totalSemana: number;
  variacao: number; // Percentual de variação em relação à semana anterior
  maiorVenda: number;
  totalPedidos: number;
}

export interface ResumoVendas {
  hoje: number;
  semana: number;
  mes: number;
  totalPedidos: number;
}

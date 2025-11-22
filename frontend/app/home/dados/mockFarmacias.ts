/**
 * Mock Data: Farmácias
 * Dados de exemplo para desenvolvimento e testes
 */

import { Farmacia } from '../tipos/Farmacia';

/**
 * Lista de farmácias mock para desenvolvimento
 * Usado quando a API não está disponível
 */
export const FARMACIAS_MOCK_DATA = [
  {
    id: 1,
    nome: 'Farmácia Central',
    endereco: 'Rua das Flores, 123 - Centro, São Paulo/SP',
    avaliacao: 4.8,
    aberta: true,
    distancia: 1.2,
    tempoEntrega: '20-30 min',
    horarioAbertura: '08:00',
    horarioFechamento: '22:00',
  },
  {
    id: 2,
    nome: 'Drogaria São Paulo',
    endereco: 'Av. Paulista, 1500 - Bela Vista, São Paulo/SP',
    avaliacao: 4.6,
    aberta: true,
    distancia: 2.5,
    tempoEntrega: '30-45 min',
    horarioAbertura: '07:00',
    horarioFechamento: '23:00',
  },
  {
    id: 3,
    nome: 'Farmácia Popular',
    endereco: 'Rua Augusta, 456 - Consolação, São Paulo/SP',
    avaliacao: 4.9,
    aberta: false,
    distancia: 0.8,
    tempoEntrega: '15-25 min',
    horarioAbertura: '09:00',
    horarioFechamento: '20:00',
  },
  {
    id: 4,
    nome: 'Drogasil',
    endereco: 'Rua Oscar Freire, 789 - Jardins, São Paulo/SP',
    avaliacao: 4.7,
    aberta: true,
    distancia: 3.1,
    tempoEntrega: '35-50 min',
    horarioAbertura: '08:00',
    horarioFechamento: '22:00',
  },
  {
    id: 5,
    nome: 'Farmácia do Bairro',
    endereco: 'Rua da Consolação, 234 - Consolação, São Paulo/SP',
    avaliacao: 4.5,
    aberta: true,
    distancia: 0.5,
    tempoEntrega: '10-20 min',
    horarioAbertura: '08:00',
    horarioFechamento: '21:00',
  },
];

/**
 * Retorna lista de farmácias mock como instâncias da classe Farmacia
 */
export function obterFarmaciasMock(): Farmacia[] {
  return FARMACIAS_MOCK_DATA.map(f => Farmacia.deAPI(f));
}

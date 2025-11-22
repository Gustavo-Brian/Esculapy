/**
 * Service de Farmacêuticos - Esculapi
 * Gerencia operações relacionadas aos farmacêuticos da farmácia
 */

import { apiGet, apiPost } from '../api/config';
import { FARMACIA_ADMIN_ENDPOINTS } from '../api/endpoints';
import { RegisterFarmaceuticoRequest, Farmaceutico } from '../types/api.types';
import { listFarmaceuticos as listFarmaceuticosService } from '../farmacia/farmaciaAdminService';

/**
 * Lista todos os farmacêuticos da farmácia
 * Endpoint: GET /api/farmacia-admin/farmaceuticos
 */
export const listarFarmaceuticos = async (): Promise<Farmaceutico[]> => {
  console.log('[FarmaceuticoService] Buscando lista de farmacêuticos...');
  return await listFarmaceuticosService();
};

/**
 * Cadastra um novo farmacêutico na farmácia
 * Endpoint: POST /api/farmacia-admin/farmaceuticos
 */
export const adicionarFarmaceutico = async (
  request: RegisterFarmaceuticoRequest
): Promise<Farmaceutico> => {
  return await apiPost<Farmaceutico>(FARMACIA_ADMIN_ENDPOINTS.ADD_FARMACEUTICO, request);
};

/**
 * Valida CPF (formato básico)
 */
export const validarCPF = (cpf: string): boolean => {
  // Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, '');

  // Deve ter 11 dígitos
  if (cpfLimpo.length !== 11) return false;

  // Verifica se não são todos dígitos iguais (ex: 111.111.111-11)
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

  return true;
};

/**
 * Valida CRF (formato básico - apenas verifica se não está vazio)
 */
export const validarCRF = (crf: string): boolean => {
  const crfLimpo = crf.trim();
  return crfLimpo.length >= 3;
};

/**
 * Formata CPF para exibição (000.000.000-00)
 */
export const formatarCPF = (cpf: string): string => {
  const cpfLimpo = cpf.replace(/\D/g, '');
  if (cpfLimpo.length !== 11) return cpf;

  return cpfLimpo.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

/**
 * Valida email
 */
export const validarEmail = (email: string): boolean => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

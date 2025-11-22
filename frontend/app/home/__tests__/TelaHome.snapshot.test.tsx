/**
 * Testes Simples de Snapshot - Componentes Home
 * Testes básicos e rápidos de renderização
 */

import React from 'react';
import { render } from '@testing-library/react-native';
import { BarraBusca } from '../componentes/BarraBusca';

describe('Componentes Home - Testes Simples', () => {
  describe('BarraBusca', () => {
    it('renderiza sem erros', () => {
      const result = render(
        <BarraBusca
          valor=""
          aoMudar={jest.fn()}
          aoEnviar={jest.fn()}
        />
      );
      expect(result).toBeTruthy();
    });

    it('snapshot do componente', () => {
      const { toJSON } = render(
        <BarraBusca
          valor=""
          aoMudar={jest.fn()}
          aoEnviar={jest.fn()}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });

    it('exibe placeholder de busca', () => {
      const { getByPlaceholderText } = render(
        <BarraBusca
          valor=""
          aoMudar={jest.fn()}
          aoEnviar={jest.fn()}
        />
      );
      expect(getByPlaceholderText(/buscar/i)).toBeTruthy();
    });

    it('renderiza com valor preenchido', () => {
      const { toJSON } = render(
        <BarraBusca
          valor="dipirona"
          aoMudar={jest.fn()}
          aoEnviar={jest.fn()}
        />
      );
      expect(toJSON()).toMatchSnapshot();
    });
  });
});

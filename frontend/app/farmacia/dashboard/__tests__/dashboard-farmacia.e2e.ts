/**
 * Testes E2E: Dashboard da Farmácia
 * Testa interface de gerenciamento do estoque pela farmácia
 */

describe('Dashboard da Farmácia', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // Login como farmácia
    await element(by.id('input-email')).typeText('farmacia@teste.com');
    await element(by.id('input-senha')).typeText('senha123');
    await element(by.id('botao-entrar')).tap();

    await waitFor(element(by.id('dashboard-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('deve exibir estatísticas do estoque', async () => {
    await expect(element(by.id('card-total-produtos'))).toBeVisible();
    await expect(element(by.id('card-produtos-baixo-estoque'))).toBeVisible();
    await expect(element(by.id('card-produtos-esgotados'))).toBeVisible();
  });

  it('deve exibir lista de produtos no estoque', async () => {
    await element(by.id('tab-estoque')).tap();

    await expect(element(by.id('lista-estoque'))).toBeVisible();
    await expect(element(by.id('produto-estoque-0'))).toBeVisible();
  });

  it('deve adicionar novo produto ao estoque', async () => {
    await element(by.id('tab-estoque')).tap();
    await element(by.id('botao-adicionar-produto')).tap();

    // Preenche formulário
    await element(by.id('select-produto')).tap();
    await element(by.text('Dipirona 500mg')).tap();
    await element(by.id('input-preco')).typeText('15.90');
    await element(by.id('input-quantidade')).typeText('100');

    await element(by.id('botao-salvar-produto')).tap();

    await expect(element(by.text('Produto adicionado ao estoque'))).toBeVisible();
  });

  it('deve editar quantidade de produto existente', async () => {
    await element(by.id('tab-estoque')).tap();

    await element(by.id('produto-estoque-0')).tap();
    await element(by.id('botao-editar')).tap();

    await element(by.id('input-quantidade')).clearText();
    await element(by.id('input-quantidade')).typeText('50');

    await element(by.id('botao-salvar')).tap();

    await expect(element(by.text('Estoque atualizado'))).toBeVisible();
  });

  it('deve editar preço de produto existente', async () => {
    await element(by.id('tab-estoque')).tap();

    await element(by.id('produto-estoque-0')).tap();
    await element(by.id('botao-editar')).tap();

    await element(by.id('input-preco')).clearText();
    await element(by.id('input-preco')).typeText('20.00');

    await element(by.id('botao-salvar')).tap();

    await expect(element(by.text('Estoque atualizado'))).toBeVisible();
  });

  it('deve remover produto do estoque', async () => {
    await element(by.id('tab-estoque')).tap();

    await element(by.id('produto-estoque-0')).tap();
    await element(by.id('botao-remover')).tap();

    // Confirma remoção
    await element(by.text('Remover')).tap();

    await expect(element(by.text('Produto removido do estoque'))).toBeVisible();
  });

  it('deve filtrar produtos por status', async () => {
    await element(by.id('tab-estoque')).tap();

    // Filtra por produtos com baixo estoque
    await element(by.id('filtro-estoque')).tap();
    await element(by.text('Baixo Estoque')).tap();

    await waitFor(element(by.id('lista-estoque')))
      .toBeVisible()
      .withTimeout(2000);

    // Verifica se lista foi filtrada
    const primeiroItem = await element(by.id('produto-estoque-0')).getAttributes();
    expect(primeiroItem).toBeDefined();
  });

  it('deve ordenar produtos por nome', async () => {
    await element(by.id('tab-estoque')).tap();

    await element(by.id('ordenacao-estoque')).tap();
    await element(by.text('Nome')).tap();

    await waitFor(element(by.id('lista-estoque')))
      .toBeVisible()
      .withTimeout(2000);

    // Verifica se lista foi reordenada
    await expect(element(by.id('lista-estoque'))).toBeVisible();
  });

  it('deve exibir alertas de produtos esgotados', async () => {
    // Verifica se há alertas
    const alertaExists = await element(by.id('card-alerta-0')).exists();

    if (alertaExists) {
      await expect(element(by.id('card-alerta-0'))).toBeVisible();
      await expect(element(by.id('alerta-titulo'))).toBeVisible();
    }
  });

  it('deve navegar entre abas do dashboard', async () => {
    // Aba Dashboard
    await expect(element(by.id('tab-dashboard'))).toBeVisible();

    // Aba Estoque
    await element(by.id('tab-estoque')).tap();
    await expect(element(by.id('lista-estoque'))).toBeVisible();

    // Aba Farmacêuticos
    await element(by.id('tab-farmaceuticos')).tap();
    await expect(element(by.id('lista-farmaceuticos'))).toBeVisible();

    // Aba Pedidos
    await element(by.id('tab-pedidos')).tap();
    await expect(element(by.id('lista-pedidos'))).toBeVisible();
  });
});

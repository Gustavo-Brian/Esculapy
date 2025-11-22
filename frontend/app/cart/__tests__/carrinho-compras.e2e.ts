/**
 * Testes E2E: Carrinho de Compras
 * Testa o fluxo completo de adicionar produtos ao carrinho e finalizar compra
 */

describe('Carrinho de Compras', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // Login
    await element(by.id('input-email')).typeText('johnr@gmail.com');
    await element(by.id('input-senha')).typeText('senha123');
    await element(by.id('botao-entrar')).tap();

    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('deve adicionar produto ao carrinho', async () => {
    // Busca e seleciona produto
    await element(by.id('input-busca')).typeText('Dipirona');
    await element(by.id('botao-buscar')).tap();

    await waitFor(element(by.id('produto-card-0')))
      .toBeVisible()
      .withTimeout(3000);

    await element(by.id('produto-card-0')).tap();

    // Adiciona ao carrinho
    await element(by.id('botao-adicionar-carrinho')).tap();

    await expect(element(by.text('Produto adicionado ao carrinho'))).toBeVisible();
  });

  it('deve atualizar contador do carrinho', async () => {
    // Adiciona produto
    await element(by.id('input-busca')).typeText('Dipirona');
    await element(by.id('botao-buscar')).tap();
    await waitFor(element(by.id('produto-card-0'))).toBeVisible().withTimeout(3000);
    await element(by.id('produto-card-0')).tap();
    await element(by.id('botao-adicionar-carrinho')).tap();

    // Verifica badge do carrinho
    await expect(element(by.id('carrinho-badge'))).toHaveText('1');
  });

  it('deve exibir lista de produtos no carrinho', async () => {
    // Adiciona produto
    await element(by.id('input-busca')).typeText('Dipirona');
    await element(by.id('botao-buscar')).tap();
    await waitFor(element(by.id('produto-card-0'))).toBeVisible().withTimeout(3000);
    await element(by.id('produto-card-0')).tap();
    await element(by.id('botao-adicionar-carrinho')).tap();

    // Abre carrinho
    await element(by.id('botao-carrinho')).tap();

    await expect(element(by.id('carrinho-screen'))).toBeVisible();
    await expect(element(by.id('item-carrinho-0'))).toBeVisible();
  });

  it('deve incrementar quantidade de produto', async () => {
    // Adiciona produto e abre carrinho
    await element(by.id('input-busca')).typeText('Dipirona');
    await element(by.id('botao-buscar')).tap();
    await waitFor(element(by.id('produto-card-0'))).toBeVisible().withTimeout(3000);
    await element(by.id('produto-card-0')).tap();
    await element(by.id('botao-adicionar-carrinho')).tap();
    await element(by.id('botao-carrinho')).tap();

    // Incrementa quantidade
    const quantidadeInicial = await element(by.id('quantidade-item-0')).getText();
    await element(by.id('botao-incrementar-0')).tap();
    const quantidadeFinal = await element(by.id('quantidade-item-0')).getText();

    expect(Number(quantidadeFinal)).toBe(Number(quantidadeInicial) + 1);
  });

  it('deve decrementar quantidade de produto', async () => {
    // Adiciona 2 unidades do produto
    await element(by.id('input-busca')).typeText('Dipirona');
    await element(by.id('botao-buscar')).tap();
    await waitFor(element(by.id('produto-card-0'))).toBeVisible().withTimeout(3000);
    await element(by.id('produto-card-0')).tap();
    await element(by.id('input-quantidade')).replaceText('2');
    await element(by.id('botao-adicionar-carrinho')).tap();
    await element(by.id('botao-carrinho')).tap();

    // Decrementa quantidade
    await element(by.id('botao-decrementar-0')).tap();

    await expect(element(by.id('quantidade-item-0'))).toHaveText('1');
  });

  it('deve remover produto do carrinho', async () => {
    // Adiciona produto
    await element(by.id('input-busca')).typeText('Dipirona');
    await element(by.id('botao-buscar')).tap();
    await waitFor(element(by.id('produto-card-0'))).toBeVisible().withTimeout(3000);
    await element(by.id('produto-card-0')).tap();
    await element(by.id('botao-adicionar-carrinho')).tap();
    await element(by.id('botao-carrinho')).tap();

    // Remove produto
    await element(by.id('botao-remover-0')).tap();

    await expect(element(by.text('Carrinho vazio'))).toBeVisible();
  });

  it('deve calcular total do carrinho corretamente', async () => {
    // Adiciona produtos
    await element(by.id('input-busca')).typeText('Dipirona');
    await element(by.id('botao-buscar')).tap();
    await waitFor(element(by.id('produto-card-0'))).toBeVisible().withTimeout(3000);
    await element(by.id('produto-card-0')).tap();

    const precoTexto = await element(by.id('produto-preco')).getText();
    const preco = parseFloat(precoTexto.replace('R$', '').replace(',', '.').trim());

    await element(by.id('input-quantidade')).replaceText('2');
    await element(by.id('botao-adicionar-carrinho')).tap();
    await element(by.id('botao-carrinho')).tap();

    const totalEsperado = (preco * 2).toFixed(2).replace('.', ',');
    await expect(element(by.id('total-carrinho'))).toHaveText(`R$ ${totalEsperado}`);
  });

  it('deve navegar para checkout', async () => {
    // Adiciona produto
    await element(by.id('input-busca')).typeText('Dipirona');
    await element(by.id('botao-buscar')).tap();
    await waitFor(element(by.id('produto-card-0'))).toBeVisible().withTimeout(3000);
    await element(by.id('produto-card-0')).tap();
    await element(by.id('botao-adicionar-carrinho')).tap();
    await element(by.id('botao-carrinho')).tap();

    // Vai para checkout
    await element(by.id('botao-finalizar-compra')).tap();

    await expect(element(by.id('checkout-screen'))).toBeVisible();
  });

  it('deve mostrar carrinho vazio quando não há produtos', async () => {
    await element(by.id('botao-carrinho')).tap();

    await expect(element(by.text('Seu carrinho está vazio'))).toBeVisible();
    await expect(element(by.id('botao-continuar-comprando'))).toBeVisible();
  });

  it('deve continuar comprando ao clicar no botão', async () => {
    await element(by.id('botao-carrinho')).tap();
    await element(by.id('botao-continuar-comprando')).tap();

    await expect(element(by.id('home-screen'))).toBeVisible();
  });
});

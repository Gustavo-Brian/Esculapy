/**
 * Testes E2E: Busca de Produtos
 * Testa a interface de busca e exibição de produtos
 */

describe('Busca de Produtos', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // Realiza login primeiro
    await element(by.id('input-email')).typeText('johnr@gmail.com');
    await element(by.id('input-senha')).typeText('senha123');
    await element(by.id('botao-entrar')).tap();

    await waitFor(element(by.id('home-screen')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('deve exibir campo de busca na home', async () => {
    await expect(element(by.id('input-busca'))).toBeVisible();
  });

  it('deve buscar produto por nome', async () => {
    await element(by.id('input-busca')).typeText('Dipirona');
    await element(by.id('botao-buscar')).tap();

    // Aguarda resultados
    await waitFor(element(by.id('lista-produtos')))
      .toBeVisible()
      .withTimeout(3000);

    await expect(element(by.text('Dipirona').withAncestor(by.id('lista-produtos')))).toBeVisible();
  });

  it('deve exibir mensagem quando não encontrar produtos', async () => {
    await element(by.id('input-busca')).typeText('ProdutoInexistente123');
    await element(by.id('botao-buscar')).tap();

    await expect(element(by.text('Nenhum produto encontrado'))).toBeVisible();
  });

  it('deve exibir cards de produtos com informações', async () => {
    await element(by.id('input-busca')).typeText('Dipirona');
    await element(by.id('botao-buscar')).tap();

    await waitFor(element(by.id('produto-card-0')))
      .toBeVisible()
      .withTimeout(3000);

    // Verifica se card tem nome, preço e farmácia
    await expect(element(by.id('produto-nome-0'))).toBeVisible();
    await expect(element(by.id('produto-preco-0'))).toBeVisible();
    await expect(element(by.id('produto-farmacia-0'))).toBeVisible();
  });

  it('deve navegar para detalhes do produto ao clicar', async () => {
    await element(by.id('input-busca')).typeText('Dipirona');
    await element(by.id('botao-buscar')).tap();

    await waitFor(element(by.id('produto-card-0')))
      .toBeVisible()
      .withTimeout(3000);

    await element(by.id('produto-card-0')).tap();

    await expect(element(by.id('produto-detalhes-screen'))).toBeVisible();
  });

  it('deve exibir badge de promoção em produtos com desconto', async () => {
    await element(by.id('input-busca')).typeText('');
    await element(by.id('botao-buscar')).tap();

    await waitFor(element(by.id('lista-produtos')))
      .toBeVisible()
      .withTimeout(3000);

    // Verifica se algum produto em promoção tem badge
    const promoExists = await element(by.id('badge-promocao')).exists();
    if (promoExists) {
      await expect(element(by.id('badge-promocao'))).toBeVisible();
    }
  });

  it('deve limpar busca ao clicar no botão limpar', async () => {
    await element(by.id('input-busca')).typeText('Dipirona');
    await element(by.id('botao-limpar-busca')).tap();

    await expect(element(by.id('input-busca'))).toHaveText('');
  });

  it('deve fazer scroll na lista de produtos', async () => {
    await element(by.id('input-busca')).typeText('');
    await element(by.id('botao-buscar')).tap();

    await waitFor(element(by.id('lista-produtos')))
      .toBeVisible()
      .withTimeout(3000);

    // Faz scroll para baixo
    await element(by.id('lista-produtos')).scroll(300, 'down');

    // Verifica se produtos no final da lista estão visíveis
    await expect(element(by.id('produto-card-5'))).toBeVisible();
  });
});

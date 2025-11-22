/**
 * Testes E2E: Fluxo de Cadastro
 * Testa a interface e processo de registro de novo usuário
 */

describe('Fluxo de Cadastro', () => {
  beforeAll(async () => {
    await device.launchApp();
  });

  beforeEach(async () => {
    await device.reloadReactNative();
    // Navega para tela de cadastro
    await element(by.id('link-cadastro')).tap();
  });

  it('deve exibir formulário de cadastro completo', async () => {
    await expect(element(by.id('input-nome'))).toBeVisible();
    await expect(element(by.id('input-email'))).toBeVisible();
    await expect(element(by.id('input-cpf'))).toBeVisible();
    await expect(element(by.id('input-telefone'))).toBeVisible();
    await expect(element(by.id('input-senha'))).toBeVisible();
    await expect(element(by.id('input-confirmar-senha'))).toBeVisible();
    await expect(element(by.id('botao-cadastrar'))).toBeVisible();
  });

  it('deve validar campos obrigatórios', async () => {
    await element(by.id('botao-cadastrar')).tap();

    await expect(element(by.text('O nome é obrigatório'))).toBeVisible();
    await expect(element(by.text('O email é obrigatório'))).toBeVisible();
  });

  it('deve validar formato de email', async () => {
    await element(by.id('input-email')).typeText('emailinvalido');
    await element(by.id('botao-cadastrar')).tap();

    await expect(element(by.text('Email inválido'))).toBeVisible();
  });

  it('deve validar confirmação de senha', async () => {
    await element(by.id('input-senha')).typeText('senha123');
    await element(by.id('input-confirmar-senha')).typeText('senha456');
    await element(by.id('botao-cadastrar')).tap();

    await expect(element(by.text('As senhas não coincidem'))).toBeVisible();
  });

  it('deve formatar CPF automaticamente', async () => {
    await element(by.id('input-cpf')).typeText('12345678901');

    await expect(element(by.id('input-cpf'))).toHaveText('123.456.789-01');
  });

  it('deve formatar telefone automaticamente', async () => {
    await element(by.id('input-telefone')).typeText('11987654321');

    await expect(element(by.id('input-telefone'))).toHaveText('(11) 98765-4321');
  });

  it('deve realizar cadastro com dados válidos', async () => {
    await element(by.id('input-nome')).typeText('João Silva');
    await element(by.id('input-email')).typeText('joao.silva@teste.com');
    await element(by.id('input-cpf')).typeText('12345678901');
    await element(by.id('input-telefone')).typeText('11987654321');
    await element(by.id('input-senha')).typeText('senha123');
    await element(by.id('input-confirmar-senha')).typeText('senha123');

    await element(by.id('botao-cadastrar')).tap();

    // Aguarda mensagem de sucesso
    await waitFor(element(by.text('Cadastro realizado com sucesso')))
      .toBeVisible()
      .withTimeout(5000);
  });

  it('deve mostrar erro ao cadastrar email duplicado', async () => {
    await element(by.id('input-nome')).typeText('João Silva');
    await element(by.id('input-email')).typeText('johnr@gmail.com'); // Email já existente
    await element(by.id('input-cpf')).typeText('12345678901');
    await element(by.id('input-telefone')).typeText('11987654321');
    await element(by.id('input-senha')).typeText('senha123');
    await element(by.id('input-confirmar-senha')).typeText('senha123');

    await element(by.id('botao-cadastrar')).tap();

    await expect(element(by.text('Email já cadastrado'))).toBeVisible();
  });

  it('deve permitir voltar para tela de login', async () => {
    await element(by.id('link-voltar-login')).tap();

    await expect(element(by.id('login-screen'))).toBeVisible();
  });

  it('deve alternar visibilidade das senhas', async () => {
    await element(by.id('input-senha')).typeText('senha123');
    await element(by.id('toggle-senha')).tap();

    await expect(element(by.id('input-senha'))).toHaveToggleValue(true);

    await element(by.id('input-confirmar-senha')).typeText('senha123');
    await element(by.id('toggle-confirmar-senha')).tap();

    await expect(element(by.id('input-confirmar-senha'))).toHaveToggleValue(true);
  });
});

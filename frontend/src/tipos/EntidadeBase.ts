/**
 * Classe Base para Entidades de Domínio
 * Fornece comportamentos comuns a todas as entidades
 */

export abstract class EntidadeBase {
  protected _id: number;
  protected _criadoEm?: Date;
  protected _atualizadoEm?: Date;

  constructor(id: number) {
    this._id = id;
  }

  get id(): number {
    return this._id;
  }

  get criadoEm(): Date | undefined {
    return this._criadoEm;
  }

  get atualizadoEm(): Date | undefined {
    return this._atualizadoEm;
  }

  /**
   * Verifica se duas entidades são iguais (mesmo ID)
   */
  public equals(outra: EntidadeBase): boolean {
    return this._id === outra._id;
  }

  /**
   * Clona a entidade
   */
  public abstract clonar(): EntidadeBase;

  /**
   * Converte para JSON
   */
  public abstract paraJSON(): Record<string, any>;

  /**
   * Valida a entidade
   */
  public abstract validar(): boolean;
}

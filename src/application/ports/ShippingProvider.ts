export interface ItemParaFrete {
  produtoId: string;
  quantidade: number;
}

export interface OpcaoFreteCotada {
  transportadora: string;
  servico: string;
  prazoDias: number;
  valor: number;
}

/**
 * Abstração sobre o provedor de frete (implementado em
 * infrastructure/shipping por um cliente Melhor Envio). A camada de
 * aplicação depende apenas desta interface, nunca do SDK/HTTP concreto.
 */
export interface ShippingProvider {
  cotar(cepDestino: string, itens: ItemParaFrete[]): Promise<OpcaoFreteCotada[]>;
}

export class ShippingUnavailableError extends Error {
  constructor(cause?: unknown) {
    super("Serviço de frete indisponível no momento.");
    this.name = "ShippingUnavailableError";
    this.cause = cause;
  }
}

export class InvalidZipCodeError extends Error {
  constructor(cep: string) {
    super(`CEP inválido: ${cep}`);
    this.name = "InvalidZipCodeError";
  }
}

import {
  ShippingProvider,
  ItemParaFrete,
  OpcaoFreteCotada,
  InvalidZipCodeError,
} from "../ports/ShippingProvider";

const CEP_REGEX = /^\d{8}$/;

/**
 * Caso de uso: cotar frete para um conjunto de itens do carrinho.
 * A validação de formato do CEP acontece aqui, antes de acionar o provedor
 * externo — evita chamada de rede desnecessária para entrada claramente
 * inválida.
 */
export async function calcularFrete(
  provider: ShippingProvider,
  cepDestino: string,
  itens: ItemParaFrete[]
): Promise<OpcaoFreteCotada[]> {
  const cepLimpo = cepDestino.replace(/\D/g, "");

  if (!CEP_REGEX.test(cepLimpo)) {
    throw new InvalidZipCodeError(cepDestino);
  }

  if (itens.length === 0) {
    return [];
  }

  return provider.cotar(cepLimpo, itens);
}

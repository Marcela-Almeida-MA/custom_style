import {
  ShippingProvider,
  ItemParaFrete,
  OpcaoFreteCotada,
  ShippingUnavailableError,
} from "../../application/ports/ShippingProvider";

const MELHOR_ENVIO_BASE_URL =
  process.env.MELHOR_ENVIO_BASE_URL ?? "https://www.melhorenvio.com.br/api/v2";

/**
 * Implementação inicial do ShippingProvider usando a API do Melhor Envio.
 *
 * NÃO VALIDADO — chamada de rede real não foi executada neste ambiente
 * (sem acesso à internet). Tratamento de timeout/retry/rate-limit completo
 * é responsabilidade do Dia 4 (Integração), conforme ARQUITETURA.md; aqui
 * existe apenas o mapeamento básico de erro de rede para não deixar a
 * exceção do fetch vazar como erro não tratado para quem chama.
 */
export class MelhorEnvioShippingProvider implements ShippingProvider {
  constructor(private readonly token: string = process.env.MELHOR_ENVIO_TOKEN ?? "") {}

  /** Consulta o Melhor Envio e traduz a resposta para opções do domínio. */
  async cotar(cepDestino: string, itens: ItemParaFrete[]): Promise<OpcaoFreteCotada[]> {
    try {
      const resposta = await fetch(`${MELHOR_ENVIO_BASE_URL}/me/shipment/calculate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.token}`,
        },
        body: JSON.stringify({
          to: { postal_code: cepDestino },
          products: itens.map((item) => ({
            id: item.produtoId,
            quantity: item.quantidade,
          })),
        }),
      });

      if (!resposta.ok) {
        throw new ShippingUnavailableError(
          `Melhor Envio respondeu status ${resposta.status}`
        );
      }

      const dados = await resposta.json();
      return this.paraOpcoesFrete(dados);
    } catch (erro) {
      if (erro instanceof ShippingUnavailableError) throw erro;
      throw new ShippingUnavailableError(erro);
    }
  }

  /** Normaliza a resposta externa e descarta serviços marcados com erro. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private paraOpcoesFrete(dados: any): OpcaoFreteCotada[] {
    if (!Array.isArray(dados)) return [];

    return dados
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .filter((item: any) => !item.error)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map((item: any) => ({
        transportadora: item.company?.name ?? "Correios",
        servico: item.name,
        prazoDias: item.delivery_time,
        valor: Number(item.price),
      }));
  }
}

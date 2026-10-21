import { NextResponse } from "next/server";
import { DomainError } from "../domain/rules/personalizationRules";
import {
  InvalidZipCodeError,
  ShippingUnavailableError,
} from "../application/ports/ShippingProvider";
import { ProductNotFoundError } from "../application/use-cases/getProductById";
import { logger } from "./logger";

interface ErroResposta {
  error: { code: string; message: string };
}

function respostaDeErro(code: string, message: string, status: number) {
  const corpo: ErroResposta = { error: { code, message } };
  return NextResponse.json(corpo, { status });
}

/**
 * Envolve um handler de rota (Route Handler do Next.js) e traduz erros de
 * domínio/aplicação conhecidos em respostas HTTP apropriadas, sem nunca
 * expor stack trace ou detalhes internos ao cliente (ver API.md).
 *
 * Qualquer erro não mapeado explicitamente vira 500 genérico — o detalhe
 * real vai apenas para o log do servidor.
 */
export function withErrorHandling<T extends (...args: never[]) => Promise<Response>>(
  handler: T
): T {
  return (async (...args: Parameters<T>) => {
    try {
      return await handler(...args);
    } catch (erro) {
      if (erro instanceof DomainError) {
        return respostaDeErro("DOMAIN_ERROR", erro.message, 400);
      }

      if (erro instanceof ProductNotFoundError) {
        return respostaDeErro("NOT_FOUND", erro.message, 404);
      }

      if (erro instanceof InvalidZipCodeError) {
        return respostaDeErro("INVALID_ZIP_CODE", erro.message, 422);
      }

      if (erro instanceof ShippingUnavailableError) {
        logger.error("Falha ao cotar frete", { causa: String(erro.cause ?? erro) });
        return respostaDeErro(
          "SHIPPING_UNAVAILABLE",
          "Não foi possível calcular o frete no momento. Tente novamente em instantes.",
          503
        );
      }

      logger.error("Erro não tratado em rota de API", {
        erro: erro instanceof Error ? erro.message : String(erro),
      });
      return respostaDeErro("INTERNAL_ERROR", "Erro interno do servidor.", 500);
    }
  }) as T;
}

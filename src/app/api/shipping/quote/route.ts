import { NextResponse } from "next/server";
import { createBackendServices } from "../../../../backend/services";
import { withErrorHandling } from "../../../../lib/apiErrorHandler";

/** Recebe CEP e itens pela API e devolve as opções retornadas pelo provedor. */
export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json();
  const { cepDestino, itens } = body as {
    cepDestino: string;
    itens: { produtoId: string; quantidade: number }[];
  };

  const opcoes = await createBackendServices().calcularFrete(cepDestino, itens ?? []);

  return NextResponse.json({ opcoes });
});

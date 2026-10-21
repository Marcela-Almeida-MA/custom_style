import { NextResponse } from "next/server";
import { createBackendServices } from "../../../backend/services";
import { withErrorHandling } from "../../../lib/apiErrorHandler";
import { Carrinho, DadosContato } from "../../../domain/entities/Cart";

/** Recebe os dados HTTP e delega a criação do pedido ao serviço de aplicação. */
export const POST = withErrorHandling(async (request: Request) => {
  const body = await request.json();
  const { itens, cepDestino, opcaoFreteSelecionada, dadosContato } = body as {
    itens: Carrinho["itens"];
    cepDestino: string;
    opcaoFreteSelecionada: Carrinho["opcaoFreteSelecionada"];
    dadosContato: DadosContato;
  };

  const carrinho: Carrinho = { itens, cepDestino, opcaoFreteSelecionada };

  const pedido = await createBackendServices().criarPedido(carrinho, dadosContato);

  return NextResponse.json(pedido, { status: 201 });
});

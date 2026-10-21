import { NextResponse } from "next/server";
import { createBackendServices } from "../../../../backend/services";
import { withErrorHandling } from "../../../../lib/apiErrorHandler";

/** Retorna os dados do produto identificado pelo parâmetro da rota. */
export const GET = withErrorHandling(
  async (_request: Request, { params }: { params: Promise<{ id: string }> }) => {
    const { id } = await params;
    const produto = await createBackendServices().buscarProdutoPorId(id);
    return NextResponse.json(produto);
  }
);

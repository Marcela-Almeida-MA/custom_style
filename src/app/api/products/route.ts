import { NextRequest, NextResponse } from "next/server";
import { createBackendServices } from "../../../backend/services";
import { withErrorHandling } from "../../../lib/apiErrorHandler";
import { CATEGORIAS } from "../../../domain/entities/types";
import { DomainError } from "../../../domain/rules/personalizationRules";

export const dynamic = "force-dynamic";

/** Adapta a consulta HTTP de produtos ao serviço do catálogo. */
export const GET = withErrorHandling(async (request: NextRequest) => {
  const categoriaParam = request.nextUrl.searchParams.get("categoria");
  const categoria =
    categoriaParam === null
      ? undefined
      : CATEGORIAS.find((opcao) => opcao === categoriaParam);

  if (categoriaParam !== null && !categoria) {
    throw new DomainError("Categoria inválida.");
  }

  const produtos = await createBackendServices().listarProdutos(categoria);

  return NextResponse.json(produtos);
});

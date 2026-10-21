import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";

const { listarMock } = vi.hoisted(() => ({
  listarMock: vi.fn(),
}));

vi.mock("../../src/backend/services", () => ({
  createBackendServices: () => ({
    listarProdutos: listarMock,
  }),
}));

import { GET } from "../../src/app/api/products/route";

describe("GET /api/products", () => {
  beforeEach(() => {
    listarMock.mockReset().mockResolvedValue([]);
  });

  it("aplica uma categoria válida na consulta", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/products?categoria=CAMISETA")
    );

    expect(response.status).toBe(200);
    expect(listarMock).toHaveBeenCalledWith("CAMISETA");
  });

  it("rejeita categoria inválida em vez de retornar o catálogo inteiro", async () => {
    const response = await GET(
      new NextRequest("http://localhost/api/products?categoria=INVALIDA")
    );

    expect(response.status).toBe(400);
    expect(await response.json()).toEqual({
      error: { code: "DOMAIN_ERROR", message: "Categoria inválida." },
    });
    expect(listarMock).not.toHaveBeenCalled();
  });
});

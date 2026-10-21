import { describe, expect, it, vi } from "vitest";
import { listarProdutos } from "../../src/application/use-cases/listProducts";
import {
  buscarProdutoPorId,
  ProductNotFoundError,
} from "../../src/application/use-cases/getProductById";
import { ProductRepository } from "../../src/application/ports/repositories";
import { Produto } from "../../src/domain/entities/Product";

const produto: Produto = {
  id: "produto-1",
  nome: "Camiseta",
  categoria: "CAMISETA",
  precoBase: 49.9,
  modelo3dRef: "camiseta.glb",
  coresDisponiveis: [],
  estampasDisponiveis: [],
  permiteLogoProprio: true,
};

function criarRepositorio(produtos: Produto[]): ProductRepository {
  return {
    listar: vi.fn(async (categoria) =>
      categoria ? produtos.filter((item) => item.categoria === categoria) : produtos
    ),
    buscarPorId: vi.fn(async (id) => produtos.find((item) => item.id === id) ?? null),
  };
}

describe("casos de uso do catálogo", () => {
  it("lista todos os produtos quando não há filtro de categoria", async () => {
    const repo = criarRepositorio([produto]);

    await expect(listarProdutos(repo)).resolves.toEqual([produto]);
    expect(repo.listar).toHaveBeenCalledWith(undefined);
  });

  it("encaminha o filtro de categoria ao repositório", async () => {
    const repo = criarRepositorio([produto]);

    await expect(listarProdutos(repo, "CAMISETA")).resolves.toEqual([produto]);
    expect(repo.listar).toHaveBeenCalledWith("CAMISETA");
  });

  it("busca o produto pelo identificador", async () => {
    const repo = criarRepositorio([produto]);

    await expect(buscarProdutoPorId(repo, produto.id)).resolves.toEqual(produto);
    expect(repo.buscarPorId).toHaveBeenCalledWith(produto.id);
  });

  it("lança erro específico quando o produto não existe", async () => {
    const repo = criarRepositorio([]);

    await expect(buscarProdutoPorId(repo, "inexistente")).rejects.toThrow(
      ProductNotFoundError
    );
  });
});

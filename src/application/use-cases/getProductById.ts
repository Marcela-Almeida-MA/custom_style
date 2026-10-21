import { Produto } from "../../domain/entities/Product";
import { ProductRepository } from "../ports/repositories";

export class ProductNotFoundError extends Error {
  constructor(id: string) {
    super(`Produto não encontrado: ${id}`);
    this.name = "ProductNotFoundError";
  }
}

/** Retorna um produto pelo identificador ou sinaliza que ele não existe. */
export async function buscarProdutoPorId(
  repo: ProductRepository,
  id: string
): Promise<Produto> {
  const produto = await repo.buscarPorId(id);
  if (!produto) {
    throw new ProductNotFoundError(id);
  }
  return produto;
}

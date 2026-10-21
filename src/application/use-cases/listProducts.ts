import { Produto } from "../../domain/entities/Product";
import { ProductRepository } from "../ports/repositories";

/** Lista produtos do catálogo, com filtro de categoria opcional. */
export async function listarProdutos(
  repo: ProductRepository,
  categoria?: Produto["categoria"]
): Promise<Produto[]> {
  return repo.listar(categoria);
}

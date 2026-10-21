import { Prisma, PrismaClient } from "@prisma/client";
import { Produto } from "../../domain/entities/Product";
import { ProductRepository } from "../../application/ports/repositories";

type ProdutoComRelacoes = Prisma.ProductGetPayload<{
  include: {
    cores: { include: { color: true } };
    estampas: { include: { stamp: true } };
  };
}>;

/**
 * Implementação concreta de ProductRepository usando Prisma.
 * A camada de aplicação/domínio não conhece esta classe diretamente — ela é
 * injetada onde a interface ProductRepository é esperada.
 *
 * NÃO VALIDADO — requer Prisma Client gerado a partir de `prisma/schema.prisma`
 * e um banco PostgreSQL conectado; não foi possível instalar/gerar o client
 * neste ambiente (sem acesso à rede).
 */
export class PrismaProductRepository implements ProductRepository {
  constructor(private readonly db: PrismaClient) {}

  /** Consulta o catálogo e converte os registros para entidades de domínio. */
  async listar(categoria?: Produto["categoria"]): Promise<Produto[]> {
    const produtos = await this.db.product.findMany({
      where: categoria ? { categoria } : undefined,
      include: {
        cores: { include: { color: true } },
        estampas: { include: { stamp: true } },
      },
    });

    return produtos.map(this.paraDominio);
  }

  /** Consulta um produto pela chave primária, retornando null se ausente. */
  async buscarPorId(id: string): Promise<Produto | null> {
    const produto = await this.db.product.findUnique({
      where: { id },
      include: {
        cores: { include: { color: true } },
        estampas: { include: { stamp: true } },
      },
    });

    return produto ? this.paraDominio(produto) : null;
  }

  /** Converte o formato relacional do Prisma para a entidade Produto. */
  private paraDominio(registro: ProdutoComRelacoes): Produto {
    return {
      id: registro.id,
      nome: registro.nome,
      categoria: registro.categoria,
      precoBase: Number(registro.precoBase),
      modelo3dRef: registro.modelo3dRef,
      permiteLogoProprio: registro.permiteLogoProprio,
      coresDisponiveis: registro.cores.map(({ color }) => color),
      estampasDisponiveis: registro.estampas.map(({ stamp }) => stamp),
    };
  }
}

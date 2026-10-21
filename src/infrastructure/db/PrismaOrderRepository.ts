import { PrismaClient } from "@prisma/client";
import { Pedido } from "../../domain/entities/Cart";
import { OrderRepository } from "../../application/ports/repositories";

/**
 * NÃO VALIDADO — requer Prisma Client gerado e banco conectado; não
 * executado neste ambiente (sem acesso à rede para instalar dependências).
 */
export class PrismaOrderRepository implements OrderRepository {
  constructor(private readonly db: PrismaClient) {}

  /** Persiste o pedido e seus itens em uma única operação relacional. */
  async salvar(pedido: Pedido): Promise<Pedido> {
    await this.db.order.create({
      data: {
        id: pedido.id,
        status: pedido.status,
        valorProdutos: pedido.valorProdutos,
        valorFrete: pedido.valorFrete,
        valorTotal: pedido.valorTotal,
        cepDestino: pedido.cepDestino,
        nomeContato: pedido.dadosContato.nome,
        emailContato: pedido.dadosContato.email,
        telefoneContato: pedido.dadosContato.telefone,
        itens: {
          create: pedido.itens.map((item) => {
            const { corId, estampaId, logoUploadId } = item.personalizacao;
            return {
              quantidade: item.quantidade,
              precoUnitario: item.precoUnitario,
              product: { connect: { id: item.produtoId } },
              ...(corId ? { color: { connect: { id: corId } } } : {}),
              ...(estampaId ? { stamp: { connect: { id: estampaId } } } : {}),
              ...(logoUploadId
                ? { logoUpload: { connect: { id: logoUploadId } } }
                : {}),
            };
          }),
        },
      },
    });

    return pedido;
  }

  /** Reconstrói um pedido de domínio a partir do registro e de seus itens. */
  async buscarPorId(id: string): Promise<Pedido | null> {
    const registro = await this.db.order.findUnique({
      where: { id },
      include: { itens: true },
    });

    if (!registro) return null;

    return {
      id: registro.id,
      status: registro.status as Pedido["status"],
      valorProdutos: Number(registro.valorProdutos),
      valorFrete: Number(registro.valorFrete),
      valorTotal: Number(registro.valorTotal),
      cepDestino: registro.cepDestino,
      dadosContato: {
        nome: registro.nomeContato,
        email: registro.emailContato,
        telefone: registro.telefoneContato,
      },
      itens: registro.itens.map((item) => ({
        produtoId: item.productId,
        quantidade: item.quantidade,
        precoUnitario: Number(item.precoUnitario),
        personalizacao: {
          corId: item.colorId ?? undefined,
          estampaId: item.stampId ?? undefined,
          logoUploadId: item.logoUploadId ?? undefined,
        },
      })),
    };
  }
}

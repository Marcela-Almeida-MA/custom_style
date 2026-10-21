import { Carrinho, DadosContato } from "../domain/entities/Cart";
import { Categoria } from "../domain/entities/types";
import {
  ArquivoParaUpload,
  FileStorage,
} from "../application/ports/FileStorage";
import { ItemParaFrete } from "../application/ports/ShippingProvider";
import { criarPedido as executarCriacaoDePedido } from "../application/use-cases/createOrder";
import { calcularFrete as executarCalculoDeFrete } from "../application/use-cases/calculateShipping";
import { buscarProdutoPorId as executarBuscaDeProduto } from "../application/use-cases/getProductById";
import { listarProdutos as executarListagemDeProdutos } from "../application/use-cases/listProducts";
import { PrismaOrderRepository } from "../infrastructure/db/PrismaOrderRepository";
import { PrismaProductRepository } from "../infrastructure/db/PrismaProductRepository";
import { prisma } from "../infrastructure/db/prismaClient";
import { MelhorEnvioShippingProvider } from "../infrastructure/shipping/MelhorEnvioClient";
import { LocalFileStorage } from "../infrastructure/storage/LocalFileStorage";

/**
 * Cria os serviços de aplicação e conecta as abstrações às implementações
 * concretas. Páginas e rotas do Next consomem esta composição sem conhecer
 * Prisma, armazenamento local ou o cliente do Melhor Envio.
 */
export function createBackendServices() {
  const productRepository = new PrismaProductRepository(prisma);
  const orderRepository = new PrismaOrderRepository(prisma);
  const shippingProvider = new MelhorEnvioShippingProvider();
  const fileStorage: FileStorage = new LocalFileStorage();

  return {
    /** Lista produtos, opcionalmente filtrados por categoria. */
    listarProdutos: (categoria?: Categoria) =>
      executarListagemDeProdutos(productRepository, categoria),

    /** Busca um produto e lança ProductNotFoundError quando ele não existe. */
    buscarProdutoPorId: (id: string) =>
      executarBuscaDeProduto(productRepository, id),

    /** Calcula opções de frete para um CEP e os itens selecionados. */
    calcularFrete: (cepDestino: string, itens: ItemParaFrete[]) =>
      executarCalculoDeFrete(shippingProvider, cepDestino, itens),

    /** Valida e persiste um pedido usando os dados oficiais do servidor. */
    criarPedido: (carrinho: Carrinho, dadosContato: DadosContato) =>
      executarCriacaoDePedido(
        orderRepository,
        productRepository,
        shippingProvider,
        carrinho,
        dadosContato
      ),

    /** Persiste o arquivo recebido pela camada HTTP de upload. */
    salvarArquivo: (arquivo: ArquivoParaUpload) => fileStorage.salvar(arquivo),
  };
}

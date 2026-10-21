import { randomUUID } from "crypto";
import { Carrinho, Pedido, DadosContato } from "../../domain/entities/Cart";
import {
  calcularPrecoUnitario,
  montarPedidoAPartirDoCarrinho,
  DomainError,
  validarPersonalizacaoParaProduto,
} from "../../domain/rules/personalizationRules";
import { OrderRepository, ProductRepository } from "../ports/repositories";
import { calcularFrete } from "./calculateShipping";
import { ShippingProvider } from "../ports/ShippingProvider";
import { ProductNotFoundError } from "./getProductById";

/** Valida o carrinho, recota valores confiáveis no servidor e persiste o pedido. */
export async function criarPedido(
  repo: OrderRepository,
  produtosRepo: ProductRepository,
  provedorFrete: ShippingProvider,
  carrinho: Carrinho,
  dadosContato: DadosContato
): Promise<Pedido> {
  if (!carrinho.itens.length) {
    throw new DomainError("Carrinho incompleto: é necessário ao menos um item, CEP válido e frete selecionado.");
  }

  if (!carrinho.cepDestino || !carrinho.opcaoFreteSelecionada) {
    throw new DomainError("Carrinho incompleto: é necessário ao menos um item, CEP válido e frete selecionado.");
  }

  const itens = await Promise.all(carrinho.itens.map(async (item) => {
    if (!Number.isInteger(item.quantidade) || item.quantidade <= 0) {
      throw new DomainError("A quantidade de cada item deve ser um número inteiro positivo.");
    }

    const produto = await produtosRepo.buscarPorId(item.produtoId);
    if (!produto) {
      throw new ProductNotFoundError(item.produtoId);
    }

    validarPersonalizacaoParaProduto(produto, item.personalizacao);

    return { ...item, precoUnitario: calcularPrecoUnitario(produto) };
  }));

  const opcoesFrete = await calcularFrete(
    provedorFrete,
    carrinho.cepDestino,
    itens.map(({ produtoId, quantidade }) => ({ produtoId, quantidade }))
  );

  const freteSelecionado = opcoesFrete.find(
    (opcao) =>
      opcao.transportadora === carrinho.opcaoFreteSelecionada?.transportadora &&
      opcao.servico === carrinho.opcaoFreteSelecionada?.servico
  );

  if (!freteSelecionado) {
    throw new DomainError("A opção de frete selecionada não está mais disponível.");
  }

  const carrinhoConfiavel: Carrinho = {
    itens,
    cepDestino: carrinho.cepDestino.replace(/\D/g, ""),
    opcaoFreteSelecionada: freteSelecionado,
  };
  const pedido = montarPedidoAPartirDoCarrinho(
    randomUUID(),
    carrinhoConfiavel,
    dadosContato
  );
  return repo.salvar(pedido);
}

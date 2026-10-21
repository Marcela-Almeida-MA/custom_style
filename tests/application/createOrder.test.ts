import { describe, expect, it, vi } from "vitest";
import { criarPedido } from "../../src/application/use-cases/createOrder";
import { ProductRepository, OrderRepository } from "../../src/application/ports/repositories";
import { ShippingProvider } from "../../src/application/ports/ShippingProvider";
import { Carrinho, Pedido } from "../../src/domain/entities/Cart";
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

function criarDependencias(opcoesCotadas = [{
  transportadora: "Correios",
  servico: "PAC",
  prazoDias: 8,
  valor: 18.5,
}]) {
  let pedidoSalvo: Pedido | undefined;
  const orderRepository: OrderRepository = {
    salvar: vi.fn(async (pedido) => {
      pedidoSalvo = pedido;
      return pedido;
    }),
    buscarPorId: vi.fn(async () => null),
  };
  const productRepository: ProductRepository = {
    listar: vi.fn(async () => [produto]),
    buscarPorId: vi.fn(async (id) => id === produto.id ? produto : null),
  };
  const shippingProvider: ShippingProvider = {
    cotar: vi.fn(async () => opcoesCotadas),
  };

  return {
    orderRepository,
    productRepository,
    shippingProvider,
    pedidoSalvo: () => pedidoSalvo,
  };
}

const carrinhoComValoresDoCliente: Carrinho = {
  itens: [{
    produtoId: produto.id,
    personalizacao: {},
    quantidade: 2,
    precoUnitario: 0.01,
  }],
  cepDestino: "01310100",
  opcaoFreteSelecionada: {
    transportadora: "Correios",
    servico: "PAC",
    prazoDias: 1,
    valor: 0,
  },
};

const dadosContato = {
  nome: "Cliente Teste",
  email: "cliente@teste.com",
  telefone: "11999999999",
};

describe("criarPedido", () => {
  it("recalcula o preço dos produtos e o frete usando fontes do servidor", async () => {
    const deps = criarDependencias();

    const pedido = await criarPedido(
      deps.orderRepository,
      deps.productRepository,
      deps.shippingProvider,
      carrinhoComValoresDoCliente,
      dadosContato
    );

    expect(pedido.itens.map((item) => item.precoUnitario)).toEqual([49.9]);
    expect(pedido.valorProdutos).toBe(99.8);
    expect(pedido.valorFrete).toBe(18.5);
    expect(pedido.valorTotal).toBe(118.3);
    expect(deps.shippingProvider.cotar).toHaveBeenCalledWith("01310100", [
      { produtoId: produto.id, quantidade: 2 },
    ]);
  });

  it("rejeita frete que não está entre as opções recotadas e não salva pedido", async () => {
    const deps = criarDependencias([{
      transportadora: "Correios",
      servico: "SEDEX",
      prazoDias: 2,
      valor: 32,
    }]);

    await expect(criarPedido(
      deps.orderRepository,
      deps.productRepository,
      deps.shippingProvider,
      carrinhoComValoresDoCliente,
      dadosContato
    )).rejects.toThrow("A opção de frete selecionada não está mais disponível.");

    expect(deps.orderRepository.salvar).not.toHaveBeenCalled();
  });

  it("rejeita personalização incompatível com o produto sem cotar frete nem salvar", async () => {
    const deps = criarDependencias();
    const carrinho = {
      ...carrinhoComValoresDoCliente,
      itens: [{
        produtoId: produto.id,
        quantidade: 2,
        precoUnitario: 0.01,
        personalizacao: { estampaId: "estampa-inexistente" },
      }],
    };

    await expect(criarPedido(
      deps.orderRepository,
      deps.productRepository,
      deps.shippingProvider,
      carrinho,
      dadosContato
    )).rejects.toThrow('A estampa selecionada não está disponível para o produto "Camiseta".');

    expect(deps.shippingProvider.cotar).not.toHaveBeenCalled();
    expect(deps.orderRepository.salvar).not.toHaveBeenCalled();
  });
});

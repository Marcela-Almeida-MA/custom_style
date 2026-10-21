import { describe, it, expect } from "vitest";
import {
  DomainError,
  validarPersonalizacao,
  estampaCompativelComProduto,
  validarLogoUpload,
  validarPersonalizacaoParaProduto,
  calcularPrecoUnitario,
  calcularValorProdutos,
  podeConfirmarPedido,
  montarPedidoAPartirDoCarrinho,
} from "../../src/domain/rules/personalizationRules";
import { Produto } from "../../src/domain/entities/Product";
import { Carrinho } from "../../src/domain/entities/Cart";
import { FormatoArquivo } from "../../src/domain/entities/types";

function criarProdutoFake(overrides: Partial<Produto> = {}): Produto {
  return {
    id: "prod-1",
    nome: "Camiseta Básica",
    categoria: "CAMISETA",
    precoBase: 49.9,
    modelo3dRef: "modelos/camiseta.glb",
    coresDisponiveis: [{ id: "cor-1", nome: "Branco", hex: "#FFFFFF" }],
    estampasDisponiveis: [{ id: "estampa-1", nome: "Listras", imagemUrl: "x.png" }],
    permiteLogoProprio: true,
    ...overrides,
  };
}

describe("validarPersonalizacao", () => {
  it("aceita personalização apenas com estampa", () => {
    expect(() => validarPersonalizacao({ estampaId: "estampa-1" })).not.toThrow();
  });

  it("aceita personalização apenas com logo", () => {
    expect(() => validarPersonalizacao({ logoUploadId: "logo-1" })).not.toThrow();
  });

  it("rejeita personalização com estampa e logo ao mesmo tempo", () => {
    expect(() =>
      validarPersonalizacao({ estampaId: "estampa-1", logoUploadId: "logo-1" })
    ).toThrow(DomainError);
  });
});

describe("estampaCompativelComProduto", () => {
  it("retorna true quando a estampa pertence ao produto", () => {
    const produto = criarProdutoFake();
    expect(estampaCompativelComProduto(produto, "estampa-1")).toBe(true);
  });

  it("retorna false quando a estampa não pertence ao produto", () => {
    const produto = criarProdutoFake();
    expect(estampaCompativelComProduto(produto, "estampa-inexistente")).toBe(false);
  });
});

describe("validarLogoUpload", () => {
  it("aceita PNG dentro do limite de tamanho", () => {
    expect(() => validarLogoUpload("PNG", 1024)).not.toThrow();
  });

  it("rejeita formato não suportado", () => {
    expect(() => validarLogoUpload("PDF" as FormatoArquivo, 1024)).toThrow(DomainError);
  });

  it("rejeita arquivo acima do tamanho máximo", () => {
    expect(() => validarLogoUpload("PNG", 999_999_999)).toThrow(DomainError);
  });
});

describe("validarPersonalizacaoParaProduto", () => {
  it("rejeita uma cor que não está disponível para o produto", () => {
    const produto = criarProdutoFake();

    expect(() =>
      validarPersonalizacaoParaProduto(produto, { corId: "cor-inexistente" })
    ).toThrow(DomainError);
  });

  it("rejeita estampa incompatível com o produto", () => {
    const produto = criarProdutoFake({ estampasDisponiveis: [] });
    expect(() =>
      validarPersonalizacaoParaProduto(produto, { estampaId: "estampa-1" })
    ).toThrow(DomainError);
  });

  it("rejeita logo quando o produto não permite logo próprio", () => {
    const produto = criarProdutoFake({ permiteLogoProprio: false });
    expect(() =>
      validarPersonalizacaoParaProduto(produto, { logoUploadId: "logo-1" })
    ).toThrow(DomainError);
  });
});

describe("cálculo de preços", () => {
  it("calcula o preço unitário como o preço base do produto", () => {
    const produto = criarProdutoFake({ precoBase: 59.9 });
    expect(calcularPrecoUnitario(produto)).toBe(59.9);
  });

  it("soma o valor total dos itens do carrinho", () => {
    const total = calcularValorProdutos([
      { produtoId: "p1", personalizacao: {}, quantidade: 2, precoUnitario: 10 },
      { produtoId: "p2", personalizacao: {}, quantidade: 1, precoUnitario: 30 },
    ]);
    expect(total).toBe(50);
  });
});

describe("podeConfirmarPedido", () => {
  const itemValido = {
    produtoId: "p1",
    personalizacao: {},
    quantidade: 1,
    precoUnitario: 10,
  };

  it("retorna false sem itens", () => {
    const carrinho: Carrinho = { itens: [], cepDestino: "12345678" };
    expect(podeConfirmarPedido(carrinho)).toBe(false);
  });

  it("retorna false sem CEP válido", () => {
    const carrinho: Carrinho = { itens: [itemValido], cepDestino: "abc" };
    expect(podeConfirmarPedido(carrinho)).toBe(false);
  });

  it("retorna false sem frete selecionado", () => {
    const carrinho: Carrinho = { itens: [itemValido], cepDestino: "12345678" };
    expect(podeConfirmarPedido(carrinho)).toBe(false);
  });

  it("retorna true com item, CEP válido e frete selecionado", () => {
    const carrinho: Carrinho = {
      itens: [itemValido],
      cepDestino: "12345678",
      opcaoFreteSelecionada: {
        transportadora: "Correios",
        servico: "SEDEX",
        prazoDias: 5,
        valor: 20,
      },
    };
    expect(podeConfirmarPedido(carrinho)).toBe(true);
  });
});

describe("montarPedidoAPartirDoCarrinho", () => {
  it("monta o pedido somando produtos e frete", () => {
    const carrinho: Carrinho = {
      itens: [
        { produtoId: "p1", personalizacao: {}, quantidade: 2, precoUnitario: 25 },
      ],
      cepDestino: "01310100",
      opcaoFreteSelecionada: {
        transportadora: "Correios",
        servico: "PAC",
        prazoDias: 8,
        valor: 15,
      },
    };

    const pedido = montarPedidoAPartirDoCarrinho("pedido-1", carrinho, {
      nome: "Cliente Teste",
      email: "cliente@teste.com",
      telefone: "11999999999",
    });

    expect(pedido.valorProdutos).toBe(50);
    expect(pedido.valorFrete).toBe(15);
    expect(pedido.valorTotal).toBe(65);
    expect(pedido.status).toBe("CONFIRMADO");
  });

  it("lança erro se o carrinho estiver incompleto", () => {
    const carrinho: Carrinho = { itens: [] };
    expect(() =>
      montarPedidoAPartirDoCarrinho("pedido-1", carrinho, {
        nome: "Cliente Teste",
        email: "cliente@teste.com",
        telefone: "11999999999",
      })
    ).toThrow(DomainError);
  });
});

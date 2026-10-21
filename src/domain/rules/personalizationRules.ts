import { Produto } from "../entities/Product";
import { Personalizacao } from "../entities/Personalization";
import { ItemCarrinho, Carrinho, Pedido } from "../entities/Cart";
import {
  FormatoArquivo,
  FORMATOS_LOGO_PERMITIDOS,
  TAMANHO_MAXIMO_LOGO_BYTES,
} from "../entities/types";

/**
 * Erro de domínio: representa uma violação de regra de negócio,
 * distinto de um erro técnico/infraestrutura.
 */
export class DomainError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DomainError";
  }
}

/**
 * Regra 1 (DOMAIN.md): uma personalização não pode ter estampa e logo
 * próprio ao mesmo tempo.
 */
export function validarPersonalizacao(personalizacao: Personalizacao): void {
  const temEstampa = Boolean(personalizacao.estampaId);
  const temLogo = Boolean(personalizacao.logoUploadId);

  if (temEstampa && temLogo) {
    throw new DomainError(
      "Um item não pode ter estampa de catálogo e logo próprio ao mesmo tempo."
    );
  }
}

/**
 * Regra: uma estampa só pode ser usada se estiver associada à categoria do
 * produto (ou seja, presente na lista `estampasDisponiveis` do produto).
 */
export function estampaCompativelComProduto(
  produto: Produto,
  estampaId: string
): boolean {
  return produto.estampasDisponiveis.some((estampa) => estampa.id === estampaId);
}

/**
 * Regra: logo próprio só é permitido se o produto aceitar
 * (`permiteLogoProprio = true`).
 */
export function logoPermitidoParaProduto(produto: Produto): boolean {
  return produto.permiteLogoProprio;
}

/**
 * Valida um upload de logo: formato e tamanho.
 * Lança DomainError com mensagem clara em caso de violação.
 */
export function validarLogoUpload(
  formato: FormatoArquivo,
  tamanhoBytes: number
): void {
  if (!FORMATOS_LOGO_PERMITIDOS.includes(formato)) {
    throw new DomainError(
      `Formato de arquivo não suportado: ${formato}. Use PNG, JPG ou SVG.`
    );
  }

  if (tamanhoBytes <= 0) {
    throw new DomainError("Arquivo de logo inválido (tamanho zero).");
  }

  if (tamanhoBytes > TAMANHO_MAXIMO_LOGO_BYTES) {
    throw new DomainError(
      `Arquivo excede o tamanho máximo permitido de ${
        TAMANHO_MAXIMO_LOGO_BYTES / (1024 * 1024)
      }MB.`
    );
  }
}

/**
 * Valida uma personalização completa contra um produto específico
 * (combina as regras acima).
 */
export function validarPersonalizacaoParaProduto(
  produto: Produto,
  personalizacao: Personalizacao
): void {
  validarPersonalizacao(personalizacao);

  if (
    personalizacao.corId &&
    !produto.coresDisponiveis.some((cor) => cor.id === personalizacao.corId)
  ) {
    throw new DomainError(
      `A cor selecionada não está disponível para o produto "${produto.nome}".`
    );
  }

  if (personalizacao.estampaId) {
    if (!estampaCompativelComProduto(produto, personalizacao.estampaId)) {
      throw new DomainError(
        `A estampa selecionada não está disponível para o produto "${produto.nome}".`
      );
    }
  }

  if (personalizacao.logoUploadId && !logoPermitidoParaProduto(produto)) {
    throw new DomainError(
      `O produto "${produto.nome}" não aceita logo próprio.`
    );
  }
}

/**
 * Regra 3 (DOMAIN.md): o preço unitário de um item é fixado no momento em
 * que ele entra no carrinho — esta função apenas calcula esse valor a
 * partir do preço base do produto (sem custo adicional de personalização
 * no MVP).
 */
export function calcularPrecoUnitario(produto: Produto): number {
  return produto.precoBase;
}

/** Calcula o subtotal de um item com base no preço e na quantidade. */
export function calcularValorItem(item: ItemCarrinho): number {
  return item.precoUnitario * item.quantidade;
}

/** Soma o valor de todos os itens do carrinho. */
export function calcularValorProdutos(itens: ItemCarrinho[]): number {
  return itens.reduce((total, item) => total + calcularValorItem(item), 0);
}

/**
 * Regra 5 (DOMAIN.md): um pedido só pode ser confirmado se tiver pelo menos
 * um item, um CEP válido e uma opção de frete selecionada.
 */
export function podeConfirmarPedido(carrinho: Carrinho): boolean {
  const temItens = carrinho.itens.length > 0;
  const temCepValido = Boolean(carrinho.cepDestino && /^\d{8}$/.test(carrinho.cepDestino));
  const temFrete = Boolean(carrinho.opcaoFreteSelecionada);

  return temItens && temCepValido && temFrete;
}

/** Monta um pedido confirmado a partir de um carrinho validado. */
export function montarPedidoAPartirDoCarrinho(
  id: string,
  carrinho: Carrinho,
  dadosContato: Pedido["dadosContato"]
): Pedido {
  if (!podeConfirmarPedido(carrinho)) {
    throw new DomainError(
      "Carrinho incompleto: é necessário ao menos um item, CEP válido e frete selecionado."
    );
  }

  const valorProdutos = calcularValorProdutos(carrinho.itens);
  const valorFrete = carrinho.opcaoFreteSelecionada!.valor;

  return {
    id,
    itens: carrinho.itens,
    valorProdutos,
    valorFrete,
    valorTotal: valorProdutos + valorFrete,
    status: "CONFIRMADO",
    cepDestino: carrinho.cepDestino!,
    dadosContato,
  };
}

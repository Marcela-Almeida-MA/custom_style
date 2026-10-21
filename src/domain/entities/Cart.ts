import { Personalizacao } from "./Personalization";

export interface ItemCarrinho {
  produtoId: string;
  personalizacao: Personalizacao;
  quantidade: number;
  precoUnitario: number;
}

export interface Carrinho {
  itens: ItemCarrinho[];
  cepDestino?: string;
  opcaoFreteSelecionada?: OpcaoFrete;
}

export interface OpcaoFrete {
  transportadora: string;
  servico: string;
  prazoDias: number;
  valor: number;
}

export type StatusPedido = "RASCUNHO" | "CONFIRMADO";

export interface DadosContato {
  nome: string;
  email: string;
  telefone: string;
}

export interface Pedido {
  id: string;
  itens: ItemCarrinho[];
  valorProdutos: number;
  valorFrete: number;
  valorTotal: number;
  status: StatusPedido;
  cepDestino: string;
  dadosContato: DadosContato;
}

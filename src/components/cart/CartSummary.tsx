import { ItemCarrinho, OpcaoFrete } from "../../domain/entities/Cart";
import { calcularValorProdutos } from "../../domain/rules/personalizationRules";

interface CartSummaryProps {
  itens: ItemCarrinho[];
  frete?: OpcaoFrete;
}

/** Formata um valor numérico como moeda brasileira. */
function formatarMoeda(valor: number): string {
  return valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

/** Exibe subtotais dos produtos, frete selecionado e total do carrinho. */
export function CartSummary({ itens, frete }: CartSummaryProps) {
  const valorProdutos = calcularValorProdutos(itens);
  const valorTotal = valorProdutos + (frete?.valor ?? 0);

  return (
    <div className="rounded border border-stone-light bg-canvas p-5">
      <div className="flex justify-between text-sm text-stone">
        <span>Produtos</span>
        <span>{formatarMoeda(valorProdutos)}</span>
      </div>
      <div className="mt-1 flex justify-between text-sm text-stone">
        <span>Frete{frete ? ` (${frete.servico})` : ""}</span>
        <span>{frete ? formatarMoeda(frete.valor) : "a calcular"}</span>
      </div>
      <div className="mt-3 flex justify-between border-t border-stone-light pt-3 text-base font-medium text-ink">
        <span>Total</span>
        <span>{formatarMoeda(valorTotal)}</span>
      </div>
    </div>
  );
}

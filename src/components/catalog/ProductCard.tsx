import { Produto } from "../../domain/entities/Product";

interface ProductCardProps {
  produto: Produto;
}

/** Apresenta o resumo de um produto e direciona para sua página. */
export function ProductCard({ produto }: ProductCardProps) {
  return (
    <a
      href={`/produtos/${produto.id}`}
      className="block rounded border border-stone-light bg-canvas p-5 transition-colors hover:border-thread"
    >
      <p className="text-xs uppercase tracking-wide text-stone">{produto.categoria}</p>
      <h3 className="mt-1 text-lg font-medium text-ink">{produto.nome}</h3>
      <p className="mt-3 text-ink">
        {produto.precoBase.toLocaleString("pt-BR", {
          style: "currency",
          currency: "BRL",
        })}
      </p>
    </a>
  );
}

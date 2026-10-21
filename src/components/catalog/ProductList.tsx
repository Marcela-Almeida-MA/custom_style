import { Produto } from "../../domain/entities/Product";
import { ProductCard } from "./ProductCard";

interface ProductListProps {
  produtos: Produto[];
}

/** Exibe os produtos do catálogo ou a mensagem de catálogo vazio. */
export function ProductList({ produtos }: ProductListProps) {
  if (produtos.length === 0) {
    return (
      <p className="text-stone">
        Nenhum produto cadastrado ainda. Cadastre o primeiro produto para vê-lo
        aqui.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
      {produtos.map((produto) => (
        <ProductCard key={produto.id} produto={produto} />
      ))}
    </div>
  );
}

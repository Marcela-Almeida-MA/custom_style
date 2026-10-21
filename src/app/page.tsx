import { createBackendServices } from "../backend/services";
import { ProductList } from "../components/catalog/ProductList";

export const dynamic = "force-dynamic";

/** Renderiza o catálogo inicial usando o serviço de aplicação do backend. */
export default async function HomePage() {
  const produtos = await createBackendServices().listarProdutos();

  return (
    <main className="mx-auto max-w-5xl px-6 py-16">
      <header className="mb-12">
        <h1 className="text-3xl font-medium text-ink">
          Produtos personalizados para a sua empresa
        </h1>
        <p className="mt-2 max-w-xl text-stone">
          Escolha um produto, personalize com sua cor, estampa ou logo, e veja
          o resultado antes de comprar.
        </p>
      </header>

      <ProductList produtos={produtos} />
    </main>
  );
}

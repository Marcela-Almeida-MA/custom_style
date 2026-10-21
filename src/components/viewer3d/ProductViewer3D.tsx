"use client";

import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Produto } from "../../domain/entities/Product";
import { Personalizacao } from "../../domain/entities/Personalization";

interface ProductViewer3DProps {
  produto: Produto;
  personalizacao: Personalizacao;
}

/**
 * Visualizador 3D genérico: recebe o produto (que traz `modelo3dRef`, o
 * caminho do modelo 3D específico daquela categoria) e a personalização
 * atual (cor/estampa/logo), e aplica como textura sobre o modelo.
 *
 * NÃO VALIDADO — depende de react-three-fiber/drei e de assets .glb reais,
 * que não foram instalados/criados neste ambiente sem rede. A interface do
 * componente (props) já reflete o contrato definido em ARQUITETURA.md:
 * trocar apenas `produto.modelo3dRef` para suportar uma nova categoria.
 */
/** Monta a cena 3D e aplica controles de visualização ao modelo do produto. */
export function ProductViewer3D({ produto, personalizacao }: ProductViewer3DProps) {
  return (
    <div className="aspect-square w-full rounded bg-canvas">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.7} />
        <directionalLight position={[2, 2, 2]} />
        <Suspense fallback={null}>
          <ProductModel modelo3dRef={produto.modelo3dRef} personalizacao={personalizacao} />
        </Suspense>
        <OrbitControls enablePan={false} />
      </Canvas>
    </div>
  );
}

/** Carrega o asset 3D associado ao produto e o adiciona à cena. */
function ProductModel({
  modelo3dRef,
}: {
  modelo3dRef: string;
  personalizacao: Personalizacao;
}) {
  // TODO (Dia 4): aplicar a personalização (cor/estampa/logo) como textura
  // no material do modelo carregado, usando o mapeamento de UV do asset.
  const { scene } = useGLTF(modelo3dRef);
  return <primitive object={scene} />;
}

"use client";

import { Estampa } from "../../domain/entities/Product";

interface StampPickerProps {
  estampas: Estampa[];
  estampaSelecionadaId?: string;
  onSelecionar: (estampaId: string | undefined) => void;
}

/** Renderiza as estampas disponíveis e permite remover a seleção atual. */
export function StampPicker({ estampas, estampaSelecionadaId, onSelecionar }: StampPickerProps) {
  if (estampas.length === 0) return null;

  return (
    <fieldset>
      <legend className="text-sm text-stone">Estampa</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => onSelecionar(undefined)}
          className={`rounded border px-3 py-1 text-sm ${
            !estampaSelecionadaId ? "border-thread text-thread" : "border-stone-light text-stone"
          }`}
        >
          Nenhuma
        </button>
        {estampas.map((estampa) => (
          <button
            key={estampa.id}
            type="button"
            aria-pressed={estampa.id === estampaSelecionadaId}
            onClick={() => onSelecionar(estampa.id)}
            className={`rounded border px-3 py-1 text-sm ${
              estampa.id === estampaSelecionadaId
                ? "border-thread text-thread"
                : "border-stone-light text-stone"
            }`}
          >
            {estampa.nome}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

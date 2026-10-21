"use client";

import { Cor } from "../../domain/entities/Product";

interface ColorPickerProps {
  cores: Cor[];
  corSelecionadaId?: string;
  onSelecionar: (corId: string) => void;
}

/** Renderiza cores disponíveis e notifica a escolha do cliente. */
export function ColorPicker({ cores, corSelecionadaId, onSelecionar }: ColorPickerProps) {
  return (
    <fieldset>
      <legend className="text-sm text-stone">Cor</legend>
      <div className="mt-2 flex flex-wrap gap-2">
        {cores.map((cor) => (
          <button
            key={cor.id}
            type="button"
            aria-label={cor.nome}
            aria-pressed={cor.id === corSelecionadaId}
            onClick={() => onSelecionar(cor.id)}
            className={`h-8 w-8 rounded-full border-2 transition-colors ${
              cor.id === corSelecionadaId ? "border-thread" : "border-stone-light"
            }`}
            style={{ backgroundColor: cor.hex }}
          />
        ))}
      </div>
    </fieldset>
  );
}

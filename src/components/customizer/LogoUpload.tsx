"use client";

import { useState } from "react";
import { FORMATOS_LOGO_PERMITIDOS, TAMANHO_MAXIMO_LOGO_BYTES } from "../../domain/entities/types";

interface LogoUploadProps {
  onEnviado: (logoUploadId: string, arquivoUrl: string) => void;
}

/**
 * Faz o upload do logo do cliente via POST /api/uploads/logo (ver API.md).
 * Validação de formato/tamanho acontece no cliente (feedback imediato) e é
 * repetida no servidor (nunca confiar apenas na validação do cliente).
 */
export function LogoUpload({ onEnviado }: LogoUploadProps) {
  const [erro, setErro] = useState<string | null>(null);
  const [enviando, setEnviando] = useState(false);

  /** Valida o arquivo localmente e envia o logo ao endpoint do backend. */
  async function lidarComArquivo(arquivo: File) {
    setErro(null);

    if (arquivo.size > TAMANHO_MAXIMO_LOGO_BYTES) {
      setErro(`Arquivo maior que ${TAMANHO_MAXIMO_LOGO_BYTES / (1024 * 1024)}MB.`);
      return;
    }

    const formData = new FormData();
    formData.append("file", arquivo);

    setEnviando(true);
    try {
      const resposta = await fetch("/api/uploads/logo", { method: "POST", body: formData });
      if (!resposta.ok) {
        const corpo = await resposta.json();
        setErro(corpo.error?.message ?? "Não foi possível enviar o arquivo.");
        return;
      }
      const dados = await resposta.json();
      onEnviado(dados.id, dados.arquivoUrl);
    } finally {
      setEnviando(false);
    }
  }

  return (
    <div>
      <label className="text-sm text-stone" htmlFor="logo-upload">
        Enviar minha logo (PNG, JPG ou SVG)
      </label>
      <input
        id="logo-upload"
        type="file"
        accept="image/png,image/jpeg,image/svg+xml"
        disabled={enviando}
        onChange={(evento) => {
          const arquivo = evento.target.files?.[0];
          if (arquivo) lidarComArquivo(arquivo);
        }}
        className="mt-2 block text-sm text-ink"
      />
      {erro && <p className="mt-1 text-sm text-red-700">{erro}</p>}
      <p className="mt-1 text-xs text-stone">
        Formatos aceitos: {FORMATOS_LOGO_PERMITIDOS.join(", ")}.
      </p>
    </div>
  );
}

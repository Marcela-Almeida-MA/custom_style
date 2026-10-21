import { NextResponse } from "next/server";
import { validarLogoUpload } from "../../../../domain/rules/personalizationRules";
import { createBackendServices } from "../../../../backend/services";
import { withErrorHandling } from "../../../../lib/apiErrorHandler";
import { FormatoArquivo } from "../../../../domain/entities/types";

/** Converte um MIME type aceito pelo endpoint para o formato do domínio. */
function formatoAPartirDoMimeType(mimeType: string): FormatoArquivo | null {
  if (mimeType === "image/png") return "PNG";
  if (mimeType === "image/jpeg") return "JPG";
  if (mimeType === "image/svg+xml") return "SVG";
  return null;
}

/** Valida o arquivo recebido e o encaminha ao serviço de armazenamento. */
export const POST = withErrorHandling(async (request: Request) => {
  const formData = await request.formData();
  const arquivo = formData.get("file");

  if (!(arquivo instanceof File)) {
    return NextResponse.json(
      { error: { code: "MISSING_FILE", message: "Nenhum arquivo enviado." } },
      { status: 400 }
    );
  }

  const formato = formatoAPartirDoMimeType(arquivo.type);
  if (!formato) {
    return NextResponse.json(
      {
        error: {
          code: "UNSUPPORTED_FORMAT",
          message: "Formato de arquivo não suportado. Use PNG, JPG ou SVG.",
        },
      },
      { status: 400 }
    );
  }

  validarLogoUpload(formato, arquivo.size);

  const buffer = Buffer.from(await arquivo.arrayBuffer());
  const salvo = await createBackendServices().salvarArquivo({
    nomeOriginal: arquivo.name,
    conteudo: buffer,
    mimeType: arquivo.type,
  });

  return NextResponse.json(
    { id: crypto.randomUUID(), arquivoUrl: salvo.url, formato, tamanhoBytes: salvo.tamanhoBytes },
    { status: 201 }
  );
});

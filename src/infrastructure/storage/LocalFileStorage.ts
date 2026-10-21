import { randomUUID } from "crypto";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import {
  FileStorage,
  ArquivoParaUpload,
  ArquivoArmazenado,
} from "../../application/ports/FileStorage";

const DIRETORIO_UPLOADS = path.join(process.cwd(), "public", "uploads", "logos");

/**
 * Implementação de desenvolvimento: salva o arquivo em disco local, dentro
 * de `public/uploads/logos`. Em produção, trocar por uma implementação
 * S3-compatible que também implemente FileStorage — nenhum código que
 * consome FileStorage precisa mudar.
 *
 * NÃO VALIDADO neste ambiente (depende do runtime do Next.js/filesystem de
 * produção, que não está em execução aqui).
 */
export class LocalFileStorage implements FileStorage {
  /** Salva o arquivo com nome aleatório e retorna sua URL pública local. */
  async salvar(arquivo: ArquivoParaUpload): Promise<ArquivoArmazenado> {
    await mkdir(DIRETORIO_UPLOADS, { recursive: true });

    const extensao = path.extname(arquivo.nomeOriginal) || "";
    const nomeArquivo = `${randomUUID()}${extensao}`;
    const caminhoCompleto = path.join(DIRETORIO_UPLOADS, nomeArquivo);

    await writeFile(caminhoCompleto, arquivo.conteudo);

    return {
      url: `/uploads/logos/${nomeArquivo}`,
      tamanhoBytes: arquivo.conteudo.byteLength,
    };
  }
}

export interface ArquivoParaUpload {
  nomeOriginal: string;
  conteudo: Buffer;
  mimeType: string;
}

export interface ArquivoArmazenado {
  url: string;
  tamanhoBytes: number;
}

/**
 * Abstração sobre onde os logos enviados pelos clientes são armazenados.
 * Implementação concreta (ex.: S3-compatible) fica em infrastructure/storage.
 */
export interface FileStorage {
  salvar(arquivo: ArquivoParaUpload): Promise<ArquivoArmazenado>;
}

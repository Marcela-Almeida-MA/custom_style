import { FormatoArquivo } from "./types";

export interface LogoUpload {
  id: string;
  arquivoUrl: string;
  formato: FormatoArquivo;
  tamanhoBytes: number;
  criadoEm: Date;
}

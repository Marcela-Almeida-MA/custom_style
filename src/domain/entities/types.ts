export type Categoria = "CAMISETA" | "CAIXA" | "SACOLA" | "ETIQUETA";

export const CATEGORIAS: Categoria[] = [
  "CAMISETA",
  "CAIXA",
  "SACOLA",
  "ETIQUETA",
];

export type FormatoArquivo = "PNG" | "JPG" | "SVG";

export const FORMATOS_LOGO_PERMITIDOS: FormatoArquivo[] = ["PNG", "JPG", "SVG"];

export const TAMANHO_MAXIMO_LOGO_BYTES = 5 * 1024 * 1024; // 5MB

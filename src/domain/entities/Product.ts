import { Categoria } from "./types";

export interface Cor {
  id: string;
  nome: string;
  hex: string;
}

export interface Estampa {
  id: string;
  nome: string;
  imagemUrl: string;
}

export interface Produto {
  id: string;
  nome: string;
  categoria: Categoria;
  precoBase: number;
  modelo3dRef: string;
  coresDisponiveis: Cor[];
  estampasDisponiveis: Estampa[];
  permiteLogoProprio: boolean;
}

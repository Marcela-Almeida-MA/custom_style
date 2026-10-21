import { Produto } from "../../domain/entities/Product";
import { Pedido } from "../../domain/entities/Cart";

export interface ProductRepository {
  listar(categoria?: Produto["categoria"]): Promise<Produto[]>;
  buscarPorId(id: string): Promise<Produto | null>;
}

export interface OrderRepository {
  salvar(pedido: Pedido): Promise<Pedido>;
  buscarPorId(id: string): Promise<Pedido | null>;
}

# DATABASE.md

PostgreSQL + Prisma. Modelo relacional simplificado para o MVP.

## Tabelas

### `products`
| coluna | tipo | observação |
|---|---|---|
| id | uuid (PK) | |
| nome | text | |
| categoria | enum (CAMISETA, CAIXA, SACOLA, ETIQUETA) | indexado |
| preco_base | numeric(10,2) | |
| modelo_3d_ref | text | caminho/asset do modelo 3D |
| permite_logo_proprio | boolean | default true |
| criado_em | timestamp | |

### `colors`
| coluna | tipo |
|---|---|
| id | uuid (PK) |
| nome | text |
| hex | text |

### `product_colors` (N:N)
| coluna | tipo |
|---|---|
| product_id | uuid (FK → products) |
| color_id | uuid (FK → colors) |

### `stamps`
| coluna | tipo |
|---|---|
| id | uuid (PK) |
| nome | text |
| imagem_url | text |

### `product_stamps` (N:N — quais estampas servem para qual produto)
| coluna | tipo |
|---|---|
| product_id | uuid (FK → products) |
| stamp_id | uuid (FK → stamps) |

### `logo_uploads`
| coluna | tipo |
|---|---|
| id | uuid (PK) |
| arquivo_url | text |
| formato | enum (PNG, JPG, SVG) |
| tamanho_bytes | integer |
| criado_em | timestamp |

### `orders`
| coluna | tipo |
|---|---|
| id | uuid (PK) |
| status | enum (RASCUNHO, CONFIRMADO) | default RASCUNHO |
| valor_produtos | numeric(10,2) |
| valor_frete | numeric(10,2) |
| valor_total | numeric(10,2) |
| cep_destino | text |
| nome_contato | text |
| email_contato | text |
| telefone_contato | text |
| criado_em | timestamp |

### `order_items`
| coluna | tipo | observação |
|---|---|---|
| id | uuid (PK) | |
| order_id | uuid (FK → orders) | on delete cascade |
| product_id | uuid (FK → products) | |
| color_id | uuid (FK → colors, nullable) | |
| stamp_id | uuid (FK → stamps, nullable) | |
| logo_upload_id | uuid (FK → logo_uploads, nullable) | |
| quantidade | integer | |
| preco_unitario | numeric(10,2) | fixado no momento da compra |

**Restrição de integridade**: `stamp_id` e `logo_upload_id` não podem estar
ambos preenchidos no mesmo `order_item` (checar na camada de aplicação; se o
banco suportar, usar `CHECK` constraint).

## Índices

- `products(categoria)` — listagem por categoria é o filtro mais comum.
- `order_items(order_id)` — busca de itens por pedido.
- `product_colors(product_id)`, `product_stamps(product_id)` — joins do
  personalizador.

## Migrações

Toda alteração estrutural passa por migração Prisma versionada
(`prisma migrate dev` em desenvolvimento, `prisma migrate deploy` em
produção). Nenhuma alteração manual direto no banco de produção.

## Fora do escopo do modelo atual

- Tabela de pagamentos/transações (`ESCOPO_FUTURO`).
- Tabela de usuários/contas de cliente (`ESCOPO_FUTURO`).
- Controle de estoque (`ESCOPO_FUTURO`).

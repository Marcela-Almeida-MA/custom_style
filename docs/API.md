# API.md

Todas as rotas abaixo são Next.js Route Handlers, prefixo `/api`.
Formato de resposta: JSON. Erros seguem `{ "error": { "code", "message" } }`,
sem expor stack trace ou dados internos.

## Produtos

### `GET /api/products`
Lista produtos, com filtro opcional por categoria.
- Query: `?categoria=CAMISETA`
- 200: `[{ id, nome, categoria, precoBase, modelo3dRef, coresDisponiveis[], estampasDisponiveis[], permiteLogoProprio }]`
- 400: categoria inválida

### `GET /api/products/:id`
Detalhe de um produto, incluindo cores, estampas e referência do modelo 3D.
- 200: `{ id, nome, categoria, precoBase, modelo3dRef, coresDisponiveis[], estampasDisponiveis[], permiteLogoProprio }`
- 404: produto não encontrado

## Upload de logo

### `POST /api/uploads/logo`
Multipart/form-data com o arquivo.
- Validações: formato (PNG/JPG/SVG), tamanho máximo.
- 201: `{ id, arquivoUrl, formato, tamanhoBytes }`
- 400: arquivo inválido (formato ou tamanho)

## Carrinho (gerenciado no cliente, endpoints de apoio)

### `POST /api/shipping/quote`
Calcula opções de frete via Melhor Envio.
- Body: `{ cepDestino, itens: [{ produtoId, quantidade }] }`
- 200: `{ opcoes: [{ transportadora, servico, prazoDias, valor }] }`
- 422: CEP inválido
- 503: serviço de frete indisponível (com mensagem amigável, sem detalhe interno)

## Pedido

### `POST /api/orders`
Cria um pedido a partir do carrinho (sem cobrança online no MVP).
- Body: `{ itens: [{ produtoId, personalizacao, quantidade }], cepDestino, opcaoFreteSelecionada: { transportadora, servico }, dadosContato }`
- O servidor consulta o preço vigente de cada produto e recota o frete para o CEP e itens recebidos. Valores de preço, prazo e frete enviados pelo cliente são ignorados.
- 201: `{ id, status: "CONFIRMADO", valorProdutos, valorFrete, valorTotal }`
- 400: dados obrigatórios ausentes (ex.: sem itens, sem CEP)
- 422: CEP inválido
- 503: serviço de frete indisponível

### `GET /api/orders/:id`
Consulta um pedido (uso interno/administrativo no MVP).
- 200: dados do pedido
- 404: não encontrado

## Administração (uso interno, autenticação necessária — detalhar em fase futura)

### `POST /api/admin/products`
Cria/edita produto do catálogo. Requer autenticação (`ESCOPO_FUTURO`: definir
mecanismo — sessão simples ou painel separado).

## Convenções gerais

- Todos os endpoints validam entrada antes de processar (rejeitar cedo).
- Nenhum endpoint expõe mensagens de erro de banco de dados ou stack trace.
- Erros de integração externa (Melhor Envio) são traduzidos para mensagens
  genéricas ao cliente, com log detalhado apenas no servidor.

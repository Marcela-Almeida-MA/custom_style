# DOMAIN.md

## Entidades principais

### Produto
Representa um item do catálogo (ex.: "Camiseta Básica", "Caixa Pequena").
- `id`
- `nome`
- `categoria` (CAMISETA | CAIXA | SACOLA | ETIQUETA)
- `precoBase`
- `modelo3dRef` — referência ao asset 3D usado no viewer
- `coresDisponiveis[]`
- `estampasDisponiveis[]`
- `permiteLogoProprio: boolean`

### Cor
- `id`, `nome`, `hex` — vinculada a um ou mais produtos.

### Estampa
- `id`, `nome`, `imagemUrl` — pré-cadastrada, vinculada a categorias
  compatíveis (nem toda estampa serve para caixa, por exemplo).

### Personalização (Value Object)
Representa a escolha do cliente para um item do carrinho:
- `corId` (opcional)
- `estampaId` (opcional, mutuamente exclusivo com `logoUploadId`)
- `logoUploadId` (opcional)
- Regra: exatamente uma entre `estampaId` e `logoUploadId` pode estar
  presente, nunca as duas ao mesmo tempo, para um mesmo item.

### LogoUpload
- `id`, `arquivoUrl`, `formato`, `tamanhoBytes`, `criadoEm`
- Regras: formato ∈ {PNG, JPG, SVG}; tamanho máximo definido em configuração
  (ex.: 5MB).

### ItemCarrinho
- `produtoId`, `personalizacao`, `quantidade`, `precoUnitario`
- `precoUnitario` é calculado no momento da adição (produto + eventual
  acréscimo de personalização).

### Carrinho
- `itens[]`
- `cepDestino`
- `opcaoFreteSelecionada` (transportadora, prazo, valor)
- Regra: frete é calculado sobre o conjunto de itens, não item a item.

### Pedido
- `id`, `itens[]`, `valorProdutos`, `valorFrete`, `valorTotal`, `status`
- `status` ∈ {RASCUNHO | CONFIRMADO} no MVP (sem pagamento, sem fluxo de
  pós-venda ainda).
- `dadosContato` (nome, e-mail, telefone, endereço de entrega)

## Regras de negócio centrais

1. Uma `Estampa` só pode ser selecionada se estiver associada à `categoria`
   do `Produto` em questão.
2. `LogoUpload` é permitido para qualquer categoria em que
   `permiteLogoProprio = true`.
3. O preço unitário de um item é fixado no momento em que ele entra no
   carrinho (não recalcula retroativamente se o preço base do produto mudar
   depois).
4. O frete é sempre recalculado quando o CEP ou os itens do carrinho mudam.
5. Um `Pedido` só passa de `RASCUNHO` para `CONFIRMADO` quando tem pelo menos
   um item, um CEP válido e uma opção de frete selecionada.

## O que fica fora do domínio no MVP

- Cobrança/pagamento (não existe entidade de pagamento ainda).
- Conta de usuário/autenticação de cliente.
- Estoque/controle de produção.

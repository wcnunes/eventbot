# EventBot - Gerenciador de Eventos

Este projeto é um sistema completo para gerenciamento de eventos, com cadastro, edição, exibição de eventos, controle de pagamentos e compartilhamento em redes sociais.

## Pré-requisitos
- Node.js (versão 16 ou superior)
- npm (geralmente já incluso com o Node.js)

## Instalação e Execução Local

1. **Clone o repositório ou baixe os arquivos do projeto.**

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie a aplicação:**
   ```bash
   npm run dev
   ```
   O sistema estará disponível em `http://localhost:5173` (ou porta informada no terminal).

## Como Usar
- Acesse a URL informada no terminal após rodar o comando acima.
- Cadastre, edite e visualize eventos.
- Faça upload de imagens de capa e complementares para cada evento.
- Compartilhe eventos via WhatsApp, Facebook, X (Twitter) ou copie o convite.
- Veja o status dos pagamentos (mock ou via API real, se configurada).

## Integração com API de Pagamentos (Opcional)

Se quiser testar a integração com uma API real de pagamentos:
1. Suba um backend que exponha o endpoint:
   - `GET /api/pagamentos/:id/status` retornando `{ status: "Pago" }`, `"Pendente"`, etc.
2. Por padrão, a aplicação busca em `http://localhost:3001/api/pagamentos/:id/status`.
   - Altere a URL em `services/mockApi.ts` se necessário.
3. Se a API não responder, o sistema usa o mock local como fallback.

## Observações
- Os dados dos eventos e pagamentos são mockados e não persistem após atualizar a página.
- Para persistência real, implemente um backend e adapte as funções de API.

## Dúvidas ou melhorias?
Abra uma issue ou entre em contato!

# EventBot - Gerenciador de Eventos

Este projeto é um sistema completo para gerenciamento de eventos, com painel administrativo protegido e mural público para divulgação e compartilhamento de eventos.

## Pré-requisitos
- Node.js (versão 16 ou superior)
- npm (geralmente já incluso com o Node.js)

## Instalação e Execução Local

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   cd SEU_REPOSITORIO
   ```

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

### Mural Público
- Acesse `http://localhost:5173/mural` para visualizar todos os eventos cadastrados.
- Compartilhe eventos facilmente via WhatsApp, Facebook ou Twitter.
- Não é necessário login para acessar o mural.

### Painel Administrativo
- Acesse `http://localhost:5173/admin` para cadastrar, editar e gerenciar eventos e pagamentos.
- **Primeiro acesso:** Cadastre login, senha, pergunta e resposta secreta para o admin.
- **Acessos seguintes:** Faça login com as credenciais cadastradas.
- **Recuperação de senha:** Clique em "Esqueci a senha". Um modal (pop-up) será aberto com a pergunta secreta cadastrada. Se a resposta estiver correta, a senha será exibida na tela.
- **Logout:** Use o botão "Sair" no topo direito do painel admin.

### Observações Importantes
- **Atenção:** Todas as credenciais e dados de autenticação ficam salvos apenas no navegador (localStorage). Se o localStorage for apagado, será necessário cadastrar novamente.
- **Segurança:** Este sistema é adequado para testes locais, MVPs ou uso pessoal. Não utilize este método de autenticação em produção real.
- Os dados dos eventos e pagamentos são mockados e não persistem após atualizar a página.

## Subindo para o GitHub

1. **Inicialize o repositório (se ainda não fez):**
   ```bash
   git init
   ```
2. **Adicione todos os arquivos:**
   ```bash
   git add .
   ```
3. **Faça um commit:**
   ```bash
   git commit -m "feat: painel admin protegido, mural público, autenticação local e recuperação de senha via pergunta secreta em modal"
   ```
4. **Crie o repositório no GitHub e adicione o remoto:**
   ```bash
   git remote add origin https://github.com/SEU_USUARIO/SEU_REPOSITORIO.git
   ```
5. **Envie para o GitHub:**
   ```bash
   git branch -M main
   git push -u origin main
   ```

## Dúvidas ou melhorias?
Abra uma issue ou entre em contato!

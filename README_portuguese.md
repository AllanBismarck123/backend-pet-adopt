<a href="README.md" target="_blank">Read this page in English</a>
# Plataforma de Adoção de Animais 🐾

Bem-vindo(a) à Plataforma de Adoção de Animais, onde conectamos animais adoráveis a lares amorosos. Este projeto visa simplificar e facilitar o processo de adoção, promovendo a responsabilidade e compaixão para com os animais.

## Funcionalidades Principais

1. **Cadastro de ONGs (Organizações Não Governamentais)**
   - Registre sua ONG e ajude a criar perfis para animais disponíveis para adoção.

2. **Busca de Animais para Adoção**
   - Explore a lista de animais disponíveis para adoção.
   - Filte por espécie, raça e outros critérios para encontrar o companheiro perfeito.

3. **Requisições de Adoção**
   - Permita que adotantes em potencial enviem solicitações para adotar um animal específico.

4. **Gerenciamento de Adoções**
   - Aceite, desfaça ou rejeite solicitações de adoção para garantir o bem-estar dos animais.

## Documentação

Explore nossa [Documentação](https://documenter.getpostman.com/view/32475615/2s9YypDNMk) para obter detalhes sobre as rotas, autenticação, ONGs, animais e muito mais. Descubra como integrar e utilizar nossa plataforma!

## Acompanhamento no Trello 📊

Acompanhe nosso progresso e contribua para o desenvolvimento através do nosso [Quadro no Trello](https://trello.com/b/fRxmXbu5/plataforma-de-ado%C3%A7%C3%A3o-de-animais). Utilizamos a metodologia Kanban para organizar tarefas, implementações e melhorias. Seja parte do processo!

# Como Contribuir 🤝

Obrigado por considerar contribuir para a Plataforma de Adoção de Animais! Sua ajuda é fundamental para tornar nossa plataforma ainda melhor. Siga os passos abaixo para começar:

1. **Fork do Repositório**
   - Faça um fork do [repositório principal](https://github.com/allan-bismarck/backend-pet-adopt.git).

2. **Clone o Repositório Forkado**
   ```bash
   git clone https://github.com/allan-bismarck/backend-pet-adopt.git
   cd backend-pet-adopt
   ```

3. **Configuração do Ambiente**
   - Certifique-se de ter o Docker instalado em sua máquina.
   - Crie um arquivo na raiz do projeto chamado `.env.key` e adicione a seguinte linha:
     ```
     JWT_SECRET=sua_chave_de_seguranca
     ```
     (Substitua `sua_chave_de_seguranca` por uma chave de segurança gerada por um gerador de chaves de segurança online. Fique à vontade para escolher o tamanho da sua chave.)

4. **Executar o Projeto**
   - Execute o seguinte comando para iniciar o projeto:
     ```bash
     docker compose up
     ```
     Isso iniciará o servidor e o banco de dados.

5. **Acesso Local**
   - Acesse a plataforma localmente em [http://localhost:4000](http://localhost:4000).

6. **Contribua**
   - Faça as alterações desejadas, crie novas funcionalidades ou resolva issues existentes.

7. **Envie as Alterações**
   - Faça um commit das suas alterações e envie um pull request para o repositório principal.

Lembre-se de seguir as melhores práticas de desenvolvimento e documentação. Agradecemos sua contribuição! 🚀

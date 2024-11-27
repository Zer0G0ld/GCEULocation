# Mapa Interativo - GCEU IMW Gericinó

Este projeto tem como objetivo criar um mapa interativo para a Igreja IMW Gericinó, mostrando a localização dos GCEUs (Grupos de Comunhão e Evangelismo) próximos aos usuários. Além disso, a aplicação permitirá adicionar, editar e visualizar informações sobre os GCEUs, como nome, local, horário e contato.

## Funcionalidades Implementadas

1. **Mapa Interativo com Leaflet**: 
   - Utiliza a biblioteca [Leaflet](https://leafletjs.com/) para exibir um mapa interativo.
   - Marca as localizações dos GCEUs no mapa usando coordenadas de latitude e longitude.
   
2. **Seção de Dados do GCEU**:
   - Exibe informações sobre um GCEU selecionado, como nome, endereço, horário e telefone.
   
3. **Tabela de Disponibilidade dos GCEUs**:
   - Exibe uma tabela com os GCEUs disponíveis e seus horários de funcionamento.

4. **Formulário para Adicionar Novo GCEU**:
   - Permite aos administradores adicionar novos GCEUs ao sistema, informando nome, local, horário, latitude e longitude.
   - Inclui um botão para remover um GCEU.

5. **Design Responsivo**:
   - A interface foi criada para ser responsiva, adaptando-se a diferentes tamanhos de tela, incluindo dispositivos móveis.

6. **Navegação Simples**:
   - Menu de navegação fixo que permite aos usuários navegar rapidamente pelas seções do site: "GCEUs Disponíveis", "Localizações", "Sobre a Igreja", e "Adicionar GCEU".

## Tecnologias Utilizadas

- **Frontend**:
  - HTML5, CSS3
  - [Leaflet.js](https://leafletjs.com/) para o mapa interativo
  - JavaScript para interatividade
  - [CSS Custom Properties (Variáveis CSS)](https://developer.mozilla.org/en-US/docs/Web/CSS/--*)

- **Estilos**:
  - Uso de variáveis CSS para cores, espaçamentos e bordas.
  - Layout flexível e responsivo para garantir uma boa experiência em dispositivos móveis.

## Estrutura de Arquivos

```bash
/GCEULocation
├── backend
│   ├── app.js              # Servidor Express e configuração das rotas
│   ├── config
│   │   └── database.js     # Conexão com o PostgreSQL
│   └── script.js           # Lógica de controle (ex: obter pacientes)
├── frontend
│   ├── img
│   │   ├── logoIMG.png
│   │   └── logo.png
│   ├── index.html          # HTML do frontend
│   ├── script.js           # Lógica do frontend (ex: requisição aos pacientes)
│   └── styles.css          # Estilos do frontend
├── .env                    # Configurações sensíveis (ex: senha do banco)
├── package.json            # Gerenciador de dependências
└── package-lock.json       # Lockfile do npm
```

## Como Rodar o Projeto

Para executar o projeto localmente, basta seguir os passos abaixo:

1. Clone o repositório:
   ```bash
   git clone https://github.com/Zer0G0ld/GCEULocation.git
   ```

2. Navegue até o diretório do projeto:
   ```bash
   cd GCEULocation
   ```

3. Instale as dependencias:
   ```nodejs
   npm install
   npm install cors
   npm install express
   npm install dotenv
   npm install pg@latest
   npm list pg
   ```
4. Inicie o backend:

```bash
cd backend
node app.js
```

5. Verifique o frontend:
```bash
cd frontend
```

6. Se quiser fazer alterações, abra o projeto em um editor de código (recomendo [VSCode](https://code.visualstudio.com/)) e edite os arquivos conforme necessário.

## Próximos Passos

Embora o mapa interativo e a estrutura básica do site estejam implementados, ainda há várias funcionalidades que podem ser adicionadas para avançar com o projeto:

1. **Backend e Armazenamento de Dados**:
   - **Banco de Dados**: Implementar um backend para armazenar e gerenciar os dados dos GCEUs em um banco de dados (como PostgreSQL ou MySQL).
   - **APIs de Backend**: Criar APIs para permitir a adição, edição e remoção de GCEUs. O backend pode ser desenvolvido usando Node.js e Express.js.
   - **Autenticação**: Implementar autenticação para administradores e controle de acesso aos formulários de adicionar/remover GCEUs.

2. **Integração com Google Maps**:
   - Considerar a possibilidade de integrar com a [Google Maps API](https://developers.google.com/maps) para obter funcionalidades adicionais, como direções, geolocalização e exibição de diferentes tipos de mapa (ex: satélite).

3. **Validação de Formulários**:
   - Adicionar validação de formulário mais robusta no frontend (por exemplo, para verificar se as coordenadas geográficas são válidas) e no backend.

4. **Funcionalidades de Filtros**:
   - Adicionar filtros de busca no mapa e na tabela para que os usuários possam localizar rapidamente GCEUs com base em seu horário ou local.

5. **Melhorias no Design**:
   - Melhorar o design com mais interações, como animações e transições suaves para uma melhor experiência do usuário.

6. **Implementar um Sistema de Feedback**:
   - Adicionar funcionalidades de feedback, permitindo que os usuários deixem comentários sobre os GCEUs ou façam sugestões.

## Contribuindo

Se você deseja contribuir para este projeto, sinta-se à vontade para fazer um fork e criar um pull request. Qualquer melhoria ou correção será bem-vinda.

1. Faça um fork deste repositório.
2. Crie uma branch para suas alterações (`git checkout -b minha-nova-feature`).
3. Faça as alterações e commite-as (`git commit -am 'Adiciona nova funcionalidade'`).
4. Envie para o seu repositório (`git push origin minha-nova-feature`).
5. Crie um pull request explicando suas alterações.

## Licença

Este projeto está licenciado sob a [Apache](LICENSE).
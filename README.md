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

- **Backend**:
  - **Node.js** e **Express.js** para criar o servidor e as rotas da API.
  - **PostgreSQL** como banco de dados para armazenar as informações dos GCEUs.
  - **pg** (biblioteca Node.js) para interagir com o banco de dados PostgreSQL.
  - **dotenv** para gerenciar variáveis de ambiente (como as credenciais do banco de dados).

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

3. Instale as dependências:
   ```bash
   npm install
   npm install cors
   npm install express
   npm install dotenv
   npm install pg@latest
   npm list pg
   npm install mongoose
   ```

---

### 4. Configure o banco de dados:
   - Crie um banco de dados no PostgreSQL e adicione as tabelas necessárias.
   - No arquivo `.env`, defina as variáveis de ambiente para conectar ao banco de dados:

   ```env
   DB_HOST=localhost
   DB_PORT=5432
   DB_USER=seu_usuario
   DB_PASSWORD=sua_senha
   DB_NAME=seu_banco_de_dados
   ```

### PostgreSQL no Termux:
Para criar e configurar um banco de dados PostgreSQL no Termux, siga os passos abaixo:

### Passo 1: Instalar o PostgreSQL no Termux
1. **Atualize os pacotes do Termux:**
   ```bash
   pkg update && pkg upgrade
   ```

2. **Instale o PostgreSQL:**
   ```bash
   pkg install postgresql
   ```

### Passo 2: Inicializar o PostgreSQL
1. **Inicialize o diretório de dados do PostgreSQL:**
   ```bash
   initdb $PREFIX/var/lib/postgresql
   ```

2. **Inicie o servidor PostgreSQL:**
   ```bash
   pg_ctl -D $PREFIX/var/lib/postgresql start
   ```

### Passo 3: Criar um banco de dados
1. **Acesse o shell do PostgreSQL:**
   Caso o comando `psql` retorne o erro abaixo:

   ```bash
   ~/GCEULocation $ psql
   2024-11-27 08:39:06.849 -03 [5410] FATAL:  database "u0_a408" does not exist
   psql: error: connection to server on socket "/data/data/com.termux/files/usr/tmp/.s.PGSQL.5432" failed: FATAL:  database "u0_a408" does not exist
   ```

   **Solução:**
   Conecte-se ao banco de dados padrão `postgres` (ou `template1`):

   ```bash
   psql -d postgres
   ```

2. **Crie um novo banco de dados (substitua `meubanco` pelo nome desejado):**
   ```sql
   CREATE DATABASE gceu;
   ```

3. **Conecte-se ao banco de dados recém-criado:**
   ```sql
   \c gceu
   ```

### Passo 4: Criar usuário e conceder privilégios (opcional)
1. **Crie um usuário (substitua `meuusuario` e `minhasenha`):**
   ```sql
   CREATE USER gceu WITH PASSWORD 'minhasenha';
   ```

2. **Conceda privilégios ao usuário no banco de dados:**
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE gceu TO gceu;
   ```

### Passo 5: Criar tabelas (exemplo)
1. **Exemplo de criação de uma tabela `gceus`:**
   ```sql
   CREATE TABLE gceus (
     id SERIAL PRIMARY KEY,
     nome VARCHAR(255) NOT NULL,
     endereco VARCHAR(255) NOT NULL,
     hora TIME,
     descricao TEXT,
     data_inicio DATE
   );
   ```

2. **Inserir dados de exemplo:**
   ```sql
   INSERT INTO gceus (nome, endereco, hora, descricao, data_inicio)
   VALUES ('GCEU Central', 'Rua Exemplo, 123', '14:00', 'Descrição do GCEU', '2024-11-27');
   ```

### Passo 6: Sair do psql
Para sair do shell `psql`, use o comando:
```sql
\q
```

### Passo 7: Parar o servidor PostgreSQL
Se quiser parar o servidor, use o comando:
```bash
pg_ctl -D $PREFIX/var/lib/postgresql stop
```

### Dicas:
- Para iniciar o PostgreSQL automaticamente ao abrir o Termux, você pode adicionar o comando de inicialização ao `.bashrc` ou `.zshrc`:
  ```bash
  pg_ctl -D $PREFIX/var/lib/postgresql start
  ```

## Configurar PostgreSQL no Linux e Windows

### **1. Instalar o PostgreSQL**

#### **Linux:**
1. **Atualize os pacotes do sistema:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Instale o PostgreSQL:**
   ```bash
   sudo apt install postgresql postgresql-contrib -y
   ```

#### **Windows:**
1. **Baixe e instale o PostgreSQL:**
   - Acesse [PostgreSQL Downloads](https://www.postgresql.org/download/windows/).
   - Baixe a versão compatível com seu sistema e siga o instalador.
   
2. **Durante a instalação:**
   - Escolha um diretório de instalação.
   - Defina a senha do usuário `postgres` (guarde essa senha).

### **2. Inicializar e Iniciar o PostgreSQL**

#### **Linux:**
1. **Inicie o serviço PostgreSQL:**
   ```bash
   sudo service postgresql start
   ```

2. **Verifique o status do serviço:**
   ```bash
   sudo service postgresql status
   ```

#### **Windows:**
1. O serviço do PostgreSQL é iniciado automaticamente após a instalação. Para garantir:
   - Pressione `Win + R`, digite `services.msc` e procure por `PostgreSQL`.
   - Clique com o botão direito e selecione **Iniciar** se não estiver ativo.

### **3. Acessar o Shell do PostgreSQL (psql)**

#### **Linux:**
1. **Acesse o `psql` como usuário `postgres`:**
   ```bash
   sudo -u postgres psql
   ```

#### **Windows:**
1. **Abra o `psql` através do menu iniciar:**
   - Vá até **Iniciar → PostgreSQL → SQL Shell (psql)**.
2. **Insira os seguintes detalhes:**
   - **Servidor:** `localhost`
   - **Porta:** `5432`
   - **Usuário:** `postgres`
   - **Senha:** insira a senha definida durante a instalação.

### **4. Criar um Banco de Dados**

1. **No shell `psql`, crie um banco de dados:**
   ```sql
   CREATE DATABASE gceu;
   ```

2. **Conecte-se ao banco de dados recém-criado:**
   ```sql
   \c gceu
   ```

### **5. Criar Usuário e Conceder Privilégios (Opcional)**

1. **Crie um usuário com nome e senha personalizados:**
   ```sql
   CREATE USER gceu WITH PASSWORD 'minhasenha';
   ```

2. **Conceda privilégios ao usuário no banco criado:**
   ```sql
   GRANT ALL PRIVILEGES ON DATABASE gceu TO gceu;
   ```

### **6. Criar Tabelas e Inserir Dados**

1. **Exemplo de criação de uma tabela `gceus`:**
   ```sql
   CREATE TABLE gceus (
     id SERIAL PRIMARY KEY,
     nome VARCHAR(255) NOT NULL,
     endereco VARCHAR(255) NOT NULL,
     hora TIME,
     descricao TEXT,
     data_inicio DATE
   );
   ```

2. **Inserir dados de exemplo:**
   ```sql
   INSERT INTO gceus (nome, endereco, hora, descricao, data_inicio)
   VALUES ('GCEU Central', 'Rua Exemplo, 123', '14:00', 'Descrição do GCEU', '2024-11-27');
   ```

### **7. Parar o Servidor PostgreSQL**

#### **Linux:**
1. **Parar o serviço PostgreSQL:**
   ```bash
   sudo service postgresql stop
   ```

#### **Windows:**
1. **Parar o serviço manualmente:**
   - Pressione `Win + R`, digite `services.msc` e encontre `PostgreSQL`.
   - Clique com o botão direito e selecione **Parar**.

### **8. Dicas**

- **Linux:** Adicione o comando de inicialização ao `.bashrc` ou `.zshrc` para iniciar automaticamente o PostgreSQL:
   ```bash
   sudo service postgresql start
   ```

- **Windows:** O PostgreSQL inicia automaticamente com o sistema, mas pode ser gerenciado manualmente pelo **Gerenciador de Serviços**.

---

5. Inicie o backend:
   ```bash
   cd backend
   node app.js
   ```

6. Verifique o frontend:
   ```bash
   cd frontend
   ```
Sobre as coordenadas eu conseguir usando o arquivo GeoLol.js usando a api da geoapify


7. Se quiser fazer alterações, abra o projeto em um editor de código (recomendo [VSCode](https://code.visualstudio.com/)) e edite os arquivos conforme necessário.

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

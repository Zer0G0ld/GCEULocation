# Documentação da API GCEULocation

## Introdução
A API **GCEULocation** é responsável por gerenciar locais geográficos identificados como "GCEU". Ela permite a criação, leitura, atualização e remoção (CRUD) de registros de locais.

## Tecnologias Utilizadas
- **Node.js**
- **Express.js**
- **MongoDB (Mongoose)**
- **Cors**
- **Dotenv**

## Configuração
### Instalação das Dependências
Antes de executar a API, instale as dependências necessárias:
```sh
npm install express mongoose cors dotenv
```

### Configuração do Ambiente
Crie um arquivo `.env` na raiz do projeto e defina a URI do banco MongoDB:
```env
MONGO_URI=mongodb+srv://seu_usuario:senha@cluster.mongodb.net/seu_banco
PORT=3000
```

## Rotas da API
### 1. Rota de Teste
**GET /**
- **Descrição**: Verifica se a API está rodando corretamente.
- **Resposta**:
```json
{"message": "API do GCEULocation está rodando!"}
```

### 2. Criar um Novo GCEU
**POST /gceu**
- **Descrição**: Cria um novo local GCEU.
- **Corpo da Requisição (JSON)**:
```json
{
  "nome": "Local Exemplo",
  "latitude": -23.55052,
  "longitude": -46.633308,
  "descricao": "Ponto de interesse em SP"
}
```
- **Resposta de Sucesso (201 Created)**:
```json
{
  "_id": "65a3bfe76e",
  "nome": "Local Exemplo",
  "latitude": -23.55052,
  "longitude": -46.633308,
  "descricao": "Ponto de interesse em SP"
}
```
- **Resposta de Erro (400 Bad Request)**:
```json
{"error": "Nome, latitude e longitude são obrigatórios!"}
```

### 3. Buscar Todos os GCEUs
**GET /gceu**
- **Descrição**: Retorna todos os GCEUs cadastrados.
- **Resposta de Sucesso (200 OK)**:
```json
[
  {
    "_id": "65a3bfe76e",
    "nome": "Local Exemplo",
    "latitude": -23.55052,
    "longitude": -46.633308,
    "descricao": "Ponto de interesse em SP"
  }
]
```

### 4. Buscar um GCEU por ID
**GET /gceu/:id**
- **Descrição**: Retorna um GCEU específico com base no ID.
- **Resposta de Sucesso (200 OK)**:
```json
{
  "_id": "65a3bfe76e",
  "nome": "Local Exemplo",
  "latitude": -23.55052,
  "longitude": -46.633308,
  "descricao": "Ponto de interesse em SP"
}
```
- **Resposta de Erro (404 Not Found)**:
```json
{"error": "GCEU não encontrado"}
```

### 5. Atualizar um GCEU por ID
**PUT /gceu/:id**
- **Descrição**: Atualiza os dados de um GCEU existente.
- **Corpo da Requisição (JSON)**:
```json
{
  "nome": "Novo Nome",
  "descricao": "Nova descrição atualizada"
}
```
- **Resposta de Sucesso (200 OK)**:
```json
{
  "_id": "65a3bfe76e",
  "nome": "Novo Nome",
  "latitude": -23.55052,
  "longitude": -46.633308,
  "descricao": "Nova descrição atualizada"
}
```
- **Resposta de Erro (404 Not Found)**:
```json
{"error": "GCEU não encontrado"}
```

### 6. Deletar um GCEU por ID
**DELETE /gceu/:id**
- **Descrição**: Remove um GCEU do banco de dados.
- **Resposta de Sucesso (200 OK)**:
```json
{"message": "GCEU removido com sucesso"}
```
- **Resposta de Erro (404 Not Found)**:
```json
{"error": "GCEU não encontrado"}
```

## Execução do Servidor
Para iniciar a API, execute:
```sh
node app.js
```
Ou, se estiver usando `nodemon`:
```sh
npx nodemon app.js
```
O servidor estará rodando em:
```
http://localhost:3000
```

---
**Observação:** Certifique-se de que o MongoDB esteja acessível na nuvem para evitar erros de conexão. Caso tenha problemas, verifique a variável `MONGO_URI` no `.env` e as permissões do banco.

🚀 **API pronta para uso!**


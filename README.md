# OZmap Challenge: API de Geolocalização

Esta é uma API RESTful para gerenciamento de localizações geográficas, desenvolvida como solução para o Desafio Técnico da OZmap. A aplicação permite criar, consultar e gerenciar regiões poligonais, além de oferecer buscas geoespaciais avançadas.

## ✨ Funcionalidades

- ✅ **CRUD Completo** para Regiões (Criar, Ler, Atualizar, Deletar).
- ✅ **Busca geoespacial** para listar regiões que contêm um ponto específico.
- ✅ **Busca geoespacial** para listar regiões próximas a um ponto, dentro de um raio de distância.
- ✅ **Busca por endereço**: converte um endereço de texto em coordenadas e retorna as regiões que o contêm.
- ✅ Ambiente de desenvolvimento e banco de dados **containerizado com Docker**.
- ✅ **Testes de Integração e Unitários** garantindo a confiabilidade da API.
- ✅ **Linting e Formatação** com ESLint e Prettier para manter a qualidade e consistência do código.

## 🛠️ Tecnologias Utilizadas

- **Node.js** (v22+)
- **TypeScript**
- **Express.js**
- **MongoDB** (v8+) com **Mongoose**
- **Docker** e **Docker Compose**
- **Mocha** & **Chai** (Testes de Integração)
- **Sinon** (Testes Unitários com Mocks)
- **ESLint** & **Prettier**

## 🚀 Começando

Siga as instruções abaixo para executar o projeto em seu ambiente local.

### Pré-requisitos

Você vai precisar ter as seguintes ferramentas instaladas:
- [Node.js](https://nodejs.org/) (versão 22 ou superior)
- [Docker](https://www.docker.com/products/docker-desktop/) e Docker Compose

### Instalação e Execução

1.  **Clone o repositório:**
    ```
    git clone https://github.com/gabrielcardn/geo-regions-api
    ```

2.  **Instale as dependências:**
    ```
    npm install
    ```

3.  **Configure as Variáveis de Ambiente:**
    Crie um arquivo chamado `.env` na raiz do projeto, copiando o exemplo do arquivo `.env.example`.
    ```
    cp .env.example .env
    ```
    O arquivo `.env` já vem com valores padrão para o ambiente de desenvolvimento.

4.  **Inicie o Banco de Dados com Docker:**
    Este comando irá baixar a imagem do MongoDB e iniciar o container em segundo plano.
    ```
    docker-compose up -d
    ```

5.  **Inicie a Aplicação:**
    ```
    npm run dev
    ```
    O servidor estará rodando em `http://localhost:3000`.

## 🧪 Rodando os Testes

Para garantir que tudo está funcionando como esperado, execute a suíte de testes completa:

```bash
npm test
```
Este comando executa tanto os testes de integração (que validam os endpoints da API) quanto os testes unitários (que validam lógicas de negócio isoladas).

## 📄 Documentação da API (Endpoints)

A seguir estão os endpoints disponíveis na API.

---

### Regiões

#### `POST /regions`
Cria uma nova região.

**Corpo da Requisição (Body):**
```json
{
  "name": "Centro da Cidade",
  "coordinates": {
    "type": "Polygon",
    "coordinates": [
      [
        [-46.63, -23.55],
        [-46.62, -23.55],
        [-46.62, -23.56],
        [-46.63, -23.56],
        [-46.63, -23.55]
      ]
    ]
  }
}
```
**Resposta de Sucesso (201 Created):**
```json
{
  "_id": "672f...",
  "name": "Centro da Cidade",
  "coordinates": { ... },
  "__v": 0
}
```

---

#### `GET /regions`
Lista todas as regiões cadastradas.

**Resposta de Sucesso (200 OK):**
```json
[
  {
    "_id": "672f...",
    "name": "Centro da Cidade",
    "coordinates": { ... }
  },
  {
    "_id": "abc1...",
    "name": "Zona Norte",
    "coordinates": { ... }
  }
]
```

---

#### `GET /regions/:id`
Busca uma região específica pelo seu ID.

**Resposta de Sucesso (200 OK):**
```json
{
  "_id": "672f...",
  "name": "Centro da Cidade",
  "coordinates": { ... }
}
```
**Resposta de Erro (404 Not Found):** Se o ID não for encontrado.

---

#### `PUT /regions/:id`
Atualiza os dados de uma região.

**Corpo da Requisição (Body):**
```json
{
  "name": "Centro da Cidade - Atualizado"
}
```
**Resposta de Sucesso (200 OK):** Retorna o objeto da região com os dados atualizados.

---

#### `DELETE /regions/:id`
Deleta uma região.

**Resposta de Sucesso (204 No Content):** Retorna uma resposta vazia.

---

### Buscas Geoespaciais

#### `GET /regions/contains-point`
Lista as regiões que contêm um ponto geográfico.

**Parâmetros da Query:**
- `lat` (number, obrigatório): Latitude do ponto.
- `lng` (number, obrigatório): Longitude do ponto.

**Exemplo:** `http://localhost:3000/regions/contains-point?lat=-23.55&lng=-46.63`

---

#### `GET /regions/near-point`
Lista as regiões próximas a um ponto, dentro de um raio de distância.

**Parâmetros da Query:**
- `lat` (number, obrigatório): Latitude do ponto.
- `lng` (number, obrigatório): Longitude do ponto.
- `distance` (number, obrigatório): Distância máxima em **metros**.

**Exemplo:** `http://localhost:3000/regions/near-point?lat=-23.55&lng=-46.63&distance=5000`

---

#### `GET /regions/by-address`
Lista as regiões que contêm um endereço.

**Parâmetros da Query:**
- `address` (string, obrigatório): O endereço a ser buscado.

**Exemplo:** `http://localhost:3000/regions/by-address?address=Avenida Paulista, 1578, São Paulo`

---
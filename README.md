- Iniciei utilizando as especificações do problema e, principalmente, as configurações pré estabelecidas nos arquivos enviados
- Criando a arquitetura básica do projeto, para ter a organização desde o início
    ```mkdir src\config, src\controllers, src\database, src\models, src\routes, src\services, src\utils```
A estrutura src/{config,controllers,database,models,routes,services,utils} segue o princípio de Separação de Responsabilidades, garantindo clareza, manutenção e escalabilidade do código.
routes: Define as URLs e os métodos HTTP, encaminhando as requisições para os controladores.
controllers: Intermediam entre requisições HTTP e a lógica de negócio, validando dados e chamando os serviços adequados.
services: Implementam a lógica de negócio, mantendo a aplicação independente da camada de transporte.
models: Definem a estrutura dos dados e schemas do Mongoose.
database: Centraliza a configuração e conexão com o MongoDB.
config: Armazena parâmetros de configuração, como variáveis de ambiente e chaves de API.
utils: Contém funções auxiliares reutilizáveis em todo o projeto.
Essa organização evita acoplamento excessivo, facilita testes unitários e permite evolução do projeto com menor custo de manutenção.


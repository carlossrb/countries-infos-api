# countries infos api

O projeto consistiu em criar uma api rest para alimentar um frontend que buscava locais para se conhecer ao redor do mundo. Dada essa condição, tem-se algumas restrições para realização do CRUD. As principais considerações do projeto foram:

- A API deverá ser desenvolvida com Node.js e Express;
- Apenas o Local e a Meta poderão ser editados;
- O mesmo local em determinado país não poderá ser adicionado de forma duplicada;
- A listagem dos dados deverá ser ordenada de forma crescente pela meta;

Além disso, é informado os dados que serão requisitados:

- País: O país escolhido;
- Local: O local dentro do país escolhido;
- Meta: O mês e o ano que o usuário pretende visitar o local;
- Url da bandeira do país;
- Data de criação do registro;
- Data de atualização do registro.

Dada essas condições, desenvolveu-se a API **countries-infos-api** com as seguintes tecnologias:

 - [x] **NodeJS;**
- [x] **Typescript;**
- [x] **NestJS;**
- [x] **Docker e docker-compose;**
- [x] **Jest para testes;**
- [x] **TypeORM como ORM;**
- [x] **PostgreSQL  como database**;
- [x] **Github CI para Push e PR na master;**
- [x] **Demais tecnologias como husky no pre-commit .**

Além disso, no momento que sobe o projeto, é possível ter acesso ao **pgadmin4** e ao **redis-commander** pra melhor gerenciamento do database criado e do cache, caso seja usado em alguma rota quando necessário.

## Executando o projeto
Para testar local, faz-se necessário subir um docker compose ou ainda, configurar um banco postgres em sua máquina. A fim de facilitar, usar o docker compose torna mais simples o processo. 

Anteriormente a isso, verifique se tem um arquivo **.env** na raiz do projeto. As variáveis necessárias estão presentes no arquivo **.env.example** no repositório.

*Buildar* o projeto

```bash

docker-compose build

```

Rodar o projeto em modo *watch*

```bash

docker-compose up

```
Ao salvar as modificações, é dado reload automaticament no projeto. 

Além disso, para demais comandos, como teste e lint, é preciso apenas executar os comandos presentes no `package.json`, como por exemplo:

```bash

yarn test

```

## Rotas e documentação

### Para a documentação detalhada, basta consultar diretamente no swagger na seguinte rota:

```bash
 GET /docs
 ```

### Para criar um novo local, utiliza-se a rota:
```bash
 POST /places
 ```
 Com um body:
```json
{
"location": "Vitória da Conquista",
"country": "Brazil",
"goal": "2023-09-07T10:13:00.028Z",
"imageUrl": "https://sm.ign.com/ign_br/gallery/t/the-last-o/the-last-of-us-hbo-series-character-guide_nr24.jpg"
}
```
OBS: apenas urls são aceitas na criação de um local

### Para atualizar meta e local

```bash
 PATCH /places/:placeId
 ```

passando os valores de exemplo apenas:

```json
{
"location": "Salvador",
"goal": "2023-10-29T11:15:00.001Z"
}
```

### Para excluir um local

```bash
 DELETE /places/:placeId
 ```

### Para obter um local em específico

```bash
 GET /places/:placeId
 ```

### Para listar os locais ordenado pela data da meta

```bash
 GET /places
 ```
 
 ## Melhorias possívels
Ao finalizar o projeto, sentiu-se necessidade de algumas melhorias, como por exemplo um teste e2e para as rotas do único controller criado e um deploy diretamente em uma cloud (google cloud, como requisitado). O processo de CI/CD é muito facilitado como github actions, porém, o CD ficará para uma v2 do projeto.

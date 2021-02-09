# query-builder
🔍️ A simple query builder for Wikidata SPARQL queries

## Test system

You can test this query builder in https://query-builder-test.toolforge.org

## Development

The following examples use `docker` and `docker-compose` to ease creating a level playing field for development but they are not essential to this project.

### Installation

```sh
# Set up and modify the environment variables according to your preferences
cp .env.example .env

# ensure the node user uses your user id, so you own created files
docker-compose build --build-arg UID=$(id -u) --build-arg GID=$(id -g) node

# install npm dependencies
docker-compose run --rm node npm i
```

### Running npm

```sh
docker-compose run --rm node npm
```

### Starting the development server

```sh
docker-compose up dev
```

### Running browser tests

#### To run browser tests locally:

Run: `QB_URL=localhost:8080 npm run e2e`

#### To run Cypress browser tests locally:

Run: `docker-compose --env-file .env.example -f docker-compose.yml -f docker-compose.e2e.yml up e2e`

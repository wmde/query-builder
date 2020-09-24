# query-builder
🔍️ A simple query builder for Wikidata SPARQL queries

## Development

The following examples use `docker` and `docker-compose` to ease creating a level playing field for development but they are not essential to this project.

### Installation

```sh
# Set up and modify the environment variables according to your preferences
cp .env.example .env
```

```sh
# ensure the node user uses your user id, so you own created files
docker-compose build --build-arg UID=$(id -u) --build-arg GID=$(id -g) node
```

```
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

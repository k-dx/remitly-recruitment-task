#!/bin/bash

# Delete the containers and the database
if [ "$(docker ps -a -q -f name=remitly-api-1)" ]; then
    docker rm -f remitly-api-1
fi
if [ "$(docker ps -a -q -f name=remitly-database-1)" ]; then
    docker rm -f remitly-database-1
fi

if [ "$(docker volume ls -q -f name=remitly_postgres-data)" ]; then
    docker volume rm remitly_postgres-data
fi

# Run the tests
docker compose -f docker-compose.test.yml up --build --no-attach database
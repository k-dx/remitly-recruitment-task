#!/bin/bash

# Delete the containers and the database
docker rm remitly-api-1 remitly-database-1
docker volume rm remitly_postgres-data

# Run the tests
docker compose -f docker-compose.test.yml up --no-attach database
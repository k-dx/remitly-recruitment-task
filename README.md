# Home Exercise 2025 for internship at Remitly

## Description

Assumptions according to the answers from the email:
* the swift codes are always 11 characters long
* the CODE TYPE is always BIC11, thus can be omitted

Other remarks:
* I am not storing TOWN NAME and TIME ZONE columns in the database as they are not provided in the insert request. They could be deduced from the ADDRESS (if it's provided), however this would be complicated due to the need to extract the town name from address and look up the time zone (using a database/external service). 
* I am not using an ORM for simplicity, however it should be considered if this api server was to be extended further.

## How to run

### Development

```
docker compose up --build
```

### Production

1. Build the containers:
```
docker compose -f docker-compose.prod.yml build
```

2. Run:
```
docker compose -f docker-compose.prod.yml up -d
```

### Tests

```
./test.sh
```

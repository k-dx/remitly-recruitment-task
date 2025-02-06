# Home Exercise 2025 for internship at Remitly

## Description

Assumptions according to the answers from the email:
* the SWIFT CODEs are always 11 characters long
* the CODE TYPE is always BIC11, thus can be omitted

Other remarks:
* I am not storing TOWN NAME and TIME ZONE columns in the database as they are not provided in the insert request. They could be deduced from the ADDRESS (if it's provided), however this would be complicated due to the need to extract the town name from address and look up the time zone (using a database/external service). 
* I am not using an ORM for simplicity, however it should be considered if this api server was to be extended further.
* I didn't try to optimize the database queries too much, following "premature optimization is the root of all evil". If the application performance would not be sufficient, it should then be optimized.
* `.env*` files of course shouldn't be checked into source control, I decided to do so to make running the project for the first time more seamless.

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

3. (Optional) import tsv:
    1. Export the spreadsheet as TSV and put the file into `data/input.tsv`. The `data/` directory is visible for the docker container.
    2. Import the data
   ```
   docker exec -it remitly-api-prod-1 npm run import
   ```
> [!WARNING]
> Importing the TSV clears the already existing data (to avoid collisions).

### Tests

```
./test.sh
```

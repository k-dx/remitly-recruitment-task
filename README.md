# Home Exercise 2025 for internship at Remitly

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
docker compose -f docker-compose.prod.yml up -d
```
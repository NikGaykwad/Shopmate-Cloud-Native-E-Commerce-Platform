# Shopmate Architecture

## Overview
Shopmate parses microservices patterns to provide a scalable e-commerce solution.
It uses **Node.js** for backend services, **React** for the frontend, and manages state with **PostgreSQL**, **MongoDB**, and **Redis**.

## Service Interaction Flow
```mermaid
graph TD
    Client[Client Browser] -->|HTTP| Gateway[API Gateway]
    
    Gateway -->|/auth| Auth[Auth Service]
    Gateway -->|/products| Product[Product Service]
    Gateway -->|/cart| Cart[Cart Service]
    Gateway -->|/orders| Order[Order Service]
    Gateway -->|/payments| Payment[Payment Service]
    Gateway -->|/search| Search[Search Service]
    Gateway -->|/user| User[User Service]

    Auth -->|Read/Write| Postgres[(PostgreSQL)]
    User -->|Read| Postgres
    Order -->|Read/Write| Postgres
    Payment -->|Write| Postgres

    Product -->|Read/Write| Mongo[(MongoDB)]
    Search -->|Read| Mongo

    Cart -->|Read/Write| Redis[(Redis)]

    Order -->|Notify| Notification[Notification Service]
```

## Technology Stack
- **Frontend**: React, Vite, TailwindCSS, Framer Motion
- **Gateway**: Express HTTP Proxy
- **Auth**: JWT, BCrypt
- **Databases**:
  - PostgreSQL 15 (Relational Data)
  - MongoDB 6 (Document Data, Catalog)
  - Redis 7 (Caching)
- **Infrastructure**: Docker, Kubernetes (K8s)

## Directory Structure
- `services/*`: Individual microservices.
- `frontend/`: React SPA source code.
- `k8s/`: Kubernetes YAML manifests.
- `docker-compose.yml`: Local implementation reference.

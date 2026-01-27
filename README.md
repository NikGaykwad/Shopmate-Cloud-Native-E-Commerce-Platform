# Shopmate - Modern E-Commerce Microservices Platform

Shopmate is a full-stack, microservices-based e-commerce application. It features a modern React frontend with a premium UI and a robust backend composed of multiple specialized services (Auth, Product, Cart, Order, etc.).

---

## 🚀 Quick Start (Docker Compose)

### Prerequisites
- **Docker Desktop** (Installed & Running)

### 1️⃣ Run the Application
Open your terminal in the root directory and run:
```bash
docker-compose up --build
```
*Wait for a few minutes for all services to start.*

### 2️⃣ Access the App
- **Frontend (Store)**: [http://localhost:5173](http://localhost:5173)
- **API Gateway**: [http://localhost:8000](http://localhost:8000)

---

## ☸️ Kubernetes Deployment

To deploy Shopmate on Kubernetes (Kind, Minikube, or EKS), you will need to create and apply Kubernetes manifest files.

### 1. Required Manifest Files

You should create a `k8s/` directory and populate it with the following YAML files. Structure them by service or type.

#### Core Infrastructure
- `k8s/namespace.yaml` (Optional, to isolate the app)
- `k8s/secrets.yaml` (For DB passwords, JWT secrets)
- `k8s/configmap.yaml` (Env variables like Service URLs)

#### Databases (StatefulSets)
- `k8s/postgres-deployment.yaml` + `k8s/postgres-service.yaml` + `k8s/postgres-pvc.yaml`
- `k8s/mongo-deployment.yaml` + `k8s/mongo-service.yaml` + `k8s/mongo-pvc.yaml`
- `k8s/redis-deployment.yaml` + `k8s/redis-service.yaml`

#### Microservices (Deployments & Services)
For each service (**auth**, **product**, **cart**, **order**, **payment**, **api-gateway**, **frontend**), create a Deployment and a Service.

**Example: Auth Service**
- `k8s/auth-deployment.yaml`:
  - Replicas: 2
  - Image: `your-registry/shopmate-auth:latest`
  - Env: Refer to ConfigMaps/Secrets
- `k8s/auth-service.yaml`:
  - Type: ClusterIP
  - Port: 8001

**List of Service Manifests needed:**
1.  `auth-deployment.yaml` / `auth-service.yaml`
2.  `product-deployment.yaml` / `product-service.yaml`
3.  `cart-deployment.yaml` / `cart-service.yaml`
4.  `order-deployment.yaml` / `order-service.yaml`
5.  `payment-deployment.yaml` / `payment-service.yaml`
6.  `api-gateway-deployment.yaml` / `api-gateway-service.yaml` (LoadBalancer or NodePort for external access)
7.  `frontend-deployment.yaml` / `frontend-service.yaml` (LoadBalancer or NodePort)

### 2. Deployment Steps

#### Step 1: Build & Push Images
If using **Minikube** or **Kind**, you can load images directly. If using **EKS**, push to ECR/Docker Hub.

**For Docker Hub/ECR:**
```bash
docker build -t your-username/shopmate-auth ./services/auth-service
docker push your-username/shopmate-auth
# Repeat for all services...
```

**For Kind (Local):**
```bash
kind load docker-image shopmate-auth shopmate-product ... --name your-cluster-name
```

#### Step 2: Apply Manifests
Apply the configuration in this order:
```bash
# 1. Apply Configs & Secrets
kubectl apply -f k8s/configmap.yaml
kubectl apply -f k8s/secrets.yaml

# 2. Deploy Databases
kubectl apply -f k8s/postgres-deployment.yaml
kubectl apply -f k8s/mongo-deployment.yaml
kubectl apply -f k8s/redis-deployment.yaml

# 3. Deploy Services
kubectl apply -f k8s/auth-deployment.yaml
kubectl apply -f k8s/product-deployment.yaml
# ... apply all other service deployments ...

# 4. Deploy Frontend & Gateway
kubectl apply -f k8s/api-gateway-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
```

#### Step 3: Access the App
- **Minikube**: `minikube service shopmate-frontend`
- **Kind/Localhost**: Access via NodePort or Port Forward:
  ```bash
  kubectl port-forward svc/shopmate-frontend 5173:80
  ```
- **EKS**: Use the LoadBalancer External IP provided by AWS.

---

## ️ Customization & Features

### New Features (v2.0)
- **My Account**: Full profile management, address book, and order history.
- **Secure Checkout**: Integrated with user profile to use saved addresses.

### Adding Products
1.  Add images to `frontend/public/images/`.
2.  Edit `services/product-service/src/seed.ts`.
3.  Run `docker exec shopmate-product npm run seed`.

---

## 📂 Project Structure

| Path | Description |
| :--- | :--- |
| **`frontend/`** | **React Frontend** |
| `frontend/src/pages/account/` | **[NEW]** User Profile, Address, Orders pages |
| `frontend/src/pages/Checkout.tsx` | Updated Checkout with Address Selection |
| **`services/`** | **Backend Microservices** |
| `services/api-gateway/` | Routes `/auth`, `/users`, `/products`, `/orders` |
| `services/auth-service/` | Authentication & **User Profile Management** |
| `services/order-service/` | Order creation and history |

---

## 🏗️ Services & Ports

| Service | Port | Database |
| :--- | :--- | :--- |
| **Frontend** | 5173 | - |
| **API Gateway** | 8000 | - |
| **Auth Service** | 8001 | Postgres |
| **User Service** | 8002 | Postgres |
| **Product Service** | 8003 | MongoDB |
| **Search Service** | 8004 | Elasticsearch/Mongo |
| **Cart Service** | 8005 | Redis |
| **Order Service** | 8006 | Postgres |
| **Payment Service** | 8007 | Postgres |

---

## ❓ Troubleshooting

### Connection Refused (Frontend -> Backend)?
- Ensure `api-gateway` is running.
- If running on K8s, ensure `VITE_API_GATEWAY_URL` in frontend points to the Gateway Service (e.g., `http://api-gateway:8000` inside cluster, or LoadBalancer IP).

### Database Errors?
- Check `kubectl logs -l app=shopmate-auth` (or relevant service).
- Ensure Secrets for DB passwords match what's in the Deployment env vars.


# Shopmate - Modern Cloud-Native E-Commerce Platform

Shopmate is a full-stack, microservices-based e-commerce application designed for scalability and modern cloud deployment. It features a premium React frontend and a robust backend composed of specialized services.

---

## 🛠️ Tech Stack

### Frontend
*   **Framework**: [React 18](https://reactjs.org/) (Vite)
*   **Language**: TypeScript
*   **Styling**: Tailwind CSS + Framer Motion (Animations)
*   **State Management**: React Context API
*   **Icons**: Lucide React

### Backend (Microservices)
*   **Runtime**: Node.js (v18+)
*   **Framework**: Express.js
*   **Language**: TypeScript
*   **Structure**:
    *   `auth-service`: User authentication & Profile management
    *   `product-service`: Product catalog & Inventory
    *   `order-service`: Order processing & History
    *   `cart-service`: Shopping cart management
    *   `api-gateway`: Unified entry point (Reverse Proxy)

### Databases
*   **PostgreSQL**: Relational data (Users, Orders, Payments)
*   **MongoDB**: NoSQL document store (Products, Catalogs)
*   **Redis**: In-memory key-value store (Shopping Cart caching)

### Infrastructure
*   **Containerization**: Docker & Docker Compose
*   **Orchestration**: Kubernetes (Ready for EKS/Minikube)
*   **Reverse Proxy**: Nginx (Internal Gateway)

---

## 🚀 Quick Start (Docker Compose)

### Prerequisites
*   **Docker Desktop** (Installed & Running)

### 1️⃣ Run the Application
Open your terminal in the root directory and run:
```bash
docker-compose up --build
```
*Wait for a few minutes for all services to start.*

### 2️⃣ Access the App
*   **Frontend (Store)**: [http://localhost:5173](http://localhost:5173)
*   **API Gateway**: [http://localhost:8000](http://localhost:8000)

---

## 🔮 Future Scope: Production Grade AWS Deployment (EKS)

To achieve a production-grade experience, we recommend migrating from local Docker Compose to **AWS EKS (Elastic Kubernetes Service)** with the following architecture.

### 1. Cloud Architecture (AWS)

#### **VPC Design (Networking)**
*   **VPC**: Custom VPC (e.g., `10.0.0.0/16`) for isolation.
*   **Public Subnets**:
    *   For **Application Load Balancer (ALB)** and **NAT Gateways**.
    *   Allows external traffic to reach the Ingress Controller.
*   **Private Subnets**:
    *   For **EKS Worker Nodes**, **RDS Databases**, and **ElastiCache**.
    *   NO direct internet access. Outbound traffic routes via NAT Gateway.

#### **Managed Databases (Migration)**
Instead of running DBs in containers, use managed AWS services for high availability (Multi-AZ) and automated backups.
*   **PostgreSQL** → **AWS RDS (Relational Database Service)**
    *   *Connection*: Update `DB_HOST` env var in EKS to the RDS Endpoint.
    *   *Security*: Allow inbound execution on port `5432` from the EKS Node Security Group.
*   **MongoDB** → **AWS DocumentDB** or **MongoDB Atlas**
    *   *Note*: Ensure compatibility string is configured if using DocumentDB.
*   **Redis** → **AWS ElastiCache (Redis)**
    *   Use a replication group for high availability.

#### **Traffic Management**
*   **Route 53**: Manage DNS records (e.g., `shopmate.com`).
*   **AWS ALB (Application Load Balancer)**: Distributes SSL traffic to the EKS Cluster.
*   **Ingress Controller**: Use **AWS Load Balancer Controller** in EKS to manage the ALB automatically.

### 2. Observability Stack (Monitoring & Logging)

To create a "Real-World" monitoring experience:

#### **Logging (EFK Stack or CloudWatch)**
*   **Fluent Bit**: Run as a DaemonSet on EKS nodes to collect container logs.
*   **CloudWatch**: Send logs to AWS CloudWatch Logs for retention and searching.
*   **Elasticsearch + Kibana (Optional)**: For advanced log analysis and visualization.

#### **Monitoring & Alerting**
*   **Prometheus**: Deploy inside EKS (using Helm) to scrape metrics from services.
*   *Exporters*: Node Exporter (Infrastructure metrics), Postgres Exporter (DB metrics).
*   **Grafana**: Visualize metrics with dashboards (CPU/Memory usage, Request Latency, Error Rates).
*   **AlertManager**: Send alerts (Slack/Email) when pods crash or latency spikes.

### 3. CI/CD Pipeline
*   **GitHub Actions / AWS CodePipeline**:
    1.  **Build**: Lint code, run unit tests.
    2.  **Publish**: Build Docker images -> Push to **AWS ECR (Elastic Container Registry)**.
    3.  **Deploy**: Update EKS manifests (or Helm Charts) to use the new image tag.

---

## ⎈ Helm Deployment (Alternative)

Instead of applying raw Kubernetes manifests, you can use **Helm** to package and deploy the application.

### 1. Create the Chart
Initialize a new chart:
```bash
helm create shopmate-chart
```

### 2. Migration Strategy
*   Move `.yaml` files from `k8s/` to `shopmate-chart/templates/`.
*   Replace hardcoded values (Images, Replicas, Service URLs) with `{{ .Values.key }}` placeholders.
*   Define these values in `values.yaml`.

### 3. Deploy
```bash
# Install
helm install shopmate ./shopmate-chart

# Upgrade
helm upgrade shopmate ./shopmate-chart
```

---

## 📂 Project Structure

| Path | Description |
| :--- | :--- |
| **`frontend/`** | **React Frontend** (Pages, Components, Context) |
| `frontend/src/pages/account/` | User Profile, Address, Orders pages |
| `frontend/src/pages/Checkout.tsx` | Updated Checkout with Address Selection |
| **`services/`** | **Backend Microservices** |
| `services/api-gateway/` | Routes `/auth`, `/users`, `/products`, `/orders` |
| `services/auth-service/` | Authentication & User Profile |
| `services/product-service/` | Product operations & Seeding |
| `services/order-service/` | Order lifecycle (Custom IDs, SMS Log) |

---

## ❓ Troubleshooting

### Connection Refused?
*   Ensure `api-gateway` is running.
*   Check if `VITE_API_GATEWAY_URL` matches the backend URL.

### "Product Not Found" on Checkout?
*   If you recently reseeded the database, **Clear your Cart**. Old product IDs in the cart are likely invalid.
*   Go to Cart -> Remove All -> Add New Items.

### Database Connection Fails?
*   Ensure Docker containers for Postgres/Mongo are healthy.
*   Check `docker logs shopmate-auth` (or relevant service).
*   On EKS: Check Security Groups ensuring Node Group can talk to RDS.

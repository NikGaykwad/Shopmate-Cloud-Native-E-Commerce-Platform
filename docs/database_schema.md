# Shopmate Database Schemas

## PostgreSQL (Relational Data)

### `users` Table
Stores user credentials and profile info.
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(100),
    role VARCHAR(50) DEFAULT 'customer', -- 'customer' or 'admin'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `orders` Table
Stores order information.
```sql
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'paid', 'shipped'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### `order_items` Table
Links products to orders.
```sql
CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    product_id VARCHAR(24) NOT NULL, -- MongoDB ObjectId as string
    quantity INTEGER NOT NULL,
    price_at_purchase DECIMAL(10, 2) NOT NULL
);
```

### `payments` Table
Stores payment transaction records.
```sql
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    order_id INTEGER REFERENCES orders(id),
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) DEFAULT 'success',
    method VARCHAR(50), -- 'credit_card', 'upi', etc.
    transaction_id VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## MongoDB (Product Catalog)

### `products` Collection
Flexible schema for products using Mongoose.

```javascript
const ProductSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  category: { type: String },
  stock: { type: Number, default: 0 },
  images: [{ type: String }], // Array of image URLs
  created_at: { type: Date, default: Date.now }
});

// Text index for search
ProductSchema.index({ name: 'text', description: 'text' });
```

---

## Redis (Cart Cache)

### Key Structure
- **Key**: `cart:{userId}`
- **Value**: JSON String of cart items.
- **Expiry**: 24 hours (86400 seconds).

**Example Value**:
```json
[
  { "productId": "64b0f...", "quantity": 2, "price": 100 },
  { "productId": "64b1a...", "quantity": 1, "price": 50 }
]
```

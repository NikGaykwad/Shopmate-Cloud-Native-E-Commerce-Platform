import express from 'express';
import cors from 'cors';
import proxy from 'express-http-proxy';
import dotenv from 'dotenv';
import axios from 'axios';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

app.get('/health', (req, res) => {
    res.json({ status: 'UP', service: 'api-gateway' });
});

app.get('/', (req, res) => {
    res.send('Welcome to Shopmate API Gateway! Services are running.');
});

// Proxy Rules
const authUrl = process.env.AUTH_SERVICE_URL || 'http://localhost:8001';
const productUrl = process.env.PRODUCT_SERVICE_URL || 'http://localhost:8003';
const cartUrl = process.env.CART_SERVICE_URL || 'http://localhost:8005';
const orderUrl = process.env.ORDER_SERVICE_URL || 'http://localhost:8006';
const paymentUrl = process.env.PAYMENT_SERVICE_URL || 'http://localhost:8007';

// Auth Middleware
const authMiddleware = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const verifyUrl = `${process.env.AUTH_SERVICE_URL || 'http://localhost:8001'}/auth/verify`;
        const response = await axios.get(verifyUrl, {
            headers: { Authorization: token }
        });

        if (response.data.valid) {
            req.headers['x-user-id'] = response.data.user.id;
            req.headers['x-user-role'] = response.data.user.role;
            next();
        } else {
            res.status(401).json({ message: 'Invalid token' });
        }
    } catch (error) {
        res.status(401).json({ message: 'Authentication failed' });
    }
};

app.use('/auth', proxy(authUrl, {
    proxyReqPathResolver: (req) => '/auth' + req.url
}));

app.use('/products', proxy(productUrl, {
    proxyReqPathResolver: (req) => '/products' + req.url
}));

app.use('/cart', proxy(cartUrl, {
    proxyReqPathResolver: (req) => '/cart' + req.url
}));

// PROTECTED ROUTES
app.use('/orders', authMiddleware, proxy(orderUrl, {
    proxyReqPathResolver: (req) => '/orders' + req.url,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        if (srcReq.headers['x-user-id']) {
            proxyReqOpts.headers['x-user-id'] = srcReq.headers['x-user-id'];
        }
        return proxyReqOpts;
    }
}));

app.use('/payments', authMiddleware, proxy(paymentUrl, {
    proxyReqPathResolver: (req) => '/payments' + req.url,
    proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
        if (srcReq.headers['x-user-id']) {
            proxyReqOpts.headers['x-user-id'] = srcReq.headers['x-user-id'];
        }
        return proxyReqOpts;
    }
}));

app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
});

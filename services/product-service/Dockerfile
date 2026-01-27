# Comments:
# This Dockerfile builds the Product Service.
# 1. node:18-alpine for minimal size.
# 2. Copies package.json for caching.
# 3. Builds TypeScript code.
# 4. Exposes port 8003.

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8003

# Run migrations/seed if needed via command override, or just start server
CMD ["npm", "start"]

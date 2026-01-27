# Comments:
# This Dockerfile builds the Auth Service.
# 1. We use node:18-alpine for a small footprint.
# 2. We copy package.json first to cache dependencies.
# 3. We build the TypeScript code to JavaScript.
# 4. We expose port 8001.

FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 8001

CMD ["npm", "start"]

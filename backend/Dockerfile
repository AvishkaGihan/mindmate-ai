# Build Stage
FROM node:20-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production Stage
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY --from=builder /app/dist ./dist
# Note: In production, secrets like serviceAccountKey.json should be
# mounted via secret manager or base64 decoded from ENV
COPY src/config/serviceAccountKey.json ./src/config/

EXPOSE 5000
CMD ["node", "dist/server.js"]
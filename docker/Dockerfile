FROM node:24-alpine AS builder

WORKDIR /home/app

COPY package*.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund

COPY tsconfig.json tsconfig.node.json ./
COPY react-router.config.ts vite.config.ts ./
COPY .env/ ./.env/
COPY src/ ./src/
RUN npm run build

# ---

FROM node:24-alpine

RUN apk add --no-cache curl

WORKDIR /home/app

RUN addgroup -S appuser && adduser -S appuser -G appuser

COPY --from=builder /home/app/package*.json ./
RUN npm ci --omit=dev --ignore-scripts --no-audit --no-fund && npm cache clean --force

COPY --from=builder /home/app/build/ ./build/

RUN chown -R appuser:appuser /home/app

USER appuser

ENV PORT=8080
EXPOSE 8080

CMD ["npx", "react-router-serve", "./build/server/index.js"]

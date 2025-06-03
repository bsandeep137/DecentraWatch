# Build stage
FROM node:20-alpine as builder

WORKDIR /app

# Copy all necessary files first
COPY package.json .
COPY bun.lock .
COPY turbo.json .
COPY apps/frontend ./apps/frontend/
COPY packages ./packages/

# Install dependencies
RUN npm install -g bun
RUN bun install

# Build the application
ENV NODE_ENV=production
RUN cd apps/frontend && bun run build

# Production stage
FROM node:20-alpine

WORKDIR /app

# Install Bun in production
RUN npm install -g bun

# Copy only the necessary files from builder
COPY --from=builder /app/apps/frontend/.next ./.next
COPY --from=builder /app/apps/frontend/public ./public
COPY --from=builder /app/apps/frontend/package.json ./
COPY --from=builder /app/node_modules ./node_modules

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

CMD ["npm", "run", "start"]



# Use the official Bun image as the base image
FROM oven/bun:1 AS base

# Install OpenSSL and PostgreSQL client
RUN apt-get update -y && apt-get install -y openssl postgresql-client

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json ./
COPY bun.lock ./
COPY turbo.json ./

# Install dependencies at root level
RUN bun install

# Copy application code
COPY apps/api/ ./apps/api/
COPY packages/db/ ./packages/db/
COPY packages/common/ ./packages/common/

# Set environment variables
# ENV DATABASE_URL="postgres://postgres:password@postgres:5432/postgres?schema=public"

# Generate Prisma client and build the application
RUN cd packages/db && bun add -d prisma && DATABASE_URL=${DATABASE_URL} bunx prisma generate
RUN cd apps/api && bun run build

# Create startup script
RUN echo '#!/bin/sh\ncd /app/packages/db && DATABASE_URL=${DATABASE_URL} bunx prisma migrate deploy && cd /app/apps/api && bun run start' > /app/start.sh
RUN chmod +x /app/start.sh

# Expose the API port
EXPOSE 3001

# Start the application
CMD ["/app/start.sh"]

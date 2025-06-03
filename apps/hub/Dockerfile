FROM oven/bun:1 AS base

WORKDIR /app

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Copy package files
COPY package*.json ./
COPY bun.lock ./
COPY turbo.json ./

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY apps/hub/ ./apps/hub/
COPY packages/db/ ./packages/db/
COPY packages/common/ ./packages/common/

# Set environment variable
# ENV DATABASE_URL="postgres://postgres:password@postgres:5432/postgres?schema=public"

# Build the application and generate Prisma client
RUN cd packages/db  && bun add -d prisma && DATABASE_URL=${DATABASE_URL} bunx prisma generate
RUN cd apps/hub && bun install &&bun run build 


RUN echo '#!/bin/sh\ncd /app/packages/db && DATABASE_URL=${DATABASE_URL} bunx prisma migrate deploy && cd /app/apps/hub && bun run start' > /app/start.sh
RUN chmod +x /app/start.sh
# Expose the port
EXPOSE 8082

# Start the application
CMD ["/app/start.sh"]

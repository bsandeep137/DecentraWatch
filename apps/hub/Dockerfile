# Use the official Bun image
FROM oven/bun:1 as base

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json .
COPY bun.lock .

# Install root dependencies
RUN bun install

# Copy packages directory
COPY packages/ ./packages/

# Set working directory to db package for Prisma
WORKDIR /app/packages/db

# Install Prisma CLI
RUN bun add -D prisma

# Generate Prisma client
RUN bunx prisma generate

# Set working directory back to Hub
WORKDIR /app/apps/hub

# Copy the Hub application
COPY apps/hub/ ./apps/hub/

# Install hub-specific dependencies
RUN bun install

# Expose the port your Hub runs on
EXPOSE 8081

# Add environment variable support
ENV NODE_ENV=production
ENV REWARD_PER_TICK=1

# Start the application
CMD ["bun", "index.ts"] 
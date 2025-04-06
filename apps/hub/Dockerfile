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

# Copy the Hub application
COPY apps/hub/ ./apps/hub/

# Set working directory to Hub
WORKDIR /app/apps/hub

# Install hub-specific dependencies
RUN bun install

# Generate Prisma client
RUN bunx prisma generate

# Expose the port your Hub runs on
EXPOSE 8081

# Add environment variable support
ENV NODE_ENV=production
ENV REWARD_PER_TICK=1

# Start the application
CMD ["bun", "index.ts"] 
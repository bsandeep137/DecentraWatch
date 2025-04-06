# Use the official Bun image
FROM oven/bun:1 as base

# Set working directory
WORKDIR /app

# Copy root package files
COPY package.json .
COPY bun.lock .

# Install root dependencies
RUN bun install

# Copy the API application
COPY apps/api/ ./apps/api/

# Set working directory to API
WORKDIR /app/apps/api

# Install api-specific dependencies
RUN bun install

# Expose the port your API runs on
EXPOSE 3000

# Add environment variable support
ENV NODE_ENV=production
ENV JWT_SECRET=""

# Start the application
CMD ["bun", "index.ts"] 
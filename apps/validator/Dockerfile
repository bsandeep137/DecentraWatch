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

# Generate Prisma client
RUN bunx prisma generate

# Set working directory back to Validator
WORKDIR /app/apps/validator

# Copy the Validator application
COPY apps/validator/ ./apps/validator/

# Install validator-specific dependencies
RUN bun install

# Add environment variable support
ENV NODE_ENV=production
ENV VALIDATOR_SECRET_KEY=""

# Expose the port your Validator service runs on
EXPOSE 5000

# Start the application
CMD ["bun", "index.ts"] 
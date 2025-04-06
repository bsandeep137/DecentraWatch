# Use the official Bun image
FROM oven/bun:1 as base

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json .
COPY bun.lock .

# Install dependencies
RUN bun install

# Copy the rest of the application
COPY . .

# Build the application (if needed)
# RUN bun run build

# Expose the port your API runs on
EXPOSE 3000

# Add environment variable support
ENV NODE_ENV=production
ENV JWT_SECRET=""

# Start the application
CMD ["bun", "index.ts"] 
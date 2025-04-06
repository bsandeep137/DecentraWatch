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

# Expose the WebSocket port
EXPOSE 8081

# Add environment variable support
ENV NODE_ENV=production
ENV REWARD_PER_TICK=1

# Start the application
CMD ["bun", "index.ts"] 
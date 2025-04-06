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

# Add environment variable support
ENV NODE_ENV=production
ENV VALIDATOR_SECRET_KEY=""

# Expose the port your Validator service runs on
EXPOSE 5000

# Start the application
CMD ["bun", "index.ts"] 
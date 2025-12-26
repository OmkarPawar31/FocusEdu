# Use official Bun image (NOT Node.js - you're using Bun!)
FROM oven/bun:1.0.25

# Set working directory
WORKDIR /app

# Copy package files first (better caching)
COPY package.json bun.lockb* ./

# Install ALL dependencies first (need devDependencies for build)
RUN bun install --frozen-lockfile

# Copy the rest of the application code
COPY . .

# Build the Next.js app (requires devDependencies)
RUN bun run build

# Remove devDependencies after build (optional, saves space)
RUN rm -rf node_modules && bun install --production --frozen-lockfile

# Expose port 3000
EXPOSE 3000

# Set environment to production
ENV NODE_ENV=production

# Start the Next.js app
CMD ["bun", "start"]
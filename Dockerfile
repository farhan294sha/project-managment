# Use Node.js as the base image
FROM node:22-alpine

RUN apk add --no-cache openssl

# Set the working directory
WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm


COPY package.json pnpm-lock.yaml ./

COPY prisma ./

# Install dependencies using the lock file
RUN pnpm install --frozen-lockfile 

# Copy only package files first to leverage Docker caching
COPY . .

# Expose port 3000 for the Next.js app
EXPOSE 3000

# Run database migrations and start the development server
CMD ["sh", "-c", "pnpm run db:migrate && pnpm run dev"]

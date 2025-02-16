# Use Node.js as the base image
FROM node:22

# Set the working directory
WORKDIR /app


# Copy the rest of the app
COPY . .

# Copy the package files and install dependencies
RUN npm install -g pnpm && pnpm install && pnpm prisma generate

# Expose port 3000 for the Next.js app
EXPOSE 3000

# Run the Next.js development server
CMD ["pnpm", "dev"]

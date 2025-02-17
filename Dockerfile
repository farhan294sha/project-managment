# Use Node.js as the base image
FROM node:22-alpine

# Set the working directory
WORKDIR /app

# Copy the rest of the app
COPY . .

# Copy the package files and install dependencies
RUN npm install

# Generate the Prisma client
RUN npx prisma generate

# Expose port 3000 for the Next.js app
EXPOSE 3000

# Run database migrations and start the Next.js development server
CMD ["sh", "-c", "npm run db:migrate && npm run dev"]

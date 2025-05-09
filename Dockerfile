FROM node:18-alpine

WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./
RUN npm install

# Copy the entire project (including node_modules if needed)
COPY . .

# Set any environment variables your app needs
ENV PORT=5000
ENV NODE_ENV=production

# Try building in the container
RUN npm run build || echo "Build failed, but continuing"

# Expose the port your server runs on (5000 as shown in your output)
EXPOSE 5000

# Start the application
CMD ["npm", "start"]
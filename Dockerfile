# Use Node.js as the base image
FROM node:16

# Set the working directory
WORKDIR /app

# Copy dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Build the React app
RUN npm run build

# Serve the app
RUN npm install -g serve
CMD ["serve", "-s", "build"]

# Expose the port
EXPOSE 3000

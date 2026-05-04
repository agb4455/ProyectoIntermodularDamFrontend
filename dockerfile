# Stage 1: Build
FROM node:22-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Build the project (no backend URL injection needed as it uses relative paths via Nginx proxy)
# Copy the rest of the application code
COPY . .

# Build the project
# Angular 17+ uses the application builder which outputs to dist/<project-name>/browser
RUN npm run build -- --configuration production

# Stage 2: Runtime
FROM nginx:alpine

# Copy the built application from the build stage
# We use a wildcard to handle the project name automatically
COPY --from=build /app/dist/*/browser /usr/share/nginx/html

# Copy custom nginx configuration for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]

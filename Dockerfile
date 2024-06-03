# Stage 1: Build Angular application
FROM node:18 AS build
WORKDIR /app

# Ensure npm and Angular cache are cleaned
RUN npm install -g @angular/cli@latest
RUN npm cache clean --force

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Clear Angular cache and build the Angular application
RUN ng cache clean
RUN ng build --verbose || (echo "Build failed" && exit 1)

# Stage 2: Serve Angular application with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

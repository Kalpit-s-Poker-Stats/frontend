# Use the official Node.js image as the base image
FROM node:14 AS build

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the Angular application
RUN npm run build -- --prod

# Use Nginx to serve the built Angular application
FROM nginx:alpine

# Copy the built Angular application from the build stage to the NGINX HTML directory
COPY --from=build /usr/src/app/dist/* /usr/share/nginx/html/

# Expose port 80
EXPOSE 80

# Start NGINX
CMD ["nginx", "-g", "daemon off;"]

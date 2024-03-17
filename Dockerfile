# Stage 1: Build Angular application
FROM node:14 AS build
WORKDIR /app
COPY package*.json /app/
RUN npm install
COPY . .
RUN npm run build

# Stage 2: Serve Angular application with Nginx
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]